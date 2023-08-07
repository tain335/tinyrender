import { Matrix } from './Matrix';
import { Point } from './Point';

export class Vector {
  public nums = [0, 0, 0, 1];

  constructor(x: number, y: number, z: number) {
    this.nums = [x, y, z, 1];
  }

  set x(v: number) {
    this.nums[0] = v;
  }

  get x() {
    return this.nums[0];
  }

  set y(v: number) {
    this.nums[1] = v;
  }

  get y() {
    return this.nums[1];
  }

  set z(v: number) {
    this.nums[2] = v;
  }

  get z() {
    return this.nums[2];
  }

  static fromPoint(p: Point) {
    return new Vector(p.x, p.y, p.z);
  }

  static towards(from: Point, to: Point) {
    return new Vector(to.x - from.x, to.y - from.y, to.z - from.z);
  }

  inverse() {
    return this.scale(-1);
  }

  clone(): Vector {
    return new Vector(this.x, this.y, this.z);
  }

  toPoint(): Point {
    return new Point(this.x, this.y, this.z);
  }

  rotate(axis: 'x' | 'y' | 'z', angle: number): Vector {
    const v = this.clone();
    let polar = [0, 0];
    switch (axis) {
      case 'z':
        v.z = 0;
        polar = [v.mod(), Math.atan2(v.y, v.x)];
        polar[1] += angle;
        v.y = polar[0] * Math.sin(polar[1]);
        v.x = polar[0] * Math.cos(polar[1]);
        v.z = this.z;
        return v;
      case 'y':
        v.y = 0;
        polar = [v.mod(), Math.atan2(v.z, v.x)];
        polar[1] += angle;
        v.z = polar[0] * Math.sin(polar[1]);
        v.x = polar[0] * Math.cos(polar[1]);
        v.y = this.y;
        return v;
      case 'x':
        v.x = 0;
        polar = [v.mod(), Math.atan2(v.z, v.y)];
        polar[1] += angle;
        v.z = polar[0] * Math.sin(polar[1]);
        v.y = polar[0] * Math.cos(polar[1]);
        v.x = this.x;
        return v;
      default:
        throw new Error(`unknow axis: ${axis}`);
    }
  }

  rotateX(angle: number) {
    return this.rotate('x', angle);
  }

  rotateY(angle: number) {
    return this.rotate('y', angle);
  }

  rotateZ(angle: number) {
    return this.rotate('z', angle);
  }

  scaleX(factor: number) {
    return this.scaleXYZ(factor, 1, 1);
  }

  scaleY(factor: number) {
    return this.scaleXYZ(1, factor, 1);
  }

  scaleZ(factor: number) {
    return this.scaleXYZ(1, 1, factor);
  }

  scale(factor: number) {
    return this.scaleXYZ(factor, factor, factor);
  }

  scaleXYZ(xFactor: number, yFactor: number, zFactor: number) {
    return new Vector(this.x * xFactor, this.y * yFactor, this.z * zFactor);
  }

  applyMatrix(m: Matrix) {
    const v = this.clone();
    // row
    for (let i = 0; i < 4; i++) {
      let total = 0;
      // column
      for (let j = 0; j < 4; j++) {
        total += m.nums[i * 4 + j] * this.nums[j];
      }
      v.nums[i] = total;
    }
    return v;
  }

  add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  minus(v: Vector) {
    return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  dot(v: Vector) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  mod() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }
}
