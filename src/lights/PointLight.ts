import { Light } from './Ligiht';
import { RGB } from '../utils/Color';
import { Point } from '../utils/Point';

export class PointLight extends Light {
  constructor(public pos: Point, intensity: number, color?: RGB) {
    super(intensity, color);
    this.pos = pos;
  }
}
