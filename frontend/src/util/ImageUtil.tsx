/**
 * Finds the default background color of a given image.
 * Fairly rudimentary right now, as it just samples a color from the upper corner.
 * This can be problamatic if the background is busy.
 * But will be implementing something like a median cut quantization algorithm to find the dominant color.
 * @param canvas Canvas context
 * @param image The image to sample the color from
 * @returns Image color data returned from the canvas context
 */
export function sampleColorFromImage(canvas: HTMLCanvasElement, image: HTMLImageElement): ImageData | undefined {
    const context = canvas.getContext('2d');
    context?.drawImage(image, 0, 0);
    const imgData = context?.getImageData(1, 1, 1, 1);

    return imgData;
}
