import { Light } from './Ligiht';
import { RGB } from '../utils/Color';
import { Vector } from '../utils/Vector';

export class DirectionLight extends Light {
  constructor(public direction: Vector, intensity: number, color?: RGB) {
    super(intensity, color);
    this.direction = direction;
  }
}
