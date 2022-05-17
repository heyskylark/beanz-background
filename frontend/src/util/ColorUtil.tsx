function componentToHex(rgbColor: number) {
    var hex = rgbColor.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

export function rgbToHex(rgb: Uint8ClampedArray): string {
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}
