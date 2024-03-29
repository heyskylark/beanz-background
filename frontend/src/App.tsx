import React, { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import './App.css';
import NavigationBar from './components/NavigationBar';
import { LogoState } from './enum/LogoState';
import { WallpaperState } from './enum/WallpaperState';
import { fillCanvasWithClampedArray, fillCanvasWithHexColor } from './util/CanvasUtil';
import { isLightColor } from './util/ColorUtil';
import { sampleColorFromImage } from './util/ImageUtil';
import { ScreenSizes } from './util/ScreenSizes';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import serialToImageNameJson from './util/serialToImageNameJson';
import axios from 'axios';

function App() {
	// TODO: Use this to pair azuki and bean: https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=7625&beanzId=3016
	const  beanzMax = 19950
	const azukiMax = 10000
	const defaultBackground = "#dedede";
	const beanzLogoUrl = "./images/beanz-sticker.png";

	const imgRef = useRef<HTMLImageElement>(null)

	const [beanzId, setBeanzId] = useState<string>(Math.floor((Math.random() * beanzMax)).toString());
	const [azukiId, setAzukiId] = useState<string>(Math.floor((Math.random() * azukiMax)).toString());

	const [logoState, setLogoState] = useState<LogoState>(LogoState.BEANZ);
	const [wallpaperState, setWallpaperState] = useState<WallpaperState>(WallpaperState.BEANZ);

	const [loading, setLoading] = useState<boolean>(false);
	const [lastImage, setLastImage] = useState<HTMLImageElement | undefined>();
	const [lastUrl, setLastUrl] = useState<string>('');
	const [resolution, setResolution] = useState<ScreenSizes>(ScreenSizes.IPHONE);

	const [beanzLogo, setBeanzLogo] = useState<HTMLImageElement | undefined>();
	const [azukiLogo, setAzukiLogo] = useState<HTMLImageElement | undefined>();
	const [azukiLogoRed, setAzukiLogoRed] = useState<HTMLImageElement | undefined>();

	useEffect(() => {
		setLoading(true);
		drawTemporaryCanvas();

		const azukiLogoImage = new Image();
		azukiLogoImage.src = "/svg/azuki-logo.svg"
		azukiLogoImage.onload = function () {
			setAzukiLogo(azukiLogoImage);
		}

		const azukiLogoRedImage = new Image();
		azukiLogoRedImage.src = "/svg/azuki-logo-red.svg"
		azukiLogoRedImage.onload = function () {
			setAzukiLogoRed(azukiLogoRedImage);
		}

		const image = new Image();
		image.src = beanzLogoUrl;
		image.onload = function () {
			setBeanzLogo(image);
		}
	}, [])

	useEffect(() => {
		async function update() {
			if (beanzLogo && azukiLogo) {
				await updateBeanzBackground(undefined);
			}
		}

		update();
	}, [beanzLogo, azukiLogo, azukiLogoRed, wallpaperState, logoState]);

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

		if (eventInput.length === 0 || (value >= 0 && (value < azukiMax || (wallpaperState === WallpaperState.AZUKI && value < azukiMax + 1)))) {
			setAzukiId(eventInput)
		}
	}

	function getBeanzUrl(beanzId: string): string {
		return `https://azkimg.imgix.net/images/final-${beanzId}.png`;
	}

	function getPairModeUrl(azukiId: string, beanzId: string): string {
		return `https://5tsbt7xxr4.execute-api.us-west-2.amazonaws.com/dev/proxy?azukiId=${azukiId}&beanzId=${beanzId}`;
	}

	function getAzukiUrl(azukiId: string): string {
		if (parseInt(azukiId) === azukiMax) {
			return "/images/sire.jpg";
		} else {
			// @ts-ignore
			const uuid = serialToImageNameJson[azukiId];
			return `https://azk.imgix.net/images/${uuid}.png?fm=jpg&w=800`;
		}
	}

  	function getSelfieModeUrl(beanzId: string): string {
		return `https://azkimg.imgix.net/images_squareface/final-${beanzId}.png?fm=jpg&w=800`;
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

	function b64ToBlog(b64Data: any, contentType: string = '', sliceSize: number = 512) {
		const byteCharacters = atob(b64Data);
		const byteArrays = [];
		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);
			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}
		const blob = new Blob(byteArrays, { type: contentType });
		return blob;
	}

	async function updateBeanzBackground(event: React.FormEvent<HTMLFormElement> | undefined): Promise<void> {
		event?.preventDefault();
		setLoading(true)

		var imageUrl;
		if (wallpaperState === WallpaperState.BEANZ) {
			imageUrl = getBeanzUrl(beanzId);
			setLastUrl(imageUrl);
		} else if (wallpaperState === WallpaperState.PAIR) {
			const tempUrl = getPairModeUrl(azukiId, beanzId);

			if (lastUrl !== tempUrl || !lastImage) {
				const base64Data = await axios.get(tempUrl);
				imageUrl = URL.createObjectURL(b64ToBlog(base64Data.data, 'image/png'));
				setLastUrl(tempUrl);
			} else {
				imageUrl = lastImage.src
			}
		} else {
			imageUrl = getAzukiUrl(azukiId);
			setLastUrl(imageUrl);
		}
		
		if (lastImage?.src === imageUrl) {
			const canvas = document.createElement("canvas");
			canvas.width = lastImage.width;
			canvas.height = lastImage.height;
			const backgroundColor = sampleColorFromImage(canvas, lastImage)?.data
			

			// TODO: Make a default color as to not rely on null check
			if (backgroundColor) {
				drawBeanzCanvasToImage(lastImage, backgroundColor);
			}
		} else {
			const image = new Image();
			image.crossOrigin = "anonymous";
			image.src = imageUrl;

			setLastImage(image)

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

			image.onerror = function () {
				var toastMessage = "There was a problem getting your Beanz image 😮‍💨";
				if (wallpaperState === WallpaperState.PAIR || wallpaperState === WallpaperState.AZUKI) {
					toastMessage = "There was a problem getting your Azuki image 😮‍💨";
				}

				toast(toastMessage);
				setLoading(false);
			}
		}
	}

	function drawBeanzCanvasToImage(mainImage: HTMLImageElement, fillColor: Uint8ClampedArray) {
		const canvas = document.createElement("canvas");
		const img = imgRef.current
		const context = canvas?.getContext('2d');
		if (img && canvas && context && beanzLogo) {
			context.canvas.width = resolution.width;
			context.canvas.height = resolution.height;

			fillCanvasWithClampedArray(resolution.width, resolution.height, context, fillColor);
			renderBean(mainImage, fillColor, context);

			if (logoState === LogoState.AZUKI) {
				renderAzukiLogo(context, fillColor);
			} else if (logoState === LogoState.BOTH) {
				rendePairsLogo(context, fillColor);
			} else {
				renderBeanzLogo(context);
			}

			const dataUrl = canvas.toDataURL();
			img.src = dataUrl;
		}

		setLoading(false);
	}

	function rendePairsLogo(context: CanvasRenderingContext2D, fillColor: Uint8ClampedArray) {
		renderAzukiLogo(context, fillColor, .9, 30, 150);
		renderBeanzLogo(context, .6, -250, -90);
	}
	
	function renderAzukiLogo(
		context: CanvasRenderingContext2D,
		fillColor: Uint8ClampedArray,
		logoSizeOffset: number = .95,
		offsetX?: number,
		offsetY?: number
	) {
		var logo;
		if (isLightColor(fillColor[0], fillColor[0], fillColor[0])) {
			logo = azukiLogoRed;
		} else {
			logo = azukiLogo;
		}

		if (logo) {
			const logoWidth = logo.width * logoSizeOffset;
			const logoHeight = logo.height * logoSizeOffset;

			const logoHorizontalPosition = (resolution.width / 2) - (logoWidth / 2) + (offsetX ? offsetX : 0);
			const logoVerticalPosition = 1000 + (offsetY ? offsetY : 0);

			context.drawImage(logo, logoHorizontalPosition, logoVerticalPosition, logoWidth, logoHeight);
		} else {
			console.log("Azuki logo not finished loading yet.")
		}
	}

	function renderBeanzLogo(
		context: CanvasRenderingContext2D,
		logoSizeOffset: number = .9,
		offsetX?: number,
		offsetY?: number
	) {
		if (beanzLogo) {
			const logoWidth = beanzLogo.width * logoSizeOffset;
			const logoHeight = beanzLogo.height * logoSizeOffset;

			const logoHorizontalPosition = (resolution.width / 2) - (logoWidth / 2) + (offsetX ? offsetX : 0);
			const logoVerticalPosition = 1000 + (offsetY ? offsetY : 0);
			context.drawImage(beanzLogo, logoHorizontalPosition, logoVerticalPosition, logoWidth, logoHeight);
		} else {
			console.log("Beanz logo not finished loading yet.")
		}
	}

	function renderBean(mainImage: HTMLImageElement, fillColor: Uint8ClampedArray, context: CanvasRenderingContext2D) {
		const beanzWidth = wallpaperState === WallpaperState.BEANZ ? (mainImage.width * .55) : resolution.width;
		const beanzHeight = wallpaperState === WallpaperState.BEANZ ? (mainImage.height * .55) : resolution.width;

		const beanzCenterOffset = findBeanzCenterOffset(mainImage, fillColor);
		const beanzCanvasCenter = ((resolution.width / 2) - (beanzWidth / 2)) + beanzCenterOffset;
		const beanzCanvasHeight = resolution.height - beanzHeight;
		context.drawImage(mainImage, beanzCanvasCenter, beanzCanvasHeight, beanzWidth, beanzHeight);
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

		return 0;
	}

	function wallpaperStateSetter(wallpaperState: WallpaperState): void {
		if (wallpaperState !== WallpaperState.AZUKI && parseInt(azukiId) >= azukiMax) {
			setAzukiId(`${azukiMax - 1}`);
		}

		setWallpaperState(wallpaperState);
	}

	return (
		<div className='container mx-auto'>
			<ToastContainer />
			<NavigationBar 
				beanzId={beanzId}
				azukiId={azukiId}
				wallpaperState={wallpaperState}
				setWallpaperState={wallpaperStateSetter}
				logoState={logoState}
				setLogoState={setLogoState}
				updateBeanzBackground={updateBeanzBackground}
				beanzIdInput={beanzIdInput}
				azukiIdInput={azukiIdInput}
			/>

			<div className={`flex justify-center px-4 opacity-base ${loading ? "loading" : "full-opacity"}`}>
				<img
				style={{width: resolution.width / 3, height: resolution.height / 3}}
				className='beanzCanvas rounded-2xl'
				alt="Azuki Beanz"
				ref={imgRef}
				/>
			</div>

			<Footer />
		</div>
	);
}

export default App;
