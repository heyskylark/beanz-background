import { rgbToHex } from "./ColorUtil";

export function fillCanvasWithClampedArray(
    canvasWidth: number,
    canvasHeight: number,
    context: CanvasRenderingContext2D,
    fillColor: Uint8ClampedArray
) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = rgbToHex(fillColor);
    context.fillRect(0, 0, canvasWidth, canvasHeight);
}

export function fillCanvasWithHexColor(
    canvasWidth: number,
    canvasHeight: number,
    context: CanvasRenderingContext2D,
    fillColorHex: string
) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = fillColorHex;
    context.fillRect(0, 0, canvasWidth, canvasHeight);
}
