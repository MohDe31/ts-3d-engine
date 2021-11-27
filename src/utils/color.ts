export type Color = {
    r: number,
    g: number,
    b: number
}

export type HSVColor = {
    h: number,
    s: number,
    v: number
}


export function rgbToString(color: Color): string {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
}


export function rgbNormal(color: Color): Color {
    return {
        r: color.r / 255,
        g: color.g / 255,
        b: color.b / 255,
    }
}

export function hsvToRgb(color: HSVColor): Color {
    const {h, s, v} = color;
    let c: number = s * v;
    let x: number = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m: number = v - c;

    let rgba_: Color;

    if(h >= 0   && h < 60 ) rgba_ = {r: c, g: x, b: 0};
    if(h >= 60  && h < 120) rgba_ = {r: x, g: c, b: 0};
    if(h >= 120 && h < 180) rgba_ = {r: 0, g: c, b: x};
    if(h >= 180 && h < 240) rgba_ = {r: 0, g: x, b: c};
    if(h >= 240 && h < 300) rgba_ = {r: x, g: 0, b: c};
    if(h >= 300 && h < 360) rgba_ = {r: c, g: 0, b: x};


    rgba_.r = (rgba_.r + m) * 255;
    rgba_.g = (rgba_.g + m) * 255;
    rgba_.b = (rgba_.b + m) * 255;

    return rgba_;
}


export function rgbToHsv(color: Color): HSVColor {
    let normalColor: Color = rgbNormal(color);

    let cMax: number = Math.max(...Object.values(normalColor));
    let cMin: number = Math.min(...Object.values(normalColor));

    let delta: number = cMax - cMin;

    let hue: number;

    if(delta == 0) {
        hue = 0;
    }else if(cMax == normalColor.r) {
        hue = 60 * (((normalColor.g - normalColor.b) / delta) % 6);
    }else if(cMax == normalColor.g) {
        hue = 60 * (((normalColor.b - normalColor.r) / delta) + 2);
    }else if(cMax == normalColor.b) {
        hue = 60 * (((normalColor.r - normalColor.g) / delta) + 4);
    }

    let saturation: number = cMax == 0 ? 0 : delta / cMax;

    return {
        h: hue,
        s: saturation,
        v: cMax,
    }
}