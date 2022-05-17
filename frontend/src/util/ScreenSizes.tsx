export class ScreenSizes {
    public static readonly IPHONE = new ScreenSizes("IPhone", 1170, 2532);
    public static readonly ANDROID = new ScreenSizes("Android", 1080, 2460)

    private constructor(public readonly name: string, public readonly width: number, public readonly height: number) {}
}