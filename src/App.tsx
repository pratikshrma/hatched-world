import { Canvas } from "@react-three/fiber";
import Experience from "./Components/Experience";
import Lights from "./Components/Lights";
import { OrbitControls } from "@react-three/drei";
import PostProcessing from "./Components/PostProcessing";
import { Leva } from "leva";
const App = () => {
  return (
    <>
      <Leva collapsed />
      <Canvas
        shadows
        camera={{
          position: [0.43, 0.3, 1.47],
          rotation: [-0.764, 1.04183, 0.69],
        }}
      >
        <color attach="background" args={["#afa696"]} />
        <OrbitControls />
        <Lights />
        <Experience />
        <PostProcessing />
      </Canvas>
    </>
  );
};

export default App;
