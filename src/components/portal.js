const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uGather;
uniform float uIgnite;
uniform float uOpen;
uniform float uFly;
uniform float uCamZ0;
uniform float uWorld;
uniform float uTravel;
uniform float uDim;
uniform vec2 uMouse;

#define PI 3.14159265

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}
float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec3 hash31(float p) {
  vec3 p3 = fract(vec3(p) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xxy + p3.yzz) * p3.zyx);
}
vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}
float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm2(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise2(p);
    p = p * 2.02 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}
mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

vec3 gLocal;
float gId;

float ringDist(vec3 p, float ringR, float n, float seed, float zoff) {
  float ang = atan(p.y, p.x);
  float cell = 2.0 * PI / n;
  float cid = floor(ang / cell);
  float best = 1e5;
  for (int k = -2; k <= 2; k++) {
    float id = cid + float(k);
    float h = hash11(id * 1.37 + seed);
    vec3 h3 = hash31(id * 3.11 + seed * 7.7);
    float g = clamp(uGather * 1.5 - h3.y * 0.5, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - g, 3.0);
    float sc = 1.0 - e;
    float a0 = (id + 0.5) * cell + (h3.x - 0.5) * cell * 0.3 + sc * (h3.z - 0.5) * cell * 0.25;
    float r = ringR + (h3.y - 0.5) * 0.9 + sc * (3.0 + h3.z * 12.0) + uOpen * 0.5;
    float z = zoff + (h3.z - 0.5) * 1.1 + sc * (h - 0.5) * 18.0;
    vec3 c = vec3(cos(a0) * r, sin(a0) * r + sin(uTime * 0.6 + h * 6.28) * 0.12, z);
    vec3 q = p - c;
    float spin = sc * uTime * (h - 0.5) * 0.8;
    q.xy *= rot(h3.x * 6.28 + spin);
    q.yz *= rot(h3.y * 6.28 + spin * 0.7);
    q.xz *= rot(h3.z * 6.28);
    float s = 0.85 + h * 0.8;
    vec3 b = vec3(0.62, 0.5, 0.56) * s * (0.85 + h3 * 0.35);
    float d = sdRoundBox(q, b, 0.12 * s);
    d += 0.07 * s * sin(q.x * 6.0 + h * 10.0) * sin(q.y * 7.0 + h3.x * 9.0) * sin(q.z * 5.5 + h3.z * 8.0);
    if (d < best) {
      best = d;
      gLocal = q;
      gId = id + seed * 13.0;
    }
  }
  return best;
}

float map(vec3 p) {
  float d1 = ringDist(p, 7.6, 30.0, 0.0, -0.2);
  vec3 l1 = gLocal;
  float i1 = gId;
  float d2 = ringDist(p, 9.9, 40.0, 5.0, -1.7);
  if (d1 < d2) {
    gLocal = l1;
    gId = i1;
    return d1;
  }
  return d2;
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(1.0, -1.0) * 0.0035;
  return normalize(
    e.xyy * map(p + e.xyy) +
    e.yyx * map(p + e.yyx) +
    e.yxy * map(p + e.yxy) +
    e.xxx * map(p + e.xxx)
  );
}

float vnoise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i.xy + i.z * 17.0);
  float b = hash21(i.xy + vec2(1.0, 0.0) + i.z * 17.0);
  float c = hash21(i.xy + vec2(0.0, 1.0) + i.z * 17.0);
  float d = hash21(i.xy + vec2(1.0, 1.0) + i.z * 17.0);
  float a2 = hash21(i.xy + (i.z + 1.0) * 17.0);
  float b2 = hash21(i.xy + vec2(1.0, 0.0) + (i.z + 1.0) * 17.0);
  float c2 = hash21(i.xy + vec2(0.0, 1.0) + (i.z + 1.0) * 17.0);
  float d2 = hash21(i.xy + vec2(1.0, 1.0) + (i.z + 1.0) * 17.0);
  return mix(mix(mix(a, b, u.x), mix(c, d, u.x), u.y), mix(mix(a2, b2, u.x), mix(c2, d2, u.x), u.y), u.z);
}

float cracks(vec3 p) {
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float f1 = 8.0;
  float f2 = 8.0;
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      for (int z = -1; z <= 1; z++) {
        vec3 g = vec3(float(x), float(y), float(z));
        vec3 o = hash33(ip + g);
        vec3 r = g + o - fp;
        float d = dot(r, r);
        if (d < f1) {
          f2 = f1;
          f1 = d;
        } else if (d < f2) {
          f2 = d;
        }
      }
    }
  }
  float edge = sqrt(f2) - sqrt(f1);
  return 1.0 - smoothstep(0.0, 0.09, edge);
}

