import { Canvas } from "@react-three/fiber";
import Experience from "./Components/Experience";
import Lights from "./Components/Lights";
import PostProcessing from "./Components/PostProcessing";
import { Leva } from "leva";
import MousePan from "./Components/MousePan";
// import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Selection } from "@react-three/postprocessing";
import { useState } from "react";

const App = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <>
      <Leva collapsed />
      <Canvas
        shadows
        camera={{
          position: [0.74, 0.58, 1.55],
          rotation: [-0.24, 0.52, 0.1],
        }}
      >
        <Perf position="top-left" />
        {/* <OrbitControls /> */}
        <color attach="background" args={["#afa696"]} />
        <Lights />
        <Selection>
          <Experience setIsAnimating={setIsAnimating} />
          <PostProcessing />
        </Selection>
        <MousePan isAnimating={isAnimating} />
      </Canvas>
    </>
  );
};

export default App;
