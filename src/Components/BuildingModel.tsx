import { useGLTF } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

interface BuildingModelProps {
  scale: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  setIsAnimating: (isAnimating: boolean) => void;
}

export function BuildingModel({ setIsAnimating, ...props }: BuildingModelProps) {
  const { nodes, materials } = useGLTF("/model/building.glb") as any;
  const groupRef = useRef<THREE.Group>(null!);
  const { camera } = useThree();

  // Building center position for camera to look at
  const buildingCenter = new THREE.Vector3(-0.6, 0.1, 0);

  // Define waypoints for the smooth curve path - Z evenly distributed from 3.0 to 0.8
  const waypoints = [
    new THREE.Vector3(1.5, 1.2, 3.0),      // Start from far away, elevated
    new THREE.Vector3(0.8, 1.0, 2.69),     // Arc around
    new THREE.Vector3(0.2, 0.9, 2.37),     // Continue arc
    new THREE.Vector3(-0.2, 0.8, 2.06),    // Getting closer
    new THREE.Vector3(-0.4, 0.6, 1.74),    // Approaching
    new THREE.Vector3(-0.5, 0.5, 1.43),    // Almost there
    new THREE.Vector3(-0.6, 0.4, 1.11),    // Final approach
    new THREE.Vector3(-0.6, 0.35, 0.8),    // Majestic final position - centered on building
  ];

  // Create a smooth curve through all waypoints
  const curve = useRef(new THREE.CatmullRomCurve3(waypoints));
  const [progress, setProgress] = useState(-1); // -1 = not moving, 0-1 = progress along curve
  const [isMoving, setIsMoving] = useState(false);

  const handleClick = () => {
    setProgress(0); // Start from beginning of curve
    setIsMoving(true);
    setIsAnimating(true); // Disable mouse pan
  };

  useFrame((_state, delta) => {
    if (isMoving && progress >= 0 && progress <= 1) {
      // Increment progress along the curve (speed controlled here)
      const newProgress = Math.min(progress + delta * 0.15, 1); // 0.15 = speed, clamped to 1

      setProgress(newProgress);

      // Get position on curve at current progress
      const position = curve.current.getPoint(newProgress);
      camera.position.copy(position);

      // Always look at the building
      camera.lookAt(buildingCenter);

      // Check if we've reached the end
      if (newProgress >= 1) {
        setIsMoving(false);
        setProgress(-1);
        setIsAnimating(false); // Re-enable mouse pan
      }
    }
  });

  return (
    <group {...props} dispose={null} ref={groupRef} onClick={handleClick}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_2!.geometry}
          material={materials.Glass}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_3.geometry}
          material={materials.Ground}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials.Observatory}
        ></mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_5.geometry}
          material={materials.Observatory}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_6.geometry}
          material={materials.Observatory}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/model/building.glb");
