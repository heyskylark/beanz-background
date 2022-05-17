import { WallpaperState } from "../enum/WallpaperState";

interface Props {
	beanzId: string,
	azukiId: string,
	wallpaperState: WallpaperState
	setWallpaperState: (wallpaperState: WallpaperState) => void
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
			default: {
				console.log("Invalid ID");
				break;
			}
		}
	}

	function pairsForm() {

	}

	function beanzForm() {

	}

	function renderForm() {
		return (
			<div>
				<form className='flex justify-center items-center px-8 mb-5' onSubmit={props.updateBeanzBackground}>
					<label className={`flex py-3 focus:border-red-300 focus-within:border-b-black border-b relative border-opacity-10 items-center border-black ${props.wallpaperState === WallpaperState.BEANZ ? "w-75 md:w-full" : "w-1/3 md:w-1/2 mr-4"}`}>
						<img className="w-7 h-7 mr-2" alt="Magnify glass" src="/images/magnify-glass.png" />
						<input 
							className='h-full text-base w-full z-10 focus:outline-none active:outline-none border-0 border-none bg-transparent text-black'
							type="number"
							inputMode="numeric"
							pattern="[0-9]*"
							value={props.beanzId}
							onChange={(e) => props.beanzIdInput(e)}
						/>
					</label>
					{ props.wallpaperState === WallpaperState.PAIR
						? <label className="flex md:w-1/2 w-1/3 py-3 focus:border-red-300 focus-within:border-b-black border-b relative border-opacity-10 items-center border-black">
								<input 
									className='h-full text-base w-full z-10 focus:outline-none active:outline-none border-0 border-none bg-transparent text-black'
									type="number"
									inputMode="numeric"
									pattern="[0-9]*"
									value={props.azukiId}
									onChange={(e) => props.azukiIdInput(e)}
								/>
							</label>
						: <></>
					}
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
				<div className="w-5/12 -ml-2 lg:ml-0 px-2 py-0 sm:px-0">
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
					</div>
				</div>
				<div className="flex items-center pb-0">
					{/* <button className="flex hover:opacity-50">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5">
								<path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
						</svg>
					</button> */}
				</div>
			</div>
		</div>
	);
}

export default NavigationBar;
