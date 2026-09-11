const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

function makeCRCTable() {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
}
const CRC_TABLE = makeCRCTable();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function ihdr(w, h) {
  const b = Buffer.alloc(13);
  b.writeUInt32BE(w, 0);
  b.writeUInt32BE(h, 4);
  b[8] = 8; // bit depth
  b[9] = 4; // color type: grayscale + alpha
  b[10] = 0;
  b[11] = 0;
  b[12] = 0;
  return b;
}

// Box-Muller, cached second value for efficiency.
let spare = null;
function gaussian(mean, std) {
  if (spare !== null) {
    const v = spare;
    spare = null;
    return mean + v * std;
  }
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const mag = Math.sqrt(-2 * Math.log(u));
  spare = mag * Math.sin(2 * Math.PI * v);
  return mean + mag * Math.cos(2 * Math.PI * v) * std;
}

// Pure black, alpha-only noise: a translucent speck, not an opaque tint.
// Composited with plain source-over, so a transparent nav stays transparent
// underneath it — no `background-blend-mode` needed, and none of the
// backdrop-filter blur gets silently painted over the way it did when the
// texture was an opaque grayscale image forced through `multiply`.
function makeGrainPng(outPath, w, h, meanAlpha, std) {
  const raw = Buffer.alloc((w * 2 + 1) * h);
  let idx = 0;
  for (let y = 0; y < h; y++) {
    raw[idx++] = 0; // filter type: none
    for (let x = 0; x < w; x++) {
      let a = Math.round(gaussian(meanAlpha, std));
      a = Math.max(0, Math.min(255, a));
      raw[idx++] = 0; // gray channel: black
      raw[idx++] = a; // alpha channel: the noise
    }
  }
  const idatData = zlib.deflateSync(raw, { level: 9 });
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const png = Buffer.concat([
    sig,
    chunk("IHDR", ihdr(w, h)),
    chunk("IDAT", idatData),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, png);
  console.log(`${outPath}: ${png.length} bytes, ${w}x${h}, meanAlpha=${meanAlpha} std=${std}`);
}

const outDir = process.argv[2];
makeGrainPng(path.join(outDir, "grain.png"), 160, 160, 4, 3);
makeGrainPng(path.join(outDir, "grain-heavy.png"), 160, 160, 6, 4);
