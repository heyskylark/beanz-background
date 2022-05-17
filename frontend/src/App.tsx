import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar';
import { WallpaperState } from './enum/WallpaperState';
import { fillCanvasWithClampedArray, fillCanvasWithHexColor } from './util/CanvasUtil';
import { sampleColorFromImage } from './util/ImageUtil';
import { ScreenSizes } from './util/ScreenSizes';

function App() {
  // TODO: Use this to pair azuki and bean: https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=7625&beanzId=3016
  const  beanzMax = 19950
  const azukiMax = 10000
  const defaultBackground = "#dedede";
  const beanzLogoUrl = "./images/beanz-sticker.png";

  const [beanzId, setBeanzId] = useState<string>(Math.floor((Math.random() * beanzMax)).toString());
  const [azukiId, setAzukiId] = useState<string>(Math.floor((Math.random() * azukiMax)).toString());

  const imgRef = useRef<HTMLImageElement>(null)
  const [wallpaperState, setWallpaperState] = useState<WallpaperState>(WallpaperState.BEANZ);
  const [loading, setLoading] = useState<boolean>(false);
  const [resolution, setResolution] = useState<ScreenSizes>(ScreenSizes.IPHONE);
  const [beanzLogo, setBeanzLogo] = useState<HTMLImageElement | undefined>();
  const [beanzLogoLoaded, setBeanzLogoLoaded] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
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
  }, [beanzLogoLoaded, wallpaperState]);

  function beanzIdInput(e: React.ChangeEvent<HTMLInputElement>) {
    const eventInput = e.target.value
    const value = parseInt(e.target.value)

    if (eventInput.length === 0 || (value >= 0 && value < beanzMax)) {
      setBeanzId(eventInput)
    }
  }

  function azukiIdInput(e: React.ChangeEvent<HTMLInputElement>) {
    const eventInput = e.target.value
    const value = parseInt(e.target.value)

    if (eventInput.length === 0 || (value >= 0 && value < azukiMax)) {
      setAzukiId(eventInput)
    }
  }

  function getBeanzUrl(): string {
    return `https://azkimg.imgix.net/images/final-${beanzId}.png`;
  }

  function getSelfieModeUrl(id: string): string {
    return `https://azkimg.imgix.net/images_squareface/final-${id}.png?fm=jpg&w=800`;
  }

  function getPairModeUrl(): string {
    return `https://api.heyskylark.xyz/pair?azukiId=${azukiId}&beanzId=${beanzId}`;
  }

  function drawTemporaryCanvas(): void {
    const canvas = document.createElement("canvas");
    const img = imgRef.current
    const context = canvas?.getContext('2d');

    if (img && canvas && context) {
      context.canvas.width = resolution.width;
      context.canvas.height = resolution.height;

      fillCanvasWithHexColor(resolution.height, resolution.width, context, defaultBackground);

      const dataUrl = canvas.toDataURL();
      img.src = dataUrl;
    }
  }

  function updateBeanzBackground(event: React.FormEvent<HTMLFormElement> | undefined): void {
    event?.preventDefault();
    setLoading(true)

    var imageUrl;
    if (wallpaperState === WallpaperState.BEANZ) {
      imageUrl = getBeanzUrl();
    } else {
      imageUrl = getPairModeUrl();
      console.log(imageUrl)
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;

    image.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const backgroundColor = sampleColorFromImage(canvas, image)?.data
      

      // TODO: Make a default color as to not rely on null check
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
      context.canvas.width = resolution.width;
      context.canvas.height = resolution.height;

      fillCanvasWithClampedArray(resolution.width, resolution.height, context, fillColor);
      renderBean(beanzImage, fillColor, context);
      renderBeanzLogo(context);

      const dataUrl = canvas.toDataURL();
      img.src = dataUrl;
    }

    setLoading(false);
  }

  function renderBeanzLogo(context: CanvasRenderingContext2D) {
    if (beanzLogo) {
      const logoWidth = beanzLogo.width * .9;
      const logoHeight = beanzLogo.height * .9;
      const logoCenter = (resolution.width / 2) - (logoWidth / 2);
      context.drawImage(beanzLogo, logoCenter, 1000, logoWidth, logoHeight);
    } else {
      console.log("Beanz logo not finished loading yet.")
    }
  }

  function renderBean(beanzImage: HTMLImageElement, fillColor: Uint8ClampedArray, context: CanvasRenderingContext2D) {
    const beanzWidth = beanzImage.width * .55;
    const beanzHeight = beanzImage.height * .55;

    const beanzCenterOffset = findBeanzCenterOffset(beanzImage, fillColor);
    const beanzCanvasCenter = ((resolution.width / 2) - (beanzWidth / 2)) + beanzCenterOffset;
    const beanzCanvasHeight = resolution.height - beanzHeight;
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
      <NavigationBar 
        beanzId={beanzId}
        azukiId={azukiId}
        wallpaperState={wallpaperState}
        setWallpaperState={setWallpaperState}
        updateBeanzBackground={updateBeanzBackground}
        beanzIdInput={beanzIdInput}
        azukiIdInput={azukiIdInput}
      />

      <div className={`flex justify-center opacity-base ${loading ? "loading" : "full-opacity"}`}>
        <img
          style={{width: resolution.width / 3, height: resolution.height / 3}}
          className='beanzCanvas rounded-2xl'
          alt="Azuki Beanz"
          ref={imgRef}
        />
      </div>
    </div>
  );
}

export default App;
