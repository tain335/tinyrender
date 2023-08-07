import { AmbientLight } from '../lights/AmbientLight';
import { DirectionLight } from '../lights/DirectionLight';
import { Light } from '../lights/Ligiht';
import { PointLight } from '../lights/PointLight';
import { RGB } from '../utils/Color';
import { Matrix } from '../utils/Matrix';
import { Point } from '../utils/Point';
import { Vector } from '../utils/Vector';

export abstract class Entity {
  public color: RGB = new RGB(255, 255, 255);

  public specular = -1;

  public reflective = -1;

  getColor() {
    return this.color;
  }

  abstract applyMatrix(matrix: Matrix): Entity;

  abstract intersect(o: Point, v: Vector): number[];

  abstract getNormal(P: Point): Vector;
}
