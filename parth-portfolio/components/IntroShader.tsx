"use client";

import { useEffect, useRef } from "react";
import styles from "./IntroShader.module.css";
import { prefersReducedMotion } from "@/lib/motion";

const VERTEX_SHADER_SOURCE = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = (position + 1.0) * 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_opacity;
uniform vec2 u_mouse;

varying vec2 vUv;

// Simplex 2D noise helpers
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Low-frequency, buttery-smooth FBM without high-frequency ripples
float smoothFbm(vec2 p) {
  float v = 0.0;
  v += 0.65 * (snoise(p * 0.6) * 0.5 + 0.5);
  v += 0.35 * (snoise(p * 1.2 + vec2(1.2, 3.4)) * 0.5 + 0.5);
  return v;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uv = st;
  uv.x *= aspect;

  float t = u_time * 0.06;
  vec2 mouseOffset = (u_mouse - 0.5) * 0.12;

  // Broad, sweeping domain warping
  vec2 q = vec2(
    smoothFbm(uv * 0.75 + vec2(t * 0.25, t * 0.1) + mouseOffset),
    smoothFbm(uv * 0.75 + vec2(5.2, 1.3) - vec2(t * 0.18, t * 0.2))
  );

  vec2 r = vec2(
    smoothFbm(uv * 0.85 + 1.8 * q + vec2(1.7, 9.2) + vec2(t * 0.12, -t * 0.08)),
    smoothFbm(uv * 0.85 + 1.8 * q + vec2(8.3, 2.8) + vec2(-t * 0.1, t * 0.14))
  );

  float f = smoothFbm(uv * 0.65 + 2.0 * r + vec2(t * 0.04, 0.0));

  // Modern, high-contrast palette
  vec3 bgVoid    = vec3(0.043, 0.043, 0.047); // #0B0B0C (clean dark backdrop)
  vec3 glowRed   = vec3(1.0, 0.231, 0.078);   // #FF3B14 (vibrant electric vermilion)
  vec3 glowAura  = vec3(0.92, 0.06, 0.15);    // #EB0F26 (pure crimson aura)
  vec3 deepEmber = vec3(0.18, 0.035, 0.015);  // subtle deep transition ember

  // Chromatic aura gradient across screen
  vec3 auraColor = mix(glowRed, glowAura, smoothstep(0.0, 1.0, st.x + 0.25 * r.x));

  // Smooth mask with wide falloff to prevent muddy textures or banding
  float auraMask = smoothstep(0.28, 0.85, f);
  float emberMask = smoothstep(0.08, 0.65, f);

  vec3 col = bgVoid;
  col = mix(col, deepEmber, emberMask * 0.55);
  col = mix(col, auraColor, auraMask * 0.68);

  // Soft edge vignette focusing attention on hero typography
  float vignette = smoothstep(1.4, 0.4, length(st - 0.5));
  col = mix(bgVoid, col, vignette);

  // Subtle dither to eliminate any 8-bit color banding
  float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * (1.0 / 255.0);
  col += dither;

  gl_FragColor = vec4(col, u_opacity);
}
`;

interface IntroShaderProps {
  opacity?: number;
  className?: string;
}

export default function IntroShader({
  opacity = 1,
  className = "",
}: IntroShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (prefersReducedMotion()) {
      return;
    }

    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, powerPreference: "low-power" }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) return;

    // Compile helper
    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Full screen quad buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uOpacity = gl.getUniformLocation(program, "u_opacity");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animId: number;
    let startTime = performance.now();

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const render = (now: number) => {
      if (!canvas) return;
      const elapsed = (now - startTime) * 0.001;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uOpacity, opacity);
      gl.uniform2f(uMouse, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (program) gl.deleteProgram(program);
      if (vert) gl.deleteShader(vert);
      if (frag) gl.deleteShader(frag);
      if (buffer) gl.deleteBuffer(buffer);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      id="intro-shader-canvas"
      className={`${styles.canvas} ${className}`}
      aria-hidden="true"
    />
  );
}
