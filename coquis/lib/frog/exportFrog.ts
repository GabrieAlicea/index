const SVG_VIEWBOX_ASPECT = 220 / 200;

function triggerDownload(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function serializeSvg(svgElement: SVGSVGElement): Blob {
  const source = new XMLSerializer().serializeToString(svgElement);
  return new Blob([source], { type: "image/svg+xml;charset=utf-8" });
}

export function downloadFrogSvg(svgElement: SVGSVGElement, filename: string) {
  const url = URL.createObjectURL(serializeSvg(svgElement));
  triggerDownload(url, `${filename}.svg`);
  URL.revokeObjectURL(url);
}

export function downloadFrogPng(svgElement: SVGSVGElement, filename: string, size = 512) {
  const svgUrl = URL.createObjectURL(serializeSvg(svgElement));
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = Math.round(size * SVG_VIEWBOX_ASPECT);
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(svgUrl);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const pngUrl = URL.createObjectURL(blob);
      triggerDownload(pngUrl, `${filename}.png`);
      URL.revokeObjectURL(pngUrl);
    }, "image/png");
  };
  image.src = svgUrl;
}
