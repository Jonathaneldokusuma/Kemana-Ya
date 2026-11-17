import { createElement } from "react";

function renderNode(node, key) {
  // Ubah data ikon jadi elemen SVG.
  return createElement(
    node.tag,
    { ...node.attrs, key },
    ...node.children.map(renderNode),
  );
}

export default function Icon({ src, className = "", alt: _alt, ...props }) {
  // Kalau ikonnya kosong, nggak usah dirender.
  if (!src) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={src.viewBox}
      className={`icon ${className}`.trim()}
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      {src.nodes.map(renderNode)}
    </svg>
  );
}
