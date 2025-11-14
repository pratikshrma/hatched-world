import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader.js";
import { SobelOperatorShader } from "three/examples/jsm/shaders/SobelOperatorShader.js";

export default function DrawingEffectSobel() {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<any>();

  useEffect(() => {
    const renderPass = new RenderPass(scene, camera);

    const effectGrayScale = new ShaderPass(LuminosityShader);
    const effectSobel = new ShaderPass(SobelOperatorShader);

    composer.current = new EffectComposer(gl);
    composer.current.addPass(renderPass);
    composer.current.addPass(effectGrayScale);
    composer.current.addPass(effectSobel);

    return () => composer.current?.dispose();
  }, [gl, scene, camera]);

  // resize
  useEffect(() => {
    composer.current?.setSize(size.width, size.height);
  }, [size]);

  // render every frame
  useFrame(() => {
    if (composer.current) composer.current.render();
  }, 1);

  return null;
}

