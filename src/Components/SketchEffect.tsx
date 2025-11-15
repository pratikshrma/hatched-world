import { useMemo } from "react";
import { SketchEffect as SketchEffectImpl } from "../Shaders/SketchEffect/SketchEffect";
import { useControls,folder } from "leva";

const SketchEffect = () => {
  const effect = useMemo(() => {
    return new SketchEffectImpl();
  }, []);

  useControls({
    "Sketch Effect": folder({
      Intensity: {
        value: effect.intensity,
        onChange: (value) => (effect.intensity = value),
        min: 0.0,
        max: 1.0,
        step: 0.01,
      },
      "Jitter Intensity": {
        value: effect.uJitterIntensity,
        onChange: (value) => (effect.uJitterIntensity = value),
        min: 0.0,
        max: 0.05,
        step: 0.001,
      },
      "Random Wobble": {
        value: effect.uRandomWobble,
        onChange: (value) => (effect.uRandomWobble = value),
        min: 0.0,
        max: 0.05,
        step: 0.001,
      },
      "Edge Detection": {
        value: effect.uEdgeDetection,
        onChange: (value) => (effect.uEdgeDetection = value),
        min: 0.0,
        max: 1.0,
        step: 0.01,
      },
      "Hatching Density 1": {
        value: effect.uHatchingPatternDensity1,
        onChange: (value) => (effect.uHatchingPatternDensity1 = value),
        min: 50.0,
        max: 300.0,
        step: 1.0,
      },
      "Hatching Density 2": {
        value: effect.uHatchingPatternDensity2,
        onChange: (value) => (effect.uHatchingPatternDensity2 = value),
        min: 50.0,
        max: 300.0,
        step: 1.0,
      },
      "Hatching Density 3": {
        value: effect.uHatchingPatternDensity3,
        onChange: (value) => (effect.uHatchingPatternDensity3 = value),
        min: -300.0,
        max: -50.0,
        step: 1.0,
      },
      "Hatching Density 4": {
        value: effect.uHatchingPatternDensity4,
        onChange: (value) => (effect.uHatchingPatternDensity4 = value),
        min: 50.0,
        max: 300.0,
        step: 1.0,
      },
      "Hatching Darkness": {
        value: effect.uHatchingDarkness,
        onChange: (value) => (effect.uHatchingDarkness = value),
        min: 0.0,
        max: 1.0,
        step: 0.01,
      },
      "Edge Darkness": {
        value: effect.uEdgeDarkness,
        onChange: (value) => (effect.uEdgeDarkness = value),
        min: 0.0,
        max: 1.0,
        step: 0.01,
      },
      Contrast: {
        value: effect.uContrast,
        onChange: (value) => (effect.uContrast = value),
        min: 0.5,
        max: 3.0,
        step: 0.1,
      },
      Brightness: {
        value: effect.uBrightness,
        onChange: (value) => (effect.uBrightness = value),
        min: 0.0,
        max: 2.0,
        step: 0.1,
      },
      EdgeThickness: {
        value: effect.uEdgeThinkness,
        onChange: (value) => (effect.uEdgeThinkness = value),
        min: 0.0,
        max: 2.0,
        step: 0.1,
      },
    }),
  });
  return <primitive object={effect} />;
};

export default SketchEffect;
