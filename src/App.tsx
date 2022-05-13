import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { rgbToHex, sampleColor } from './util/ImageUtil';

function App() {
  // TODO: Use this to pair azuki and bean: https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=7625&beanzId=3016
  const  beanzMax = 19950
  const canvasWidth = 1170;
  const canvasHeight = 2532;
  const defaultBackground = "#dedede";
  const beanzLogoUrl = "./images/beanz-sticker.png";
  const beanzBaseUrl = "https://ikzttp.mypinata.cloud/ipfs/QmTRuWHr7bpqscUWFmhXndzf5AdQqkekhqwgbyJCqKMHrL/";

  const imgRef = useRef<HTMLImageElement>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [beanzId, setBeanzId] = useState<string>(Math.floor((Math.random() * beanzMax)).toString());
  const [beanzLogo, setBeanzLogo] = useState<HTMLImageElement | undefined>();
  const [beanzLogoLoaded, setBeanzLogoLoaded] = useState<boolean>(false);

  useEffect(() => {
    drawTemporaryCanvas();

    const image = new Image();
    image.src = beanzLogoUrl;

    image.onload = function () {
      setBeanzLogo(image);
      setBeanzLogoLoaded(true);
    }
  }, [])

  useEffect(() => {
    if (beanzLogoLoaded) {
      updateBeanzBackground(undefined);
    }
  }, [beanzLogoLoaded]);

  function beanzIdInput(e: React.ChangeEvent<HTMLInputElement>) {
    const eventInput = e.target.value
    const value = parseInt(e.target.value)

    if (eventInput.length === 0 || (value >= 0 && value < beanzMax)) {
      setBeanzId(eventInput)
    }
  }

  function getSelfieModeUrl(id: string): string {
    return `https://azkimg.imgix.net/images_squareface/final-${id}.png?fm=jpg&w=800`
  }

  function drawTemporaryCanvas(): void {
    const canvas = document.createElement("canvas");
    const img = imgRef.current
    const context = canvas?.getContext('2d');

    if (img && canvas && context) {
      context.canvas.width = canvasWidth;
      context.canvas.height = canvasHeight;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.fillStyle = defaultBackground;
      context.fillRect(0, 0, canvasWidth, canvasHeight);

      const dataUrl = canvas.toDataURL();
      img.src = dataUrl;
    }
  }

  function updateBeanzBackground(event: React.FormEvent<HTMLFormElement> | undefined): void {
    event?.preventDefault();
    setLoading(true)

    const imageUrl = `${beanzBaseUrl}${beanzId}.png`;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;

    image.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const backgroundColor = sampleColor(canvas, image)?.data
      
      if (backgroundColor) {
        drawBeanzCanvasToImage(image, backgroundColor);
      }
    }
  }

  function drawBeanzCanvasToImage(beanzImage: HTMLImageElement, fillColor: Uint8ClampedArray) {
    const canvas = document.createElement("canvas");
    const img = imgRef.current
    const context = canvas?.getContext('2d');
    if (img && canvas && context && beanzLogo) {
      context.canvas.width = canvasWidth;
      context.canvas.height = canvasHeight;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.fillStyle = rgbToHex(fillColor);
      context.fillRect(0, 0, canvasWidth, canvasHeight);

      renderBean(beanzImage, fillColor, context);

      const logoCenter = (canvasWidth / 2) - (beanzLogo.width / 2);
      context.drawImage(beanzLogo, logoCenter, 75, beanzLogo.width, beanzLogo.height);
      const dataUrl = canvas.toDataURL();
      img.src = dataUrl;
    }

    setLoading(false);
  }

  function renderBean(beanzImage: HTMLImageElement, fillColor: Uint8ClampedArray, context: CanvasRenderingContext2D) {
    const beanzWidth = beanzImage.width * .7;
    const beanzHeight = beanzImage.height * .7;

    const beanzCenterOffset = findBeanzCenterOffset(beanzImage, fillColor);
    const beanzCanvasCenter = (canvasWidth / 2) - (beanzWidth / 2) + beanzCenterOffset;
    const beanzCanvasHeight = canvasHeight - beanzHeight;
    context.drawImage(beanzImage, beanzCanvasCenter, beanzCanvasHeight, beanzWidth, beanzHeight);
  }

  /**
   * This function will measure the base color on both sides to attempt to center the Bean
   * @param beanzImage The image to center
   * @param bgColor The base background color
   * @returns An offset of which direction to nudge the Bean image in
   */
  function findBeanzCenterOffset(beanzImage: HTMLImageElement, bgColor: Uint8ClampedArray): number {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext('2d');
    context?.drawImage(beanzImage, 0, 0, beanzImage.width, beanzImage.height);
    // TODO: Use this data to make sure beanz isn't overlapping background
    const imgData = context?.getImageData(0, beanzImage.height / 2, 1, beanzImage.height);
    console.log(imgData);

    return 0;
  }

  return (
    <div className='container mx-auto'>
      <img className="h-7 p-2 rounded bg-azukired my-4 ml-6" alt="Azuki Logo" src="/images/azuki-logo.svg" />
      <form className='flex justify-center items-center px-8 mb-5' onSubmit={updateBeanzBackground}>
        <label className='flex w-80 py-3 focus:border-red-300 focus-within:border-b-black border-b relative border-opacity-10 items-center border-black'>
          <img className="w-7 h-7 mr-2 " alt="Magnify glass" src="/images/magnify-glass.png" />
          <input className='h-full text-sm w-full z-10 focus:outline-none active:outline-none border-0 border-none bg-transparent text-black' type="number" value={beanzId} onChange={(e) => beanzIdInput(e)}/>
        </label>
        <button className="flex relative text-xs ml-5 hover:opacity-60 duration-300 py-4 px-6 rounded bg-gray-200" type="submit">BEANZ!</button>
      </form>

      <div className={`flex justify-center p-4 md:p-0 opacity-base ${loading ? "loading" : ""}`}>
        <img className='beanzCanvas rounded-2xl' alt="Azuki Beanz" ref={imgRef}/>
      </div>
    </div>
  );
}

export default App;
