import { clamp } from './Utils';

export class RGB {
  constructor(public r: number = 0, public g: number = 0, public b: number = 0) {
    this.r = clamp(r, 0, 255);
    this.g = clamp(g, 0, 255);
    this.b = clamp(b, 0, 255);
  }

  scale(factor: number) {
    return new RGB(this.r * factor, this.g * factor, this.b * factor);
  }

  add(color: RGB) {
    return new RGB(this.r + color.r, this.g + color.g, this.b + color.b);
  }
}
