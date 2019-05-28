export class RGB {
    raw: string;
    values: [number, number, number]
}

export class HSL {
    raw: string;
    values: [number, number, number]
}

export class HEX {
    raw: string;
}

export enum ColorDisplayOption {
    HEX = "HEX",
    HSL = "HSL",
    RGB = "RGB"
}

export class Color {
    public rgb: RGB;
    public hsl: HSL;
    public hex: HEX;

    constructor() {
        this.rgb = new RGB();
        this.hsl = new HSL();
        this.hex = new HEX();

    }

    /**
   * HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
   */
    public getPerceivedBrightness(): number {
        let r: number, g: number, b: number, hsp: number;

        r = this.rgb.values[0];
        g = this.rgb.values[1];
        b = this.rgb.values[2];

        hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

        return hsp;
    }


}