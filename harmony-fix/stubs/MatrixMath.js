/**
 * MatrixMath stub - RN 0.72 removed this module
 * Provides basic matrix operations used by react-native-deprecated-custom-components
 */

function createIdentityMatrix() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function multiplyInto(a, b) {
  const result = new Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result[j * 4 + i] = 0;
      for (let k = 0; k < 4; k++) {
        result[j * 4 + i] += a[k * 4 + i] * b[j * 4 + k];
      }
    }
  }
  for (let i = 0; i < 16; i++) a[i] = result[i];
}

function reuseTranslate3dCommand(matrix, x, y, z) {
  const t = createIdentityMatrix();
  t[12] = x; t[13] = y; t[14] = z;
  multiplyInto(matrix, t);
}

function reusePerspectiveCommand(matrix, p) {
  const t = createIdentityMatrix();
  t[11] = -1 / p;
  multiplyInto(matrix, t);
}

function reuseScale3dCommand(matrix, x, y, z) {
  const t = createIdentityMatrix();
  t[0] = x; t[5] = y; t[10] = z;
  multiplyInto(matrix, t);
}

function reuseScaleXCommand(matrix, x) { reuseScale3dCommand(matrix, x, 1, 1); }
function reuseScaleYCommand(matrix, y) { reuseScale3dCommand(matrix, 1, y, 1); }

function reuseRotateXCommand(matrix, radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const t = createIdentityMatrix();
  t[5] = cos; t[6] = sin; t[9] = -sin; t[10] = cos;
  multiplyInto(matrix, t);
}

function reuseRotateYCommand(matrix, radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const t = createIdentityMatrix();
  t[0] = cos; t[2] = -sin; t[8] = sin; t[10] = cos;
  multiplyInto(matrix, t);
}

function reuseRotateZCommand(matrix, radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const t = createIdentityMatrix();
  t[0] = cos; t[1] = sin; t[4] = -sin; t[5] = cos;
  multiplyInto(matrix, t);
}

module.exports = {
  createIdentityMatrix,
  multiplyInto,
  reuseTranslate3dCommand,
  reusePerspectiveCommand,
  reuseScale3dCommand,
  reuseScaleXCommand,
  reuseScaleYCommand,
  reuseRotateXCommand,
  reuseRotateYCommand,
  reuseRotateZCommand,
};