vec4 portalColor(vec2 p, float open) {
  float r = length(p);
  float a = atan(p.y, p.x);
  float mask = 1.0 - smoothstep(open - 0.07, open, r);
  float twist = 3.4 / (r + 0.28);
  float ang = a + twist - uTime * 0.55;
  vec2 q = vec2(cos(ang), sin(ang)) * (r * 3.2 + 0.2);
  float n = fbm2(q + vec2(uTime * 0.12, -uTime * 0.09));
  float n2 = fbm2(q * 1.7 - n * 1.6 + uTime * 0.18);
  float sw = smoothstep(0.28, 0.9, n2);
  vec3 deep = vec3(0.04, 0.01, 0.26);
  vec3 mid = vec3(0.42, 0.20, 1.0);
  vec3 hi = vec3(0.88, 0.78, 1.0);
  vec3 col = mix(deep, mid, sw);
  col = mix(col, hi, pow(sw, 4.0) * 0.9);
  col *= mix(0.12, 1.0, smoothstep(0.0, 0.45, r));
  float rim = smoothstep(open - 0.25, open - 0.02, r);
  col += vec3(0.75, 0.55, 1.0) * rim * rim * 1.1;
  return vec4(col, mask);
}

vec3 tunnel(vec2 uv, float t) {
  float r = length(uv) + 1e-3;
  float a = atan(uv.y, uv.x);
  float depth = 1.0 / (r * 1.3 + 0.12) + t * 1.7;
  vec2 dir = vec2(cos(a), sin(a));
  vec2 q = dir * 1.7 + vec2(depth * 0.45, -depth * 0.3);
  float n = fbm2(q + vec2(0.0, t * 0.1));
  float n2 = fbm2(q * 1.9 - n * 1.4 + dir * 0.7);
  vec3 deep = vec3(0.05, 0.02, 0.22);
  vec3 mid = vec3(0.42, 0.25, 0.92);
  vec3 hi = vec3(0.9, 0.85, 1.0);
  vec3 col = mix(deep, mid, smoothstep(0.25, 0.85, n2));
  col += hi * pow(smoothstep(0.55, 0.95, n2), 3.0) * 0.45;
  col *= smoothstep(0.0, 0.45, r) * 0.9 + 0.1;
  col += vec3(0.7, 0.55, 1.0) * exp(-r * 4.0) * 0.9;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float cells = 36.0 + fi * 24.0;
    float ac = a / (2.0 * PI) * cells;
    float id = floor(ac);
    float fa = fract(ac) - 0.5;
    float rnd = hash21(vec2(id, fi + 1.0));
    float z = fract(rnd + t * (0.10 + 0.05 * fi));
    float rs = 0.03 + z * z * 1.5;
    float len = 0.02 + z * 0.12;
    float radial = smoothstep(len, 0.0, abs(r - rs));
    float ang = smoothstep(0.22 + z * 0.1, 0.0, abs(fa));
    col += vec3(0.85, 0.78, 1.0) * radial * ang * (0.3 + z) * 1.4;
  }
  return col;
}


vec3 skyColor(vec2 uv, vec3 rd) {
  float h = clamp(rd.y, 0.0, 1.0);
  vec3 horizon = vec3(0.60, 0.24, 0.90);
  vec3 zenith = vec3(0.015, 0.010, 0.085);
  vec3 col = mix(horizon * 0.42, zenith, pow(h, 0.55));
  float au = fbm2(vec2(rd.x * 2.4 / (h + 0.35) + uTime * 0.03, h * 5.0 + uTime * 0.05));
  float band = smoothstep(0.54, 0.80, au) * smoothstep(0.04, 0.26, h) * (1.0 - smoothstep(0.45, 0.9, h));
  vec3 ac = mix(vec3(0.25, 0.85, 1.0), vec3(0.78, 0.35, 1.0), smoothstep(0.1, 0.7, h + au * 0.3));
  col += ac * band * 0.85;
  vec2 p = uv * 26.0 + vec2(uTime * 0.01, 0.0);
  vec2 id = floor(p);
  vec2 f = fract(p) - 0.5;
  float hh = hash21(id);
  vec2 off = (vec2(hash21(id + 7.0), hash21(id + 13.0)) - 0.5) * 0.6;
  float st = step(0.86, hh) * smoothstep(0.08, 0.0, length(f - off));
  col += vec3(0.85, 0.8, 1.0) * st * smoothstep(0.06, 0.4, h);
  return col;
}

