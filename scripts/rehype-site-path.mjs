import { withBasePath } from "./site-path.mjs";

export default function rehypeSitePath({ base = "/" } = {}) {
  return function walk(node) {
    if (node.type === "element" && node.properties) {
      for (const key of ["href", "src", "poster"]) {
        if (typeof node.properties[key] === "string") {
          node.properties[key] = withBasePath(node.properties[key], base);
        }
      }
    }
    node.children?.forEach(walk);
  };
}
