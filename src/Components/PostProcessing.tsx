import { EffectComposer } from "@react-three/postprocessing";
import SepiaEffect from "./SepiaEffect";
import NoiseEffect from "./NoiseEffect";
import SketchEffect from "./SketchEffect";

const PostProcessing = () => {
  return (
    <>
      <EffectComposer>
        <SepiaEffect />
        <NoiseEffect/>
        <SketchEffect/>
      </EffectComposer>
    </>
  );
};

export default PostProcessing;
