import { Effect } from "postprocessing"
import fragmentShader from './frag.glsl?raw'
import { Uniform } from "three"

export class NoiseEffect extends Effect {
  constructor({ opacity = 0.3, premultiply = true} = {}) {
    super(
      'NoiseEffect',
      fragmentShader,
      {
        uniforms: new Map<string,Uniform>([
          ['opacity', new Uniform(opacity)],
          ['premultiply', new Uniform(premultiply)],
        ])
      }
    )
  }
}
