import { useMemo } from 'react'
import {SepiaEffect as SepiaEffectImpl} from "../Shaders/SepiaEffect/SepiaEffect"

const SepiaEffect = ({intensity=1.0}) => {
  const effect=useMemo(()=>{
    return new SepiaEffectImpl({intensity})
  },[intensity]) 

  return <primitive object={effect}/> 
}

export default SepiaEffect
