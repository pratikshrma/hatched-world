import { useMemo, useEffect } from "react";
import * as THREE from "three";
import vertexShader from "../Shaders/WaterShader/vert.glsl?raw";
import fragmentShader from "../Shaders/WaterShader/frag.glsl?raw";
import { useFrame, useThree } from "@react-three/fiber";

const WaterShader = () => {
  const { size, camera } = useThree();

  const waterMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        iTime: { value: 0.0 },
        iResolution: { value: new THREE.Vector2(size.width, size.height) },
        iMouse: { value: new THREE.Vector2(0, 0) },
        uCameraPosition: {
          value: new THREE.Vector3(
            camera.position.x,
            camera.position.y,
            camera.position.z
          ),
        },
      },
    });
  }, [camera.position, size.width, size.height]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      waterMaterial.uniforms.iMouse.value.x = event.clientX;
      waterMaterial.uniforms.iMouse.value.y = event.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [waterMaterial.uniforms.iMouse]);

  useFrame((_state, delta) => {
    waterMaterial.uniforms.iTime.value += delta;
  });

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        material={waterMaterial}
      >
        <planeGeometry args={[10, 10, 500, 500]} />
      </mesh>
    </>
  );
};

export default WaterShader;
