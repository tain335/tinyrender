const { sin } = Math;
const { cos } = Math;
export class Matrix {
  constructor(public nums: number[]) {
    this.nums = nums;
    if (nums.length !== 16) {
      throw new Error('matrix must be 16 elements');
    }
  }

  static identity() {
    // prettier-ignore
    return new Matrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  clone() {
    return new Matrix(this.nums.slice());
  }

  apply(m: Matrix) {
    const newMatrix = Matrix.identity();
    // row
    for (let i = 0; i < 4; i++) {
      // col
      for (let j = 0; j < 4; j++) {
        let total = 0;
        for (let k = 0; k < 4; k++) {
          total += m.nums[i * 4 + k] * this.nums[k * 4 + j];
        }
        newMatrix.nums[i * 4 + j] = total;
      }
    }
    return newMatrix;
  }

  rotateZ(angle: number) {
    // prettier-ignore
    const m = new Matrix([
      cos(angle), cos(Math.PI / 2 + angle), 0, 0,
      sin(angle), sin(Math.PI / 2 + angle), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
    return this.apply(m);
  }

  rotateX(angle: number) {
    // prettier-ignore
    const m = new Matrix([
      1, 0, 0, 0,
      0, cos(Math.PI / 2 + angle), cos(angle), 0,
      0, sin(Math.PI / 2 + angle), sin(angle), 0,
      0, 0, 0, 1
    ]);
    return this.apply(m);
  }

  rotateY(angle: number) {
    // prettier-ignore
    const m = new Matrix([
      cos(angle), 0, cos(Math.PI / 2 + angle), 0,
      0, 1, 0, 0,
      sin(angle), 0, sin(Math.PI / 2 + angle), 0,
      0, 0, 0, 1
    ]);
    this.apply(m);
    return this;
  }

  scale(xFactor: number, yFactor: number, zFactor: number) {
    // prettier-ignore
    const m = new Matrix([
      xFactor, 0, 0, 0,
      0, yFactor, 0, 0,
      0, 0, zFactor, 0,
      0, 0, 0, 1
    ]);
    return this.apply(m);
  }

  scaleX(factor: number) {
    return this.scale(factor, 1, 1);
  }

  scaleY(factor: number) {
    return this.scale(1, factor, 1);
  }

  scaleZ(factor: number) {
    return this.scale(1, 1, factor);
  }

  translate(distanceX: number, distanceY: number, distanceZ: number) {
    // prettier-ignore
    const m = new Matrix([
      1, 0, 0, distanceX,
      0, 1, 0, distanceY,
      0, 0, 1, distanceZ,
      0, 0, 0, 1
    ]);
    return this.apply(m);
  }

  translateX(distance: number) {
    return this.translate(distance, 0, 0);
  }

  translateY(distance: number) {
    return this.translate(0, distance, 0);
  }

  translateZ(distance: number) {
    return this.translate(0, 0, distance);
  }

  equal(m: Matrix) {
    for (let i = 0; i < this.nums.length; i++) {
      if (this.nums[i] !== m.nums[i]) {
        return false;
      }
    }
    return true;
  }
}

// function Test() {
//   const m1 = Matrix.identity().translate(20, 30, 30);
//   const m2 = Matrix.identity().translate(-20, -10, -10);
//   const result = m1.apply(m2).equal(Matrix.identity().translate(0, 20, 20));
//   console.log(result);
// }
// Test();
