export function wheelZoom(scale: number, deltaY: number, deltaMode: number, viewportHeight: number) {
  const pixels = deltaY * (deltaMode === 1 ? 16 : deltaMode === 2 ? viewportHeight : 1);
  return Math.min(3, Math.max(0.1, scale * Math.exp(-Math.max(-200, Math.min(200, pixels)) * 0.005)));
}
