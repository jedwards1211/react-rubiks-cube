function mmulRotation(a, b, c) {
  if (!c) c = [];
  c[0] = a[0] * b[0] + a[4] * b[1] + a[8] * b[2];
  c[1] = a[1] * b[0] + a[5] * b[1] + a[9] * b[2];
  c[2] = a[2] * b[0] + a[6] * b[1] + a[10] * b[2];
  c[3] = 0;
  c[4] = a[0] * b[4] + a[4] * b[5] + a[8] * b[6];
  c[5] = a[1] * b[4] + a[5] * b[5] + a[9] * b[6];
  c[6] = a[2] * b[4] + a[6] * b[5] + a[10] * b[6];
  c[7] = 0;
  c[8] = a[0] * b[8] + a[4] * b[9] + a[8] * b[10];
  c[9] = a[1] * b[8] + a[5] * b[9] + a[9] * b[10];
  c[10] = a[2] * b[8] + a[6] * b[9] + a[10] * b[10];
  c[11] = 0;
  c[12] = b[12];
  c[13] = b[13];
  c[14] = b[14];
  c[15] = 1;
  return c;
}

function mvmulRotation(a, b, c) {
  if (!c) c = []; 
  c[0] = a[0] * b[0] + a[4] * b[1] + a[8] * b[2];
  c[1] = a[1] * b[0] + a[5] * b[1] + a[9] * b[2];
  c[2] = a[2] * b[0] + a[6] * b[1] + a[10] * b[2];
  return c;
}

function rotX(angle) {
  var s = Math.sin(angle);
  var c = Math.cos(angle);
  return [1,0,0,0,0,c,-s,0,0,s,c,0,0,0,0,1];
}

function rotY(angle) {
  var s = Math.sin(angle);
  var c = Math.cos(angle);
  return [c,0,s,0,0,1,0,0,-s,0,c,0,0,0,0,1];
}

function rotZ(angle) {
  var s = Math.sin(angle);
  var c = Math.cos(angle);
  return [c,-s,0,0,s,c,0,0,0,0,1,0,0,0,0,1];
}

var rot = [rotX, rotY, rotZ];

export {mvmulRotation, mmulRotation, rotX, rotY, rotZ, rot};