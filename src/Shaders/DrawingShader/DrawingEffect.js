import { Effect } from 'postprocessing';
import { Uniform, Vector2 } from 'three';
import fragmentShader from './frag.glsl?raw';

export class DrawingEffect extends Effect {
  constructor({ noiseTexture, lineThickness = 0.1, lineWobble = 0.01 }) {
    super('DrawingEffect', fragmentShader, {
      uniforms: new Map([
        ['uNoiseTexture', new Uniform(noiseTexture)],
        ['uLineThickness', new Uniform(lineThickness)],
        ['uLineWobble', new Uniform(lineWobble)],
        // Corrected: Initialize with a new Vector2 object instead of null.
        ['uResolution', new Uniform(new Vector2())],
      ]),
    });
  }

  // The library calls this method automatically
  update(renderer, inputBuffer, deltaTime) {
    // Now this will correctly update the x and y properties of the Vector2.
    this.uniforms.get('uResolution').value.set(inputBuffer.width, inputBuffer.height);
  }
}