import { Entity } from './Entity';
import { Vector } from '../utils/Vector';
import { RGB } from '../utils/Color';
import { Point } from '../utils/Point';
import { Matrix } from '../utils/Matrix';

export class Sphere extends Entity {
  constructor(public pos: Point, public radius: number, color: RGB, specular: number, reflective: number) {
    super();
    this.pos = pos;
    this.radius = radius;
    this.color = color;
    this.specular = specular ?? -1;
    this.reflective = reflective ?? -1;
  }

  applyMatrix(matrix: Matrix): Entity {
    return new Sphere(this.pos.applyMatrix(matrix), this.radius, this.color, this.specular, this.reflective);
  }

  intersect(o: Point, v: Vector): [number, number] {
    const a = v.dot(v);
    const oc = Vector.towards(o, this.pos);
    const b = -2 * v.dot(oc);
    const c = oc.dot(oc) - this.radius * this.radius;
    const diff = b * b - 4 * a * c;
    if (diff < 0) {
      return [Infinity, Infinity];
    }
    const t1 = (-b + Math.sqrt(diff)) / (2 * a);
    const t2 = (-b - Math.sqrt(diff)) / (2 * a);
    return [t1, t2];
  }

  getNormal(P: Point): Vector {
    const n = Vector.towards(this.pos, P);
    return n.scale(1 / n.mod());
  }
}
