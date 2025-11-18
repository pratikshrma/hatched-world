import { Canvas } from "@react-three/fiber";
import Experience from "./Components/Experience";
import Lights from "./Components/Lights";
import PostProcessing from "./Components/PostProcessing";
import { Leva } from "leva";
import MousePan from "./Components/MousePan";
// import { OrbitControls } from "@react-three/drei";
import PaperTearingShader from "./Components/PaperTearingShader";
import { useState } from "react";
const App = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [isBackButtonHovered, setIsBackButtonHovered] = useState(false);
  const [backClicked, setBackClicked] = useState(0);
  const [loaderDone, setLoaderDone] = useState(false);
  const [startLoader, setStartLoader] = useState(false);
  

  return (
    <>
      {startLoader && (
        <div
          className="backButton"
          onMouseEnter={() => {
            setIsBackButtonHovered(true);
          }}
          onMouseLeave={() => {
            setIsBackButtonHovered(false);
          }}
          onClick={() => setBackClicked((prev:number) => prev + 1)}
          style={{
            transform: isBackButtonHovered ? "scale(0.9)" : "scale(1)",
            transition: "transform 0.2s ease-in-out",
            cursor: "pointer",
          }}
        >
          <img
            src="/buttons/back.svg"
            style={{
              height: "100%",
              width: "100%",
              pointerEvents: "none",
            }}
          />
        </div>
      )}
      {!startLoader && (
        <div className="startButton start-button-pulsing" onClick={() => setStartLoader(true)}>
          Start
        </div>
      )}
      <Leva collapsed />
      <Canvas
        shadows
        camera={{
          position: [4.0, 2.5, 5.0],
          rotation: [-0.24, 0.52, 0.1],
        }}
      >
        {/* <OrbitControls /> */}
        <color attach="background" args={["#afa696"]} />
        <Lights />
        <Experience
          loaderDone={loaderDone}
          setIsAnimating={setIsAnimating}
          backClicked={backClicked}
        />
        <PostProcessing />
        <MousePan
          isAnimating={isAnimating}
          isBackButtonHovered={isBackButtonHovered}
        />
        <PaperTearingShader
          setLoaderDone={setLoaderDone}
          startLoader={startLoader}
          loaderDone={loaderDone}
        />
      </Canvas>
    </>
  );
};

export default App;
