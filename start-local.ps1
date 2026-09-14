param(
  [switch]$NoBrowser,
  [switch]$NoPublishServer,
  [switch]$NoAlgorithmSync,
  [int]$Port = 4321,
  [string]$ListenHost = "127.0.0.1",
  [int]$PublishPort = 4317,
  [string]$PublishHost = "127.0.0.1",
  [string]$PublishToken = "",
  [string]$AlgorithmSource = ""
)

$ErrorActionPreference = "Stop"

function Write-Step([string]$Message) {
  Write-Host "[Yoki Cloud] $Message" -ForegroundColor Cyan
}

function Exit-WithMessage([string]$Message) {
  Write-Host "[Yoki Cloud] $Message" -ForegroundColor Red
  exit 1
}

function Test-Command([string]$Name) {
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Test-HttpReady([string]$Url) {
  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
  } catch {
    return $false
  }
}

function Stop-LocalJob($Job) {
  if ($Job) {
    Stop-Job -Job $Job -ErrorAction SilentlyContinue | Out-Null
    Remove-Job -Job $Job -Force -ErrorAction SilentlyContinue | Out-Null
  }
}

function New-PublishToken {
  $bytes = New-Object byte[] 24
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  try {
    $rng.GetBytes($bytes)
  } finally {
    $rng.Dispose()
  }
  return [Convert]::ToBase64String($bytes).TrimEnd("=").Replace("+", "-").Replace("/", "_")
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

if (-not (Test-Command "node")) {
  Exit-WithMessage "未检测到 Node.js。请先安装 Node.js 22.12.0 或更高版本。"
}

if (-not (Test-Command "npm")) {
  Exit-WithMessage "未检测到 npm。请确认 Node.js 安装完整。"
}

$requiredVersion = [Version]"22.12.0"
$currentVersionText = node -p "process.versions.node"
$currentVersion = [Version]$currentVersionText

if ($currentVersion -lt $requiredVersion) {
  Exit-WithMessage "当前 Node.js 版本为 $currentVersionText，项目要求 >= 22.12.0。"
}

if (-not [string]::IsNullOrWhiteSpace($PublishToken) -and [Text.Encoding]::UTF8.GetByteCount($PublishToken) -lt 16) {
  Exit-WithMessage "发布令牌至少需要 16 个字节。请使用更长的随机令牌，或省略 -PublishToken 让启动脚本自动生成。"
}

$needsInstall = -not (Test-Path -LiteralPath (Join-Path $projectRoot "node_modules"))
$astroBin = Join-Path $projectRoot "node_modules\.bin\astro.cmd"

if (-not $needsInstall -and -not (Test-Path -LiteralPath $astroBin)) {
  $needsInstall = $true
}

if ($needsInstall) {
  Write-Step "正在安装依赖，请稍候..."
  npm install
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
}

$browserJob = $null
$publishJob = $null
$algorithmSyncJob = $null
$browserHost = if ($ListenHost -eq "0.0.0.0" -or $ListenHost -eq "::") { "127.0.0.1" } else { $ListenHost }
$localUrl = "http://${browserHost}:$Port"
$siteBase = if ($env:SITE_BASE) { '/' + $env:SITE_BASE.Trim('/') + '/' } else { '/yokiCloud/' }
if ($siteBase -eq '//') { $siteBase = '/' }
$previewUrl = $localUrl + $siteBase
$publishUrl = "http://${PublishHost}:$PublishPort"
$publishHealthUrl = "$publishUrl/health"

if (-not $NoAlgorithmSync) {
  Write-Step "正在同步 Obsidian 算法板子..."
  if ([string]::IsNullOrWhiteSpace($AlgorithmSource)) {
    node scripts/sync-algorithms.mjs
  } else {
    node scripts/sync-algorithms.mjs --source $AlgorithmSource
  }

  if ($LASTEXITCODE -eq 0) {
    $algorithmSyncJob = Start-Job -ScriptBlock {
      param($Root, $Source)
      Set-Location $Root
      if ([string]::IsNullOrWhiteSpace($Source)) {
        node scripts/sync-algorithms.mjs --watch
      } else {
        node scripts/sync-algorithms.mjs --watch --source $Source
      }
    } -ArgumentList $projectRoot, $AlgorithmSource
    Write-Step "算法板子监听已开启；保存 Obsidian 文件后，本地网站会自动更新。"
  } else {
    Write-Host "[Yoki Cloud] 算法板子同步未启动；网站仍会继续运行。" -ForegroundColor Yellow
  }
} else {
  Write-Step "已跳过算法板子同步与监听。"
}

if (-not $NoPublishServer) {
  if (Test-HttpReady $publishHealthUrl) {
    Write-Step "管理台发布服务已运行：$publishUrl"
    Write-Step "如需发布构建，请使用该发布服务启动时显示的发布令牌。"
  } else {
    if ([string]::IsNullOrWhiteSpace($PublishToken)) {
      $PublishToken = New-PublishToken
    }

    $allowedOrigins = @(
      $localUrl,
      "http://127.0.0.1:$Port",
      "http://localhost:$Port"
    ) | Sort-Object -Unique

    Write-Step "正在启动管理台发布服务：$publishUrl"
    Write-Step "本次发布令牌：$PublishToken"
    $publishJob = Start-Job -ScriptBlock {
      param($Root, $HostName, $PortNumber, $Origins, $Token)
      Set-Location $Root
      $env:YOKI_ADMIN_PUBLISH_HOST = $HostName
      $env:YOKI_ADMIN_PUBLISH_PORT = [string]$PortNumber
      $env:YOKI_ADMIN_PUBLISH_ORIGINS = $Origins
      $env:YOKI_ADMIN_PUBLISH_TOKEN = $Token
      node scripts/admin-publish-server.mjs
    } -ArgumentList $projectRoot, $PublishHost, $PublishPort, ($allowedOrigins -join ","), $PublishToken

    $publishReady = $false
    for ($i = 0; $i -lt 40; $i++) {
      Start-Sleep -Milliseconds 250
      if (Test-HttpReady $publishHealthUrl) {
        $publishReady = $true
        break
      }
      if ($publishJob.State -eq "Failed") {
        $jobOutput = Receive-Job -Job $publishJob -ErrorAction SilentlyContinue | Out-String
        Stop-LocalJob $publishJob
        Exit-WithMessage "管理台发布服务启动失败。$jobOutput"
      }
    }

    if (-not $publishReady) {
      Stop-LocalJob $publishJob
      Exit-WithMessage "管理台发布服务未能在 $publishUrl 响应，请检查端口 $PublishPort 是否被占用。"
    }
  }
} else {
  Write-Step "已跳过管理台发布服务；管理台的“发布构建”按钮将不可用。"
}

if (-not $NoBrowser) {
  $browserJob = Start-Job -ScriptBlock {
    param($Url)

    for ($i = 0; $i -lt 120; $i++) {
      Start-Sleep -Milliseconds 500
      try {
        Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 | Out-Null
        Start-Process $Url
        return
      } catch {
        # Wait until the dev server responds.
      }
    }
  } -ArgumentList $previewUrl
}

Write-Step "正在启动 Astro 本地开发服务器：$previewUrl"
Write-Step "管理台地址：${previewUrl}admin/"
Write-Step "关闭服务时，直接按 Ctrl + C。"

try {
  npm run dev -- --host $ListenHost --port $Port
  $exitCode = $LASTEXITCODE
} finally {
  Stop-LocalJob $browserJob
  Stop-LocalJob $publishJob
  Stop-LocalJob $algorithmSyncJob
}

exit $exitCode
