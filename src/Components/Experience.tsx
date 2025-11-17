import { useGLTF } from "@react-three/drei";
import { folder, useControls } from "leva";
import * as THREE from "three";
import { BuildingModel } from "./BuildingModel";
import WaterShader from "./WaterShader";


interface ExperienceProps {
  setIsAnimating: (isAnimating: boolean) => void;
  backClicked: number;
}

const Experience = ({ setIsAnimating, backClicked }: ExperienceProps) => {
  const { buildingScale, buildingPosition } = useControls({
    "Building Controls": folder({
      buildingScale: {
        value: 0.0114,
        min: 0.0,
        max: 0.05,
        step: 0.0001,
        label: "Scale",
      },
      buildingPosition: {
        value: [-0.6, -0.045, 0],
        label: "Position",
      },
    }),
  });

  const { scene: surroundingHouses } = useGLTF("/model/houses1.glb");
  const { scene: mainBuilding } = useGLTF("/model/building.glb");

  // Traverse the scene and apply a simple, flat material to every mesh
  surroundingHouses.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.material = new THREE.MeshStandardMaterial({
        color: "#d3d3d3", // An off-white color
        roughness: 1.0,
        metalness: 0.0,
      });
      obj.castShadow = true;
    }
  });

  const mainBuildingMeshes: THREE.Mesh[] = [];

  mainBuilding.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.material = new THREE.MeshStandardMaterial({
        color: "#ff00ff",
      });
      obj.castShadow = true;
      mainBuildingMeshes.push(obj);
    }
  });

  return (
    <>
      <group position={[0,0.1,0]}>
        <primitive object={surroundingHouses} />
        <mesh
          receiveShadow
          rotation={[Math.PI / 2, 0, 0]}
          position={[-1.9, 0, -0.5]}
        >
          <circleGeometry args={[2]} />
          <meshStandardMaterial color={"#d3d3d3"} side={THREE.DoubleSide} />
        </mesh>
        <BuildingModel
          scale={[buildingScale, buildingScale, buildingScale]}
          position={buildingPosition}
          rotation={[0, Math.PI / 2, 0]}
          setIsAnimating={setIsAnimating}
          backClicked={backClicked}
        />
      </group>
      <WaterShader/>
    </>
  );
};

export default Experience;
