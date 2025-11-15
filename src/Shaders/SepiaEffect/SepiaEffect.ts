import {Effect} from 'postprocessing'
import { Uniform } from 'three'
import fragmentShader from './frag.glsl?raw'

export class SepiaEffect extends Effect{
  constructor({intensity=1.0}={}){
    super(
      'SepiaEffect',
      fragmentShader,
      {
        uniforms:new Map<string,Uniform>([
          ['intensity',new Uniform(intensity)] 
        ])
      }
    )
  }

  get intensity(){
    return this.uniforms.get('intensity')!.value;
  }

  set intensity(value){
    this.uniforms.get('intensity')!.value=value
  }
}
