import converter from "color-convert";
import {Color} from '../models/color';



class ColorConverter {
    private extractValues(raw: string): [number, number, number] {
        return (raw.match(/[0-9]+/g) || []).map(Number).slice(0, 3) as [number, number, number];
    }

    convert(raw: string): Color {
        let color = new Color();
        if (raw.match("rgb")) {
            color.rgb.raw = raw;
            color.rgb.values = this.extractValues(raw);
            color.hsl.values = converter.rgb.hsl(color.rgb.values);
            color.hsl.raw = `hsl(${color.hsl.values[0]}, ${color.hsl.values[1]}%, ${color.hsl.values[2]}%)`
            color.hex.raw = `#${converter.rgb.hex(color.rgb.values)}`
        }
        if (raw.match('hsl')) {
            color.hsl.raw = raw;
            color.hsl.values = this.extractValues(raw);
            color.rgb.values = converter.hsl.rgb(color.hsl.values);
            color.rgb.raw = `rgb(${color.rgb.values[0]}, ${color.rgb.values[1]}, ${color.rgb.values[2]})`
            color.hex.raw = `#${converter.hsl.hex(color.hsl.values)}`;
        }

        return color;
    }

    
  
}

export const colorConverter = new ColorConverter();
