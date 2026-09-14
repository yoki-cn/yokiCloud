import type { APIRoute, GetStaticPaths } from "astro";

const markdownSources = import.meta.glob<string>("./*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

function slugFromPath(path: string) {
  return path.replace(/^\.\//, "").replace(/\.md$/, "");
}

export const getStaticPaths: GetStaticPaths = () =>
  Object.entries(markdownSources).map(([path, source]) => {
    const slug = slugFromPath(path);
    return {
      params: { slug },
      props: {
        source,
        filename: `${slug}.md`,
      },
    };
  });

export const GET: APIRoute = ({ props }) => {
  const source = typeof props.source === "string" ? props.source : "";
  const filename = typeof props.filename === "string" ? props.filename : "article.md";
  const asciiFilename = filename.replace(/[^\x20-\x7e]|["\\]/g, "_");
  const encodedFilename = encodeURIComponent(filename).replace(/[!'()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`
  );

  return new Response(source, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`,
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
