import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Experience = () => {
  const { scene } = useGLTF("/model/houses1.glb");

  // Traverse the scene and apply a simple, flat material to every mesh
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.material = new THREE.MeshStandardMaterial({
        color: "#d3d3d3", // An off-white color
        roughness: 1.0,
        metalness: 0.0,
      });
    }
  });

  return (
    <group>
      <primitive object={scene} />
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={"#d3d3d3"} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default Experience;
