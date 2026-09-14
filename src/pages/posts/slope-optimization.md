---
layout: ../../layouts/ArticleLayout.astro
title: "斜率优化"
description: "动态规划斜率优化的几何映射、单调队列维护条件与 C++ 实现模板。"
date: "2026-05-12"
updated: "2026-05-12"
category: "DP"
source: 'G:\Algorithms\DP\斜率优化.md'
tags:
  - DP
  - Convex Hull Trick
  - Monotone Queue
  - Algorithm
toc:
  - id: "单调队列优化"
    label: "单调队列优化"
    level: 1
    children:
      - id: "适用场景"
        label: "适用场景"
        level: 2
      - id: "核心几何映射"
        label: "核心几何映射"
        level: 2
      - id: "工具代码"
        label: "工具代码"
        level: 2
      - id: "算法执行流程-思路框架"
        label: "算法执行流程"
        level: 2
---

# 斜率优化

## 单调队列优化

### 适用场景
- **问题特征：** 状态转移方程中存在与 $i$ 和 $j$ 相关的**乘积项**（例如 $a_i \cdot b_j$），导致无法直接分离变量使用普通单调队列。
- **复杂度优化：** $O(N^2) \to O(N)$
- **使用前提（严格要求双单调）：**
    1. **插入点的横坐标 $X_i$ 单调**（决定了可以在队尾维护凸包）。
    2. **查询直线的斜率 $K_i$ 单调**（决定了可以在队头淘汰非最优解）。
        _(若 $K_i$ 不单调，需保留队头并二分查找；若 $X_i$ 不单调，需上李超线段树或 CDQ 分治)

### 核心几何映射

将 DP 方程移项转化为直线方程 $y = kx + b$ 的形式：
- **$y$ (纵坐标)：** 仅与 $j$（历史决策）相关的项。
- **$x$ (横坐标)：** 仅与 $j$ 相关的乘积因子。
- **$k$ (斜率)：** 仅与 $i$（当前状态）相关的常数。
- **$b$ (截距)：** 包含所求 $dp[i]$ 的项。
- **目标**：
    - 求 $\min dp[i] \to$ 维护**下凸包** (下边界)。
    - 求 $\max dp[i] \to$ 维护**上凸包** (上边界)。

举例：
$$
\begin{aligned}
dp[i] &= dp[j] + a[i] \cdot b[j] + c[i] + d[j] \\
dp[j] + d[j] &= -a[i] \cdot b[j] + dp[i] - c[i]
\end{aligned}
$$

可以看出 $y=dp[j] + d[j],\ x = b[j],\ k = -a[i],\ b = dp[i] - c[i]$

### 工具代码

```cpp
// 向量/坐标点 结构体
struct Vec {
    i64 x, y;
    Vec(i64 x = 0, i64 y = 0) : x(x), y(y) {}
    Vec operator -(const Vec &o) const {
        return Vec(x - o.x, y - o.y);
    }
};
// A->B 旋转到 A->C，若逆时针则叉积 > 0，若顺时针则叉积 < 0
inline i128 cross(Vec A, Vec B, Vec C) {
    return (i128)(B.x - A.x) * (C.y - A.y) - (i128)(B.y - A.y) * (C.x - A.x);
}
// 比较向量 l 的斜率 l.y / l.x 是否小于等于(<=)目标斜率 k 的关系
inline bool check_slope(Vec l, i64 k) {
    // 若保证 x 单调递增 (l.x > 0)：
    // l.y / l.x <= k  =>  l.y <= k * l.x
    return l.y <= k * l.x; 
}
```

### 算法执行流程 (思路框架)

```cpp
// 模拟双端队列
vector<Vec> p(n + 1);
int head = 0, tail = 0;
// 2. 压入初始状态 (通常是 dp[0] 对应的坐标点)
p[tail] = Vec(x_0, y_0);
for (int i = 1; i <= n; ++ i) {
    // Step 1: 队头淘汰 (寻找最优决策点)
    // 根据求 Min/Max 和斜率 K_i 的增减性，判断队头两点斜率与 K_i 的关系。
    // 以 求 Min (下凸包) + 且 K_i 递增 为例：
    // 若 p[head] 到 p[head+1] 的斜率 <= K_i，说明 p[head+1] 优于 p[head]，淘汰队头
    while (tail > head && check_slope(p[head + 1] - p[head], k[i])) ++ head;
    // Step 2: 状态转移
    // 此时队头 p[head] 就是最优决策点 j，代入原方程计算出当前的 dp[i]
    // dp[i] = ... (利用 p[head].x 和 p[head].y 计算)
    
    // Step 3: 构造当前状态的新点
    // 根据刚算出的 dp[i]，生成要在坐标系上插入的新点
    Vec cur(x_i, y_i);
    
    // Step 4: 队尾维护 (将新点加入凸包)
    // 根据求 Min/Max 和横坐标 X_i 的增减性，利用叉积判断图形是凸还是凹。
    // 以 求 Min (下凸包) + 且 X_i 递增 为例：
    // 图形必须向左拐 (逆时针，cross > 0)，若 cross <= 0 说明出现了上凸(凹陷)，淘汰队尾
    while (tail > head && cross(p[tail - 1], p[tail], cur) <= 0) -- tail;
    // Step 5: 压入新点
    p[++ tail] = cur;
}
```
