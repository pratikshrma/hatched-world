import { EffectComposer, Noise, Sepia } from "@react-three/postprocessing";
import DrawingEffects from "./DrawingEffects";
const PostProcessing = () => {
  return (
    <>
      <EffectComposer multisampling={0} autoClear={false}>
        <Sepia intensity={0.8} />
        <Noise premultiply opacity={0.2} />
        <DrawingEffects/>
      </EffectComposer>
    </>
  );
};

export default PostProcessing;
