import { Canvas } from "@react-three/fiber";
import Experience from "./Components/Experience";
import Lights from "./Components/Lights";
import { OrbitControls } from "@react-three/drei";
import PostProcessing from "./Components/PostProcessing";
const App = () => {
  return (
    <>
      <Canvas shadows>
        <color attach="background" args={['#afa696']} />
        <OrbitControls />
        <Lights />
        <Experience />
        <PostProcessing/>
      </Canvas>
    </>
  );
};

export default App;
