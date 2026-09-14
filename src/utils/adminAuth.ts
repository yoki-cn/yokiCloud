import {
  ADMIN_PASSWORD_ITERATIONS,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_HOURS,
  type AdminUser,
} from "../data/adminAuth";

export type AdminSessionPayload = {
  username: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  proof: string;
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function randomNonce() {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    return bytesToHex(bytes);
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createAdminPasswordSalt() {
  if (typeof crypto === "undefined" || typeof crypto.getRandomValues !== "function") {
    throw new Error("当前浏览器不支持安全随机数，无法创建密码盐值。");
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

async function createSessionProof(payload: Omit<AdminSessionPayload, "proof">, passwordHash: string) {
  const source = [
    payload.username,
    payload.issuedAt,
    payload.expiresAt,
    payload.nonce,
    passwordHash.toLowerCase(),
  ].join(":");
  return hashAdminPassword(source);
}

function encodeCookiePayload(payload: AdminSessionPayload) {
  const bytes = textEncoder.encode(JSON.stringify(payload));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeCookiePayload(value: string): AdminSessionPayload | null {
  try {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed = JSON.parse(textDecoder.decode(bytes)) as Partial<AdminSessionPayload>;
    if (
      typeof parsed.username !== "string" ||
      typeof parsed.issuedAt !== "number" ||
      typeof parsed.expiresAt !== "number" ||
      typeof parsed.nonce !== "string" ||
      typeof parsed.proof !== "string"
    ) {
      return null;
    }
    return {
      username: parsed.username,
      issuedAt: parsed.issuedAt,
      expiresAt: parsed.expiresAt,
      nonce: parsed.nonce,
      proof: parsed.proof,
    };
  } catch {
    return null;
  }
}

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const prefix = `${name}=`;
  return (
    document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith(prefix))
      ?.slice(prefix.length) || ""
  );
}

export async function hashAdminPassword(password: string) {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("当前浏览器不支持 WebCrypto，无法计算密码摘要。");
  }
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(password));
  return bytesToHex(new Uint8Array(digest));
}

export async function deriveAdminPasswordHash(
  password: string,
  salt: string,
  iterations = ADMIN_PASSWORD_ITERATIONS
) {
  if (!salt) return hashAdminPassword(password);
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("当前浏览器不支持 WebCrypto，无法计算密码摘要。");
  }
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: textEncoder.encode(salt),
      iterations,
    },
    key,
    256
  );
  return bytesToHex(new Uint8Array(bits));
}

export async function verifyAdminPassword(user: AdminUser, password: string) {
  const hash = user.passwordSalt
    ? await deriveAdminPasswordHash(password, user.passwordSalt, user.passwordIterations)
    : await hashAdminPassword(password);
  return hash === user.passwordHash;
}

export async function writeAdminSession(username: string, passwordHash: string, hours = ADMIN_SESSION_HOURS) {
  if (typeof document === "undefined") return null;
  const issuedAt = Date.now();
  const expiresAt = issuedAt + hours * 60 * 60 * 1000;
  const basePayload = {
    username,
    issuedAt,
    expiresAt,
    nonce: randomNonce(),
  };
  const payload: AdminSessionPayload = {
    ...basePayload,
    proof: await createSessionProof(basePayload, passwordHash),
  };
  const encoded = encodeURIComponent(encodeCookiePayload(payload));
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ADMIN_SESSION_COOKIE}=${encoded}; expires=${new Date(expiresAt).toUTCString()}; path=/; SameSite=Strict${secure}`;
  return payload;
}

export function clearAdminSession() {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_SESSION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export function readAdminSession() {
  const encoded = readCookie(ADMIN_SESSION_COOKIE);
  if (!encoded) return null;
  const payload = decodeCookiePayload(decodeURIComponent(encoded));
  if (!payload || payload.expiresAt <= Date.now()) {
    clearAdminSession();
    return null;
  }
  return payload;
}

export async function verifyAdminSession(users: AdminUser[]) {
  const session = readAdminSession();
  if (!session) return null;
  const user = users.find((item) => item.username === session.username);
  if (!user) return null;
  let expectedProof = "";
  try {
    expectedProof = await createSessionProof(
      {
        username: session.username,
        issuedAt: session.issuedAt,
        expiresAt: session.expiresAt,
        nonce: session.nonce,
      },
      user.passwordHash
    );
  } catch {
    clearAdminSession();
    return null;
  }
  if (expectedProof !== session.proof) {
    clearAdminSession();
    return null;
  }
  return user;
}
