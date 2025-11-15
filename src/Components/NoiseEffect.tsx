import { useMemo } from "react"
import { NoiseEffect as NoiseEffectImpl } from "../Shaders/NoiseEffect/NoiseEffect" 
const NoiseEffect = ({opacity=0.3,premultiply=true}) => {
  const effect=useMemo(()=>{
    return new NoiseEffectImpl({opacity,premultiply});
  },[opacity,premultiply])

  return (
    <primitive object={effect}/>
  )
}

export default NoiseEffect
