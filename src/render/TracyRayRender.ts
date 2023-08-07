import { Entity } from '../entities/Entity';
import { AmbientLight } from '../lights/AmbientLight';
import { DirectionLight } from '../lights/DirectionLight';
import { Light } from '../lights/Ligiht';
import { PointLight } from '../lights/PointLight';
import { RGB } from '../utils/Color';
import { Point } from '../utils/Point';
import { Size } from '../utils/Size';
import { Vector } from '../utils/Vector';

export class TracyRayRender {
  lights: Light[] = [];

  entities: Entity[] = [];

  cameraPosition = new Point(0, 0, 0);

  viewportSize: Size = new Size(0, 0);

  canvasSize: Size = new Size(0, 0);

  viewportDistance = 1;

  constructor(public canvasContext: CanvasRenderingContext2D) {
    this.canvasContext = canvasContext;
  }

  setLights(lights: Light[]) {
    this.lights = lights;
    return this;
  }

  setEntities(entities: Entity[]) {
    this.entities = entities;
    return this;
  }

  setViewport(width: number, height: number) {
    this.viewportSize = new Size(width, height);
    return this;
  }

  setViewportDistance(distance: number) {
    this.viewportDistance = distance;
    return this;
  }

  setCameraPosition(pos: Point) {
    this.cameraPosition = pos;
    return this;
  }

  setCanvasSize(width: number, height: number) {
    this.canvasSize = new Size(width, height);
    this.canvasContext.canvas.width = width;
    this.canvasContext.canvas.height = height;
    return this;
  }

  canvasToViewportCoord(x: number, y: number) {
    const widthRatio = this.viewportSize.width / this.canvasSize.width;
    const heightRatio = this.viewportSize.height / this.canvasSize.height;
    return [
      (x - this.canvasSize.width / 2) * widthRatio,
      (this.canvasSize.height / 2 - y) * heightRatio,
      this.viewportDistance,
    ];
  }

  putPixel(x: number, y: number, color: RGB) {
    this.canvasContext.fillStyle = `rgba(${color.r},${color.g},${color.b},1)`;
    this.canvasContext.fillRect(x, y, 1, 1);
  }

  // eslint-disable-next-line
  computeLighting(entity: Entity, O: Point, P: Point, lights: Light[]): RGB {
    let I = 0;
    const reflectColor = new RGB(0, 0, 0);
    const N = entity.getNormal(P);
    for (let i = 0; i < lights.length; i++) {
      const l = lights[i];
      if (l instanceof AmbientLight) {
        I += l.intensity;
      } else {
        let L = new Vector(0, 0, 0);
        let tMax = Infinity;
        if (l instanceof PointLight) {
          L = Vector.towards(P, l.pos);
          tMax = 1.0;
        } else if (l instanceof DirectionLight) {
          L = l.direction;
        } else {
          throw new Error('unknown light type');
        }
        // 阴影效果
        const result = this.computeIntersect(P, L, 0.01, tMax);
        if (result) {
          // eslint-disable-next-line
          continue;
        }

        const cos = L.dot(N) / (L.mod() * N.mod());
        if (cos > 0) {
          I += l.intensity * cos;
        }
        if (entity.specular > 0) {
          const R = this.computeReflectVector(L, N);
          const p = Vector.towards(P, O);
          const cosa = R.dot(p) / (R.mod() * p.mod());
          if (cosa > 0) {
            I += l.intensity * cosa ** entity.specular;
          }
        }
      }
    }
    return entity.getColor().scale(I).add(reflectColor);
  }

  // eslint-disable-next-line
  computeReflectVector(v: Vector, N: Vector): Vector {
    const cos = v.dot(N) / (v.mod() * N.mod());
    const n = N.scale(v.mod() * cos);
    const R = n.scale(2).minus(v);
    return R;
  }

  computeIntersect(o: Point, v: Vector, min: number, max: number): { entity: Entity; t: number } | null {
    let closest = Infinity;
    const Min = min;
    const Max = max;
    let closestEntity = null;
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      const [t1, t2] = entity.intersect(o, v);
      if (t1 >= Min && t1 < Max && t1 <= closest) {
        closest = t1;
        closestEntity = entity;
      }
      if (t2 >= Min && t2 < Max && t2 <= closest) {
        closest = t2;
        closestEntity = entity;
      }
    }
    if (closestEntity) {
      return { entity: closestEntity, t: closest };
    }
    return null;
  }

  tracyRay(O: Point, v: Vector, reflectDepth: number): RGB {
    const result = this.computeIntersect(O, v, 0.001, Infinity);
    if (result?.entity) {
      const P = O.addVector(v.scale(result?.t));
      const localColor = this.computeLighting(result?.entity, O, P, this.lights);
      if (result.entity.reflective > 0 && reflectDepth > 0) {
        const N = result.entity.getNormal(P);
        const R = this.computeReflectVector(v.inverse(), N);
        const reflectColor = this.tracyRay(P, R, reflectDepth - 1);

        return localColor.scale(1 - result.entity.reflective).add(reflectColor.scale(result.entity.reflective));
      }
      return localColor;
    }
    return new RGB(0, 0, 0);
  }

  // 如何实现正射投影
  // 把原点修改xy坐标移动到对应viewport的点上得出向量(0, 0, 1)
  // 把模型的坐标都反向移动
  render() {
    for (let i = 0; i < this.canvasSize.width; i++) {
      for (let j = 0; j < this.canvasSize.height; j++) {
        const [x, y, z] = this.canvasToViewportCoord(i, j);
        const v = new Vector(x, y, z);
        const color = this.tracyRay(this.cameraPosition, v, 2);

        this.putPixel(i, j, color);
      }
    }
  }
}
