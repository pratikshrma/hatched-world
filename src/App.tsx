import { Canvas } from "@react-three/fiber";
import Experience from "./Components/Experience";
import Lights from "./Components/Lights";
import { OrbitControls } from "@react-three/drei";
import PostProcessing from "./Components/PostProcessing";
const App = () => {
  return (
    <>
      <Canvas shadows camera={{
        position:[0.961,0.321,1.064],
        rotation:[-0.764,1.04183,0.6900]
      }}>
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
