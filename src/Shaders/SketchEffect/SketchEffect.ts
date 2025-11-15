import { Effect } from "postprocessing";
import fragmentShader from "./frag.glsl?raw";
import { Uniform, Vector2, WebGLRenderer, WebGLRenderTarget } from "three";

export class SketchEffect extends Effect {
  constructor({
    intensity = 0.24,
    uJitterIntensity = 0.00,
    uRandomWobble = 0.0,
    uEdgeDetection = 0.13,
    uHatchingPatternDensity1 = 259.0,
    uHatchingPatternDensity2 = 240.0,
    uHatchingPatternDensity3 = -110.0,
    uHatchingPatternDensity4 = 116.0,
    uHatchingDarkness = 0.69,
    uEdgeDarkness = 0.07,
    uContrast = 1.8,
    uBrightness = 0.6,
    uEdgeThinkness=0.5,
  } = {}) {
    super("SketchEffect", fragmentShader, {
      uniforms: new Map<string, Uniform>([
        ["time", new Uniform(0.0)],
        ["resolution", new Uniform(new Vector2())],
        ["intensity", new Uniform(intensity)],
        ["uJitterIntensity", new Uniform(uJitterIntensity)],
        ["uRandomWobble", new Uniform(uRandomWobble)],
        ["uEdgeDetection", new Uniform(uEdgeDetection)],
        ["uHatchingPatternDensity1", new Uniform(uHatchingPatternDensity1)],
        ["uHatchingPatternDensity2", new Uniform(uHatchingPatternDensity2)],
        ["uHatchingPatternDensity3", new Uniform(uHatchingPatternDensity3)],
        ["uHatchingPatternDensity4", new Uniform(uHatchingPatternDensity4)],
        ["uHatchingDarkness", new Uniform(uHatchingDarkness)],
        ["uEdgeDarkness", new Uniform(uEdgeDarkness)],
        ["uContrast", new Uniform(uContrast)],
        ["uBrightness", new Uniform(uBrightness)],
        ["uEdgeThinkness", new Uniform(uEdgeThinkness)],
      ]),
    });
  }

  update(
    _renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    deltaTime: number,
  ) {
    // Update time uniform each frame
    this.uniforms.get("time")!.value += deltaTime;

    // Update resolution uniform
    this.uniforms
      .get("resolution")!
      .value.set(inputBuffer.width, inputBuffer.height);
  }

  // Getters and setters for all uniforms
  get intensity() {
    return this.uniforms.get("intensity")!.value;
  }
  set intensity(value: number) {
    this.uniforms.get("intensity")!.value = value;
  }

  get uJitterIntensity() {
    return this.uniforms.get("uJitterIntensity")!.value;
  }
  set uJitterIntensity(value: number) {
    this.uniforms.get("uJitterIntensity")!.value = value;
  }

  get uRandomWobble() {
    return this.uniforms.get("uRandomWobble")!.value;
  }
  set uRandomWobble(value: number) {
    this.uniforms.get("uRandomWobble")!.value = value;
  }

  get uEdgeDetection() {
    return this.uniforms.get("uEdgeDetection")!.value;
  }
  set uEdgeDetection(value: number) {
    this.uniforms.get("uEdgeDetection")!.value = value;
  }

  get uHatchingPatternDensity1() {
    return this.uniforms.get("uHatchingPatternDensity1")!.value;
  }
  set uHatchingPatternDensity1(value: number) {
    this.uniforms.get("uHatchingPatternDensity1")!.value = value;
  }

  get uHatchingPatternDensity2() {
    return this.uniforms.get("uHatchingPatternDensity2")!.value;
  }
  set uHatchingPatternDensity2(value: number) {
    this.uniforms.get("uHatchingPatternDensity2")!.value = value;
  }

  get uHatchingPatternDensity3() {
    return this.uniforms.get("uHatchingPatternDensity3")!.value;
  }
  set uHatchingPatternDensity3(value: number) {
    this.uniforms.get("uHatchingPatternDensity3")!.value = value;
  }

  get uHatchingPatternDensity4() {
    return this.uniforms.get("uHatchingPatternDensity4")!.value;
  }
  set uHatchingPatternDensity4(value: number) {
    this.uniforms.get("uHatchingPatternDensity4")!.value = value;
  }

  get uHatchingDarkness() {
    return this.uniforms.get("uHatchingDarkness")!.value;
  }
  set uHatchingDarkness(value: number) {
    this.uniforms.get("uHatchingDarkness")!.value = value;
  }

  get uEdgeDarkness() {
    return this.uniforms.get("uEdgeDarkness")!.value;
  }
  set uEdgeDarkness(value: number) {
    this.uniforms.get("uEdgeDarkness")!.value = value;
  }

  get uContrast() {
    return this.uniforms.get("uContrast")!.value;
  }
  set uContrast(value: number) {
    this.uniforms.get("uContrast")!.value = value;
  }

  get uBrightness() {
    return this.uniforms.get("uBrightness")!.value;
  }
  set uBrightness(value: number) {
    this.uniforms.get("uBrightness")!.value = value;
  }

  get uEdgeThinkness() {
    return this.uniforms.get("uEdgeThinkness")!.value;
  }
  set uEdgeThinkness(value: number) {
    this.uniforms.get("uEdgeThinkness")!.value = value;
  }
}
