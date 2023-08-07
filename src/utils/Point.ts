import { Matrix } from './Matrix';
import { Vector } from './Vector';

export class Point {
  constructor(public x: number, public y: number, public z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  applyMatrix(matrix: Matrix): Point {
    return Vector.fromPoint(this).applyMatrix(matrix).toPoint();
  }

  addVector(v: Vector) {
    return new Point(this.x + v.x, this.y + v.y, this.z + v.z);
  }
}
