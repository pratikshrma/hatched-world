import { useGLTF } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

interface BuildingModelProps {
  scale: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  setIsAnimating: (isAnimating: boolean) => void;
  backClicked: number;
}

export function BuildingModel({
  setIsAnimating,
  backClicked,
  ...props
}: BuildingModelProps) {
  const { nodes, materials } = useGLTF("/model/building.glb") as any;

  // Clone the original material and darken it for hover effect
  const hoverObservatoryMaterial = useMemo(() => {
    const clonedMaterial = materials.Observatory.clone();
    // Darken by reducing the color values (multiply by a factor less than 1)
    if (clonedMaterial.color) {
      clonedMaterial.color = clonedMaterial.color.clone().multiplyScalar(3.1);
    }
    // Also reduce emissive if it exists
    if (clonedMaterial.emissive) {
      clonedMaterial.emissive = clonedMaterial.emissive
        .clone()
        .multiplyScalar(5.6);
    } else {
      clonedMaterial.emissive = clonedMaterial.emissive.set(10.5);
    }
    clonedMaterial.needsUpdate = true;
    return clonedMaterial;
  }, [materials.Observatory]);

  const simpleObservatoryMaterial = materials.Observatory;

  const groupRef = useRef<THREE.Group>(null!);
  const { camera } = useThree();

  const buildingCenter = new THREE.Vector3(-0.6, 0.1, 0);

  const f2mWaypoints = [
    new THREE.Vector3(4.0, 2.5, 5.0), // Start from far away,
    new THREE.Vector3(3.2, 2.2, 4.2), // Coming closer
    new THREE.Vector3(2.4, 1.8, 3.5), // Descending
    new THREE.Vector3(1.6, 1.3, 2.8), // Continue approach
    new THREE.Vector3(1.2, 1.0, 2.2), // Getting closer
    new THREE.Vector3(0.95, 0.8, 1.85), // Almost there
    new THREE.Vector3(0.74, 0.58, 1.55), // Final position (current
  ];

  const m2nWaypoints = [
    new THREE.Vector3(0.74, 0.58, 1.55), // Start (end of intro) //WILL FIX THIS
    new THREE.Vector3(0.55, 0.51, 1.33), // Zoom in
    new THREE.Vector3(0.36, 0.44, 1.11), // Closer
    new THREE.Vector3(0.16, 0.37, 0.88), // Getting close
    new THREE.Vector3(0.04, 0.33, 0.74), // Almost there
    new THREE.Vector3(-0.09, 0.28, 0.59), // Final zoomed position
  ];
  // Create a smooth curve through all waypoints
  const [progress, setProgress] = useState(0); // -1 = not moving, 0-1 = progress along curve
  const [isMoving, setIsMoving] = useState(true);
  const [scaleMultiplier, setScaleMultiplier] = useState(1);

  const [currentLocation, setCurrentLocation] = useState<
    "far" | "mid" | "near"
  >("far");
  const [desiredLocation, setDesiredLocation] = useState<
    "far" | "mid" | "near"
  >("mid");

  useEffect(() => {
    console.log(currentLocation, " ", desiredLocation);
  }, [currentLocation, desiredLocation]);

  useEffect(() => {
    if (backClicked > 0) {
      setProgress(0); // Start from beginning of curve
      setIsMoving(true);
      setIsAnimating(true); // Disable mouse pan
      if (currentLocation == "near") setDesiredLocation("mid");
      else setDesiredLocation("far");
    }
  }, [backClicked]);

  const handleClick = () => {
    setProgress(0); // Start from beginning of curve
    setIsMoving(true);
    setIsAnimating(true); // Disable mouse pan
    setDesiredLocation("near");
  };

  const [hoveringTheBuilding, setHoveringTheBuilding] = useState(false);
  const applyHoverEffects = () => {
    setHoveringTheBuilding(true);
    setScaleMultiplier(0.95);
  };

  const removeHoverEffects = () => {
    console.log("Now we are not hovering");
    setHoveringTheBuilding(false);
    setScaleMultiplier(1);
  };

  useFrame((_state, delta) => {
    if (
      isMoving &&
      progress >= 0 &&
      progress <= 1 &&
      desiredLocation != currentLocation
    ) {
      // Increment progress along the curve (speed controlled here)
      const newProgress = Math.min(progress + delta * 0.15, 1); // 0.15 = speed, clamped to 1
      setProgress(newProgress);
      //lets just leave the far case for later
      let points;
      switch (currentLocation) {
        case "far":
          if (desiredLocation == "mid") {
            points = f2mWaypoints;
          }
          if (desiredLocation == "near") {
            points = [...f2mWaypoints, ...m2nWaypoints];

            //will fix this
          }
          break;
        case "mid":
          if (desiredLocation === "near") {
            points = m2nWaypoints;
          }
          if (desiredLocation === "far") {
            points = [...f2mWaypoints].reverse();
          }
          break;
        case "near":
          points = [...m2nWaypoints].reverse();
          break;
      }

      const curve = new THREE.CatmullRomCurve3(points);

      const position = curve.getPoint(newProgress);
      camera.position.copy(position);
      // Always look at the building
      camera.lookAt(buildingCenter);

      // Check if weve reached the end
      if (newProgress >= 1) {
        setIsMoving(false);
        setProgress(-1);
        setIsAnimating(false); // Re-enable mouse pan
        setCurrentLocation(desiredLocation);
      }
    }
  });

  return (
    <group
      {...props}
      dispose={null}
      ref={groupRef}
      onClick={handleClick}
      onPointerEnter={applyHoverEffects}
      onPointerLeave={removeHoverEffects}
      scale={[
        props.scale[0] * scaleMultiplier,
        props.scale[1] * scaleMultiplier,
        props.scale[2] * scaleMultiplier,
      ]}
    >
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
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
          material={
            hoveringTheBuilding || desiredLocation == "near"
              ? hoverObservatoryMaterial
              : simpleObservatoryMaterial
          }
        ></mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_5.geometry}
          material={
            hoveringTheBuilding || desiredLocation == "near"
              ? hoverObservatoryMaterial
              : simpleObservatoryMaterial
          }
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_6.geometry}
          material={
            hoveringTheBuilding || desiredLocation == "near"
              ? hoverObservatoryMaterial
              : simpleObservatoryMaterial
          }
        />
      </group>
    </group>
  );
}

useGLTF.preload("/model/building.glb");
