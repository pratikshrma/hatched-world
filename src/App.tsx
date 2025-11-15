import { Canvas } from "@react-three/fiber";
import Experience from "./Components/Experience";
import Lights from "./Components/Lights";
import PostProcessing from "./Components/PostProcessing";
import { Leva } from "leva";
import MousePan from "./Components/MousePan";
const App = () => {
  return (
    <>
      <Leva collapsed />
      <Canvas
        shadows
        camera={{
          position: [0.74, 0.58, 1.55],
          rotation: [-0.24, 0.52, 12.65],
        }}
      >
        <color attach="background" args={["#afa696"]} />
        <Lights />
        <Experience />
        <PostProcessing />
        <MousePan />
      </Canvas>
    </>
  );
};

export default App;
