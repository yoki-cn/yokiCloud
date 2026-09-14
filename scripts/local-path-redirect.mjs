import { withBasePath } from "./site-path.mjs";

// Development-only compatibility for bookmarks created before the Pages prefix.
// Leave Vite module requests and unknown routes untouched.
export function localPathRedirect(base) {
  return (request, response, next) => {
    if (!["GET", "HEAD"].includes(request.method)) return next();
    const raw = request.originalUrl || request.url || "/";
    const pathname = raw.split("?")[0];
    if (!/^\/(?:$|(?:algorithms|posts|admin|ui-kit)(?:\/|$))/.test(pathname)) return next();
    const target = withBasePath(raw, base);
    if (target === raw) return next();
    response.statusCode = 302;
    response.setHeader("Location", target);
    response.setHeader("Cache-Control", "no-store");
    response.end();
  };
}

export default function localPathRedirectPlugin(base) {
  return {
    name: "yoki-local-path-redirect",
    apply: "serve",
    enforce: "post",
    configureServer(server) {
      // Astro prepends its base-path guard after setup; install ahead of it.
      return () => { server.middlewares.stack.unshift({ route: "", handle: localPathRedirect(base) }); };
    },
    configurePreviewServer(server) {
      return () => { server.middlewares.stack.unshift({ route: "", handle: localPathRedirect(base) }); };
    },
  };
}
