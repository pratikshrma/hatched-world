import { useMemo, useRef } from "react";
import * as THREE from "three";
import vertexShader from "../Shaders/PaperTearingShader/vert.glsl?raw";
import fragmentShader from "../Shaders/PaperTearingShader/frag.glsl?raw";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

interface props {
  setLoaderDone: (loaderDone: boolean) => void;
  startLoader: boolean;
  loaderDone: boolean;
}

const PaperTearingShader: React.FC<props> = ({
  setLoaderDone,
  startLoader,
  loaderDone,
}) => {
  const LOADER_DURATION = 15; //this is in seconds
  const meshRef = useRef<THREE.Mesh | null>(null);
  const uDissolveTexture = useTexture("/textures/noise/noiseTexture(1).png");

  const [paperGeometry, paperMaterial] = useMemo(() => {
    const geo = new THREE.PlaneGeometry(15, 15);
    const mat = new THREE.ShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      uniforms: {
        uTime: { value: 0.0 },
        uDissolveTexture: { value: uDissolveTexture },
        uDuration: { value: LOADER_DURATION },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });
    return [geo, mat];
  }, [uDissolveTexture]);

  useFrame((_state, delta) => {
    if (startLoader) {
      paperMaterial.uniforms.uTime.value += delta;
      const progress = paperMaterial.uniforms.uTime.value / LOADER_DURATION ;
      console.log(progress," - ",paperMaterial.uniforms.uTime.value)
      if (progress > 0.38 && !loaderDone) { //don't ask about 0.38 it works if you increase it then the time between animation end and zoom start animation increases.
        setLoaderDone(true);
      }
    }
  });

  return (
    <>
      <mesh
        position={[3, 3, 4.5]}
        rotation={[-Math.PI / 8, Math.PI / 4, 0]}
        ref={meshRef}
        geometry={paperGeometry}
        material={paperMaterial}
      />
    </>
  );
};

export default PaperTearingShader;
