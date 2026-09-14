#!/usr/bin/env node
import { randomBytes, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { publishAdminContent } from "./publish-admin-content.mjs";

const host = process.env.YOKI_ADMIN_PUBLISH_HOST || "127.0.0.1";
const port = Number(process.env.YOKI_ADMIN_PUBLISH_PORT || 4317);
const maxBodyBytes = Number(process.env.YOKI_ADMIN_PUBLISH_MAX_BYTES || 8 * 1024 * 1024);
const publishToken = process.env.YOKI_ADMIN_PUBLISH_TOKEN || randomBytes(24).toString("base64url");
const tokenSource = process.env.YOKI_ADMIN_PUBLISH_TOKEN ? "env" : "generated";
if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("YOKI_ADMIN_PUBLISH_PORT must be an integer between 1 and 65535.");
}
if (!Number.isFinite(maxBodyBytes) || maxBodyBytes < 1_024 || maxBodyBytes > 64 * 1024 * 1024) {
  throw new Error("YOKI_ADMIN_PUBLISH_MAX_BYTES must be between 1024 and 67108864.");
}
if (Buffer.byteLength(publishToken, "utf8") < 16) {
  throw new Error("YOKI_ADMIN_PUBLISH_TOKEN must contain at least 16 bytes.");
}
const defaultAllowedOrigins = [
  "http://127.0.0.1:4321",
  "http://localhost:4321",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
].join(",");
const allowedOrigins = new Set(
  (process.env.YOKI_ADMIN_PUBLISH_ORIGINS || defaultAllowedOrigins)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
);

function sendJson(response, status, payload, origin = "") {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Headers": "Content-Type, X-Yoki-Publish-Token",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Vary": "Origin",
  };
  if (origin && allowedOrigins.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  response.writeHead(status, headers);
  response.end(JSON.stringify(payload, null, 2));
}

function isAllowedOrigin(origin) {
  return !origin || allowedOrigins.has(origin);
}

function isValidPublishToken(value) {
  if (typeof value !== "string" || !value) return false;
  const expected = Buffer.from(publishToken);
  const actual = Buffer.from(value);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let finished = false;
    request.on("data", (chunk) => {
      if (finished) return;
      size += chunk.length;
      if (size > maxBodyBytes) {
        finished = true;
        const error = new Error("Payload is too large.");
        error.statusCode = 413;
        reject(error);
        request.resume();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      if (!finished) resolve(Buffer.concat(chunks).toString("utf8"));
    });
    request.on("error", (error) => {
      if (!finished) reject(error);
    });
  });
}

let publishInFlight = false;

const server = createServer(async (request, response) => {
  const origin = request.headers.origin || "";
  const url = new URL(request.url || "/", `http://${host}:${port}`);

  if (request.method === "OPTIONS") {
    sendJson(response, isAllowedOrigin(origin) ? 204 : 403, {}, origin);
    return;
  }

  if (!isAllowedOrigin(origin)) {
    sendJson(response, 403, { ok: false, message: "Origin is not allowed." }, origin);
    return;
  }

  if (request.method === "GET" && url.pathname === "/health") {
    sendJson(response, 200, { ok: true, service: "yoki-admin-publish", port, authRequired: true, tokenSource }, origin);
    return;
  }

  if (request.method === "POST" && url.pathname === "/publish") {
    if (!isValidPublishToken(request.headers["x-yoki-publish-token"])) {
      sendJson(response, 401, { ok: false, message: "Invalid or missing publish token." }, origin);
      return;
    }
    if (publishInFlight) {
      sendJson(response, 409, { ok: false, message: "A publish build is already running." }, origin);
      return;
    }
    const contentType = String(request.headers["content-type"] || "").toLowerCase();
    if (!contentType.startsWith("application/json")) {
      sendJson(response, 415, { ok: false, message: "Content-Type must be application/json." }, origin);
      return;
    }
    publishInFlight = true;
    try {
      const raw = await readBody(request);
      let dataset;
      try {
        dataset = JSON.parse(raw);
      } catch {
        const error = new Error("Request body must be valid JSON.");
        error.statusCode = 400;
        throw error;
      }
      const result = await publishAdminContent(dataset, { build: true, prune: true });
      sendJson(response, 200, result, origin);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Publish failed.";
      const statusCode = Number(error?.statusCode) || (message.startsWith("Invalid admin dataset:") ? 400 : 500);
      sendJson(
        response,
        statusCode,
        {
          ok: false,
          message,
          build: error?.build
            ? {
                code: error.build.code,
                stdoutTail: error.build.stdout?.slice(-4000) || "",
                stderrTail: error.build.stderr?.slice(-4000) || "",
              }
            : null,
        },
        origin
      );
    } finally {
      publishInFlight = false;
    }
    return;
  }

  sendJson(response, 404, { ok: false, message: "Not found." }, origin);
});

server.listen(port, host, () => {
  console.log(`Yoki admin publish server listening on http://${host}:${port}`);
  console.log(`Publish token (${tokenSource}): ${publishToken}`);
  console.log("Open the admin console and use 发布构建 after editing content.");
});
