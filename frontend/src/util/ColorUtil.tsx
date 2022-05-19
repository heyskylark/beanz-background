function componentToHex(rgbColor: number) {
    var hex = rgbColor.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

export function rgbToHex(rgb: Uint8ClampedArray): string {
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

export function isLightColor(r: number, g: number, b: number): boolean {
    const linRGB = [r, g, b].map((color) => {
        const normalizedColor = color / 255.0;
        
        if (normalizedColor <= 0.03928) {
            return normalizedColor / 12.92
        } else {
            return Math.pow((normalizedColor + 0.055) / 1.055, 2.4)
        }
    });
    const luminance = (0.2126 * linRGB[0]) + (0.7152 * linRGB[1]) + (0.0722 * linRGB[2]);

    return luminance > 0.6;
}
