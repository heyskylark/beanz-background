import { LogoState } from "../enum/LogoState";
import { WallpaperState } from "../enum/WallpaperState";

interface Props {
	beanzId: string,
	azukiId: string,
	wallpaperState: WallpaperState
	setWallpaperState: (wallpaperState: WallpaperState) => void
	logoState: LogoState
	setLogoState: (logoState: LogoState) => void
	updateBeanzBackground: (event: React.FormEvent<HTMLFormElement> | undefined) => void
	beanzIdInput: (e: React.ChangeEvent<HTMLInputElement>) => void
	azukiIdInput: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function NavigationBar(props: Props) {
	function wallpaperButtonEvent(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
		const buttonId = (event.target as HTMLButtonElement).id
		switch(buttonId) {
			case "Beanz": {
				props.setWallpaperState(WallpaperState.BEANZ);
				break;
			}
			case "Pairz": {
				props.setWallpaperState(WallpaperState.PAIR);
				break;
			}
			case "Azuki": {
				props.setWallpaperState(WallpaperState.AZUKI);
				break;
			}
			default: {
				console.log("Invalid ID");
				break;
			}
		}
	}

	function logoButtonEvent(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
		const buttonId = (event.target as HTMLButtonElement).id
		switch(buttonId) {
			case "beanzLogo": {
				props.setLogoState(LogoState.BEANZ);
				break;
			}
			case "bothLogo": {
				props.setLogoState(LogoState.BOTH);
				break;
			}
			case "azukiLogo": {
				props.setLogoState(LogoState.AZUKI);
				break;
			}
			default: {
				console.log("Invalid ID");
				break;
			}
		}
	}

	function renderForm() {
		let input = <></>
		switch(props.wallpaperState) {
			case WallpaperState.BEANZ: {
				input = (
					<label className="flex py-3 focus:border-red-300 focus-within:border-b-black border-b relative border-opacity-10 items-center border-black w-75 md:w-full">
						<img className="w-7 h-7 mr-2" alt="Magnify glass" src="/images/magnify-glass.png" />
						<input 
							className='h-full text-base w-full z-10 focus:outline-none active:outline-none border-0 border-none bg-transparent text-black'
							type="number"
							inputMode="numeric"
							pattern="[0-9]*"
							placeholder="Beanz Id..."
							value={props.beanzId}
							onChange={(e) => props.beanzIdInput(e)}
						/>
					</label>
				);
				break;
			}
			case WallpaperState.PAIR: {
				input = (
					<>
					<label className="flex py-3 focus:border-red-300 focus-within:border-b-black border-b relative border-opacity-10 items-center border-black w-1/3 md:w-1/2 mr-4">
						<img className="w-7 h-7 mr-2" alt="Magnify glass" src="/images/magnify-glass.png" />
						<input 
							className='h-full text-base w-full z-10 focus:outline-none active:outline-none border-0 border-none bg-transparent text-black'
							type="number"
							inputMode="numeric"
							pattern="[0-9]*"
							placeholder="Beanz Id..."
							value={props.beanzId}
							onChange={(e) => props.beanzIdInput(e)}
						/>
					</label>
					<label className="flex md:w-1/2 w-1/3 py-3 focus:border-red-300 focus-within:border-b-black border-b relative border-opacity-10 items-center border-black">
						<input 
							className='h-full text-base w-full z-10 focus:outline-none active:outline-none border-0 border-none bg-transparent text-black'
							type="number"
							inputMode="numeric"
							pattern="[0-9]*"
							placeholder="Azuki Id..."
							value={props.azukiId}
							onChange={(e) => props.azukiIdInput(e)}
						/>
					</label>
					</>
				);
				break;
			}
			case WallpaperState.AZUKI: {
				input = (
					<label className="flex py-3 focus:border-red-300 focus-within:border-b-black border-b relative border-opacity-10 items-center border-black w-75 md:w-full">
						<img className="w-7 h-7 mr-2" alt="Magnify glass" src="/images/magnify-glass.png" />
						<input 
							className='h-full text-base w-full z-10 focus:outline-none active:outline-none border-0 border-none bg-transparent text-black'
							type="number"
							inputMode="numeric"
							pattern="[0-9]*"
							placeholder="Azuki Id..."
							value={props.azukiId}
							onChange={(e) => props.azukiIdInput(e)}
						/>
					</label>
				);
				break;
			}
			default: input = <></>
		}

		return (
			<div>
				<form className='flex justify-center items-center px-8 mb-5' onSubmit={props.updateBeanzBackground}>
					{input}
					<button className="flex relative text-xs ml-5 hover:opacity-60 duration-300 py-4 px-6 rounded bg-gray-200" type="submit">
						{props.wallpaperState === WallpaperState.BEANZ ? "BEANZ!" : "PAIRZ!"}
					</button>
				</form>
			</div>
		)
	}

	return (
		<div>
			<div>
				<img className="h-7 p-2 rounded bg-azukired my-4 ml-6" alt="Azuki Logo" src="/svg/azuki-logo.svg" />
			</div>

			{renderForm()}
			
			<div className="flex mx-8 pb-3 mb-3 border-b border-opacity-10 border-black bg-white">
				<div className="w-6/12 -ml-2 md:mr-8 md:ml-0 px-2 py-0 sm:px-0">
					<div className="flex p-1 space-x-1 duration-300 bg-gray-200 lg:rounded-xl rounded">
						<button
							id="Beanz"
							className={`w-full lg:py-1.5 sm:py-1 sm:px-1 lg:text-xl text-xs leading-5 font-extrabold text-black lg:rounded-lg rounded-sm focus:outline-none hover:bg-white/[0.5] duration-300 ${props.wallpaperState === WallpaperState.BEANZ ? "bg-white" : ""}`}
							onClick={wallpaperButtonEvent}
						>
							BEANZ
						</button>
						<button
							id="Pairz"
							className={`w-full lg:py-1.5 sm:py-1 sm:px-1 lg:text-xl text-xs leading-5 font-extrabold text-black lg:rounded-lg rounded-sm focus:outline-none hover:bg-white/[0.5] duration-300 ${props.wallpaperState === WallpaperState.PAIR ? "bg-white" : ""}`}
							onClick={wallpaperButtonEvent}
						>
							PAIRZ
						</button>
						<button
							id="Azuki"
							className={`w-full lg:py-1.5 sm:py-1 sm:px-1 lg:text-xl text-xs leading-5 font-extrabold text-black lg:rounded-lg rounded-sm focus:outline-none hover:bg-white/[0.5] duration-300 ${props.wallpaperState === WallpaperState.AZUKI ? "bg-white" : ""}`}
							onClick={wallpaperButtonEvent}
						>
							AZUKI
						</button>
					</div>
				</div>
				<div className="flex justify-end w-6/12">
					<div className="w-full md:w-8/12 -ml-2 px-2 sm:px-0 py-0">
						{/* <button className="flex hover:opacity-50">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5">
									<path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
							</svg>
						</button> */}
						<div className="flex p-1 space-x-1 duration-300 bg-gray-200 lg:rounded-xl rounded justify-end">
							<button
								id="beanzLogo"
								className={`w-full lg:py-1.5 sm:py-1 sm:px-1 lg:text-xl text-xs leading-5 font-extrabold text-black lg:rounded-lg rounded-sm focus:outline-none hover:bg-white/[0.5] duration-300 ${props.logoState === LogoState.BEANZ ? "bg-white" : ""}`}
								onClick={logoButtonEvent}
							>
								BEANZ
							</button>
							<button
								id="bothLogo"
								className={`w-full lg:py-1.5 sm:py-1 sm:px-1 lg:text-xl text-xs leading-5 font-extrabold text-black lg:rounded-lg rounded-sm focus:outline-none hover:bg-white/[0.5] duration-300 ${props.logoState === LogoState.BOTH ? "bg-white" : ""}`}
								onClick={logoButtonEvent}
							>
								BOTH
							</button>
							<button
								id="azukiLogo"
								className={`w-full lg:py-1.5 sm:py-1 sm:px-1 lg:text-xl text-xs leading-5 font-extrabold text-black lg:rounded-lg rounded-sm focus:outline-none hover:bg-white/[0.5] duration-300 ${props.logoState === LogoState.AZUKI ? "bg-white" : ""}`}
								onClick={logoButtonEvent}
							>
								IKZ!
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NavigationBar;
