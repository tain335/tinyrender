import { RGB } from '../utils/Color';

export class Light {
  constructor(public intensity: number, public color?: RGB) {
    this.color = color;
    this.intensity = intensity;
  }
}