vec3 worldView(vec2 uv, vec3 rdIn) {
  vec3 rd = normalize(vec3(uv.x, uv.y + 0.2, -1.5));
  float F = uTime * 5.0 + uTravel * 420.0;
  vec3 ro = vec3(uMouse.x * 3.0, uMouse.y * 1.4, -F);
  float floorY = -2.6;
  vec3 col = skyColor(uv, rd);
  float tf = 1e5;
  vec3 haze = vec3(0.34, 0.15, 0.62) * 0.55;

  if (rd.y < -0.002) {
    tf = (floorY - ro.y) / rd.y;
    vec3 p = ro + rd * tf;
    vec2 g = abs(fract(p.xz / 5.0 - 0.5) - 0.5) * 5.0;
    float d = min(g.x, g.y);
    float w = 0.03 + tf * 0.0026;
    float line = 1.0 - smoothstep(0.0, w, d);
    float glow = exp(-d * 1.5) * 0.3;
    float pulse = smoothstep(0.9, 1.0, sin(p.z * 0.06 - uTime * 1.8)) * 0.9 + 0.25;
    float fade = exp(-tf * 0.011);
    vec3 gc = mix(vec3(0.5, 0.32, 1.0), vec3(0.35, 0.9, 1.0), smoothstep(-24.0, 24.0, p.x));
    vec3 fl = vec3(0.018, 0.010, 0.06) + gc * (line * 1.25 * pulse + glow);
    col = mix(haze, fl, fade);
  } else {
    col += haze * exp(-abs(rd.y) * 14.0) * 0.9;
  }

  float dGate = mix(320.0, 52.0, smoothstep(0.5, 1.0, uTravel));
  float gateVis = smoothstep(0.3, 0.7, uTravel);
  float tg = dGate / max(-rd.z, 0.0001);
  float gateT = 1e5;
  if (gateVis > 0.001 && tg < tf) {
    vec3 gp = ro + rd * tg;
    vec2 gq = (gp.xy - vec2(0.0, 5.0)) / 17.0;
    float gr = length(gq);
    float gf = gateVis * exp(-tg * 0.004);
    if (gr < 1.08) {
      vec4 pc = portalColor(gq, 1.0);
      col = mix(col, pc.rgb * 1.25, pc.a * gf);
      gateT = tg;
    }
    float ring = exp(-pow((gr - 1.0) * 16.0, 2.0));
    col += vec3(0.8, 0.6, 1.0) * ring * 1.3 * gf;
    col += vec3(0.5, 0.3, 1.0) * exp(-max(gr - 1.0, 0.0) * 3.2) * 0.35 * gf;
  }

  float S = 22.0;
  float k0 = ceil(F / S);
  for (int i = 11; i >= 0; i--) {
    float k = k0 + float(i);
    for (int j = 0; j < 2; j++) {
      float seed = k * 2.0 + float(j);
      float hs = hash11(seed * 1.7);
      if (hs < 0.3) continue;
      float zp = -k * S - float(j) * 9.0;
      float t = (zp - ro.z) / rd.z;
      if (t <= 0.0 || t > tf || t > gateT) continue;
      vec3 hp = ro + rd * t;
      vec3 h3 = hash31(seed * 3.3);
      float w = 8.0 + h3.x * 9.0;
      float h = w * 0.62;
      float cx = (h3.y - 0.5) * 46.0;
      float cy = floorY + 3.5 + h3.z * 15.0;
      vec2 q = vec2((hp.x - cx) / (w * 0.5), (hp.y - cy) / (h * 0.5));
      if (abs(q.x) > 1.0 || abs(q.y) > 1.0) continue;
      float e = max(abs(q.x), abs(q.y));
      float border = smoothstep(0.93, 0.985, e);
      vec3 pc = vec3(0.07, 0.045, 0.20);
      pc += vec3(0.17, 0.12, 0.40) * step(0.80, q.y);
      pc += vec3(0.20, 0.15, 0.46) * step(abs(q.y - 0.48), 0.1) * step(abs(q.x), 0.62);
      pc += vec3(0.14, 0.10, 0.34) * step(q.y, 0.18) * step(-0.78, q.y) * step(abs(fract(q.x * 2.5 + 0.5) - 0.5), 0.36);
      pc = mix(pc, vec3(0.85, 0.75, 1.0), border * 0.9);
      float fd = exp(-t * 0.013);
      float a = (0.62 + border * 0.38) * fd * smoothstep(10.0, 32.0, t);
      col = mix(col, pc, a);
      col += vec3(0.55, 0.4, 1.0) * border * 0.6 * fd * smoothstep(10.0, 32.0, t);
    }
  }
  return col;
}

