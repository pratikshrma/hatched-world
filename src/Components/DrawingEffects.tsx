import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { DrawingEffect } from "../Shaders/DrawingShader/DrawingEffect.js";

const DrawingEffectComponent = () => {
  const noiseTexture = useTexture("/textures/noise.jpg");

  const effect = useMemo(
    () =>
      new DrawingEffect({
        noiseTexture,
        lineThickness: 0.0002,
        lineWobble: 0.02,
      }),
    [noiseTexture],
  );

  return <primitive object={effect} />;
};

const DrawingEffects = () => {
  return (
    // The composer from @react-three/postprocessing will automatically
    // provide the depth and normal textures to our custom effect.
      <DrawingEffectComponent />
  );
};

export default DrawingEffects;
