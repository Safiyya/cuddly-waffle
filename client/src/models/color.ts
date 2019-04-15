export class RGB {
    raw: string;
    values: [number, number, number]
}

export class HSL {
    raw: string;
    values: [number, number, number]
}

export class HEX{
    raw: string;
}

export default class Color {
    public rgb: RGB;
    public hsl: HSL;
    public hex:HEX;

    constructor(){
        this.rgb = new RGB();
        this.hsl = new HSL();
        this.hex = new HEX;
    }


}