vec3 background(vec2 uv, vec3 rd) {
  vec3 col = vec3(0.012, 0.009, 0.03) + vec3(0.02, 0.012, 0.05) * (0.5 - uv.y * 0.5);
  float neb = fbm2(uv * 1.6 + vec2(uTime * 0.01, 0.0));
  col += vec3(0.10, 0.045, 0.22) * smoothstep(0.35, 0.9, neb) * 0.55;
  float halo = (0.1 + uOpen * 0.7 + uIgnite * 0.25) / (1.0 + pow(length(uv) * 2.4, 2.0));
  col += vec3(0.38, 0.22, 0.85) * halo * 0.5;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float sc = 14.0 + fi * 11.0;
    vec2 p = uv * sc + vec2(uTime * (0.01 + fi * 0.008), uTime * 0.02 * (fi + 1.0));
    vec2 id = floor(p);
    vec2 f = fract(p) - 0.5;
    float h = hash21(id + fi * 31.0);
    vec2 off = (vec2(hash21(id + 7.0), hash21(id + 13.0)) - 0.5) * 0.6;
    float tw = 0.55 + 0.45 * sin(uTime * (1.0 + h * 2.0) + h * 40.0);
    float d = length(f - off);
    float m = step(0.78, h) * smoothstep(0.07 + fi * 0.01, 0.0, d) * tw;
    col += mix(vec3(0.8, 0.72, 1.0), vec3(0.55, 0.85, 1.0), h) * m * (0.8 - fi * 0.15);
  }
  return col;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float flyE = uFly * uFly * (3.0 - 2.0 * uFly);
  float camZ = uCamZ0 + (-7.0 - uCamZ0) * flyE;
  float sway = 1.0 - clamp(uFly * 1.6, 0.0, 1.0);
  vec3 ro = vec3(uMouse.x * 2.4 * sway, uMouse.y * 1.5 * sway + 0.3, camZ);
  vec3 fwd = normalize(vec3(0.0, 0.0, camZ - 10.0) - ro);
  vec3 rgt = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(rgt, fwd);
  vec3 rd = normalize(uv.x * rgt + uv.y * up + 1.5 * fwd);

  vec3 col;

  if (camZ < -0.2) {
    col = tunnel(uv, uTime);
    if (uWorld > 0.001) {
      float rv = 1.0 - smoothstep(uWorld * 1.9 - 0.4, uWorld * 1.9, length(uv));
      col = mix(col, worldView(uv, rd), rv);
    }
  } else {
    float tp = 1e5;
    if (ro.z > 0.001 && rd.z < -0.0001) tp = -ro.z / rd.z;

    float t = 0.0;
    float tmax = 0.0;
    float bb = dot(ro, rd);
    float hh = bb * bb - (dot(ro, ro) - 676.0);
    bool hit = false;
    float glow = 0.0;
    vec3 pos = ro;
    if (hh > 0.0) {
      float sq = sqrt(hh);
      t = max(0.0, -bb - sq);
      tmax = -bb + sq;
      for (int i = 0; i < 80; i++) {
        pos = ro + rd * t;
        float d = map(pos);
        glow += 0.012 * exp(-4.0 * max(d, 0.0));
        if (d < 0.003 * (1.0 + t * 0.15)) {
          hit = true;
          break;
        }
        t += d * 0.8;
        if (t > tmax || t > tp) break;
      }
    }

    bool rockFront = hit && t < tp;
    vec3 portalCol = vec3(0.0);
    float portalA = 0.0;
    float portalHalo = 0.0;
    if (tp < 1e4 && uOpen > 0.001) {
      vec3 pp = ro + rd * tp;
      vec2 pq = pp.xy / 6.5;
      float pr = length(pq);
      vec4 pc = portalColor(pq, uOpen);
      portalCol = pc.rgb * (1.0 + uFly * 0.9);
      portalA = pc.a;
      portalHalo = exp(-max(pr - uOpen, 0.0) * 2.6) * uOpen;
    }

    if (rockFront) {
      vec3 n = calcNormal(pos);
      vec3 q = gLocal;
      float stoneN = vnoise3(q * 3.2) * 0.6 + vnoise3(q * 9.0) * 0.4;
      vec3 stone = vec3(0.20, 0.17, 0.27) * (0.55 + stoneN * 0.9);
      vec3 L = normalize(vec3(-0.5, 0.8, 0.6));
      float dif = max(dot(n, L), 0.0);
      vec3 col0 = stone * (0.22 + dif * 0.85);
      vec3 toC = vec3(0.0, 0.0, 1.5) - pos;
      float dc = length(toC);
      float pl = max(dot(n, toC / dc), 0.0) * (uIgnite * 0.9 + uOpen * 1.3) * (42.0 / (dc * dc + 9.0));
      col0 += stone * pl * vec3(0.7, 0.45, 1.0) * 2.2;
      float ck = cracks(q * 2.4 + gId);
      float pulse = 0.75 + 0.25 * sin(uTime * 1.6 + gId);
      col0 += vec3(0.75, 0.55, 1.0) * ck * uIgnite * 3.0 * pulse;
      float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
      col0 += vec3(0.5, 0.35, 1.0) * fres * uIgnite * 0.55;
      col = col0;
      col = mix(col, vec3(0.02, 0.014, 0.05), 1.0 - exp(-t * 0.012));
    } else {
      col = background(uv, rd);
      col += vec3(0.45, 0.28, 1.0) * portalHalo * 0.55;
      col = mix(col, portalCol, portalA);
    }

    col += vec3(0.55, 0.35, 1.0) * glow * (0.15 + uIgnite * 1.5) * 0.7;
  }

  col *= 1.0 - uDim * 0.62;
  float vig = smoothstep(1.25, 0.25, length(uv));
  col *= mix(0.55, 1.0, vig);
  col = 1.0 - exp(-col * 1.25);
  col = pow(col, vec3(0.92));
  float grain = hash21(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5;
  col += grain * 0.018;
  gl_FragColor = vec4(col, 1.0);
}
`;

const compile = (gl, type, src) => {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(log);
  }
  return sh;
};

export function createScene(canvas, state, options = {}) {
  const reduce = !!options.reduce;
  const isMobile = window.innerWidth < 900;
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
  if (!gl) return { destroy() {} };

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (err) {
    console.error("TAIGA scene shader error:", err);
    return { destroy() {} };
  }
  gl.useProgram(program);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = {};
  ["uRes", "uTime", "uGather", "uIgnite", "uOpen", "uFly", "uCamZ0", "uWorld", "uTravel", "uDim", "uMouse"].forEach((n) => {
    u[n] = gl.getUniformLocation(program, n);
  });

  let mx = 0;
  let my = 0;
  let smx = 0;
  let smy = 0;
  let budget = isMobile ? 0.4e6 : 1.0e6;
  let slow = 0;
  let lastFrame = performance.now();
  let camZ0 = 16;
  let raf = 0;
  let timer = 0;
  const t0 = performance.now();

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = window.innerWidth * dpr;
    let h = window.innerHeight * dpr;
    const maxPix = options.maxPixels || budget;
    if (w * h > maxPix) {
      const k = Math.sqrt(maxPix / (w * h));
      w *= k;
      h *= k;
    }
    canvas.width = Math.max(2, Math.round(w));
    canvas.height = Math.max(2, Math.round(h));
    gl.viewport(0, 0, canvas.width, canvas.height);
    const aspect = window.innerWidth / window.innerHeight;
    camZ0 = Math.min(66, Math.max(26, 9.4 / (0.333 * 0.8 * Math.min(aspect, 1))));
  };

  const onMove = (e) => {
    mx = e.clientX / window.innerWidth - 0.5;
    my = 0.5 - e.clientY / window.innerHeight;
  };

  const frame = () => {
    const nowMs = performance.now();
    const dtMs = nowMs - lastFrame;
    lastFrame = nowMs;
    if (!reduce && !options.once && dtMs > 40 && dtMs < 500) {
      slow += 1;
      if (slow > 25 && budget > 0.3e6) {
        budget *= 0.75;
        slow = 0;
        resize();
      }
    } else if (dtMs <= 40) {
      slow = Math.max(0, slow - 1);
    }
    const t = (nowMs - t0) / 1000;
    smx += (mx - smx) * 0.05;
    smy += (my - smy) * 0.05;
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    gl.uniform1f(u.uTime, options.time != null ? options.time : t);
    gl.uniform1f(u.uGather, state.gather);
    gl.uniform1f(u.uIgnite, state.ignite);
    gl.uniform1f(u.uOpen, state.open);
    gl.uniform1f(u.uFly, state.fly);
    gl.uniform1f(u.uWorld, state.world || 0);
    gl.uniform1f(u.uTravel, state.travel || 0);
    gl.uniform1f(u.uDim, state.dim || 0);
    gl.uniform1f(u.uCamZ0, camZ0);
    gl.uniform2f(u.uMouse, smx, smy);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduce && !options.once) raf = requestAnimationFrame(frame);
  };

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onMove);
  frame();
  if (reduce && !options.once) timer = window.setInterval(frame, 700);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.clearInterval(timer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      gl.deleteProgram(program);
      gl.deleteBuffer(buf);
    },
  };
}
