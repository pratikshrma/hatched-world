import { useGLTF } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { folder, useControls } from "leva";


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

  // Animation controls for designer
  const { animationDuration, easingFunction } = useControls({
    "Camera Animation": folder({
      animationDuration: {
        value: 2,
        min: 0.5,
        max: 5,
        step: 0.1,
        label: "Duration (s)",
      },
      easingFunction: {
        value: "power2.inOut",
        options: {
          "Power 1 In Out": "power1.inOut",
          "Power 2 In Out": "power2.inOut",
          "Power 3 In Out": "power3.inOut",
          "Power 4 In Out": "power4.inOut",
          "Sine In Out": "sine.inOut",
          "Expo In Out": "expo.inOut",
          "Circ In Out": "circ.inOut",
          "Back In Out": "back.inOut",
          "Elastic In Out": "elastic.inOut",
          "Bounce In Out": "bounce.inOut",
          "Power 1 In": "power1.in",
          "Power 2 In": "power2.in",
          "Power 3 In": "power3.in",
          "Power 1 Out": "power1.out",
          "Power 2 Out": "power2.out",
          "Power 3 Out": "power3.out",
        },
        label: "Easing",
      },
    }),
  });

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

  // Store the start position when animation begins
  const animationStartPosition = useRef(
    new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z),
  );

  // Fixed positions for each camera state
  const farPosition = new THREE.Vector3(4.0, 2.5, 5.0);
  const midPosition = new THREE.Vector3(0.74, 0.58, 1.55);
  const nearPosition = new THREE.Vector3(-0.09, 0.28, 0.59);
  // Create a smooth curve through all waypoints
  const progressRef = useRef({ value: 0 }); // Object for GSAP to animate
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

  // Initial animation on mount from far to mid
  useEffect(() => {
    if (currentLocation === "far" && desiredLocation === "mid" && progressRef.current.value === 0) {
      setIsMoving(true);
      setIsAnimating(true);

      gsap.to(progressRef.current, {
        value: 1,
        duration: animationDuration,
        ease: easingFunction,
        onComplete: () => {
          setIsMoving(false);
          setIsAnimating(false);
          setCurrentLocation("mid");
        }
      });
    }
  }, []); // Run only on mount

  useEffect(() => {
    if (backClicked > 0) {
      progressRef.current.value = 0;
      setIsMoving(true);
      setIsAnimating(true); // Disable mouse pan
      animationStartPosition.current = new THREE.Vector3(
        camera.position.x,
        camera.position.y,
        camera.position.z,
      );
      if (currentLocation == "near") setDesiredLocation("mid");
      else setDesiredLocation("far");

      // Animate progress with GSAP
      gsap.to(progressRef.current, {
        value: 1,
        duration: animationDuration,
        ease: easingFunction,
        onComplete: () => {
          setIsMoving(false);
          setIsAnimating(false);
          setCurrentLocation(currentLocation === "near" ? "mid" : "far");
        }
      });
    }
  }, [backClicked]);

  const handleClick = () => {
    progressRef.current.value = 0;
    setIsMoving(true);
    setIsAnimating(true); // Disable mouse pan
    animationStartPosition.current = new THREE.Vector3(
      camera.position.x,
      camera.position.y,
      camera.position.z,
    );
    setDesiredLocation("near");

    // Animate progress with GSAP
    gsap.to(progressRef.current, {
      value: 1,
      duration: animationDuration,
      ease: easingFunction,
      onComplete: () => {
        setIsMoving(false);
        setIsAnimating(false);
        setCurrentLocation("near");
      }
    });
  };

  const [hoveringTheBuilding, setHoveringTheBuilding] = useState(false);
  const applyHoverEffects = () => {
    setHoveringTheBuilding(true);
    if(desiredLocation=="near"){
      setScaleMultiplier(1.0)
      return
    }
    setScaleMultiplier(0.95);
  };

  const removeHoverEffects = () => {
    console.log("Now we are not hovering");
    setHoveringTheBuilding(false);
    setScaleMultiplier(1);
  };

  useFrame(() => {
    if (isMoving && desiredLocation !== currentLocation) {
      const currentProgress = progressRef.current.value;

      // Determine the target position based on desired location
      let targetPosition: THREE.Vector3;
      if (desiredLocation === "far") {
        targetPosition = farPosition;
      } else if (desiredLocation === "mid") {
        targetPosition = midPosition;
      } else {
        targetPosition = nearPosition;
      }

      // Create a simple curve between start and end positions
      const curve = new THREE.CatmullRomCurve3([
        animationStartPosition.current,
        targetPosition
      ]);

      // Update camera position along the curve
      const position = curve.getPointAt(currentProgress);
      camera.position.copy(position);
      camera.lookAt(buildingCenter);
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
