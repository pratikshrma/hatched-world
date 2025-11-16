import { useFrame, useThree } from "@react-three/fiber";
import { folder, useControls } from "leva";
import { easing } from "maath";
import { useEffect, useRef} from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface MousePanProps {
  isAnimating: boolean;
}

const MousePan = ({ isAnimating }: MousePanProps) => {
  const { camera } = useThree();

  const basePosition = useRef({
    x: 0.0,
    y: 0.0,
    z: 0.0,
  });

  const baseMousePos=useRef({
    x:0.0,
    y:0.0
  })

  const { panStrenght } = useControls({
    "Pan Strength": folder({
      panStrenght: {
        value: 0.1,
        min: 0.0,
        max: 1.0,
        step: 0.01,
      },
    }),
  });

  const mousePos = useRef<MousePosition>({
    x: 0.0,
    y: 0.0,
  });

  // Initialize base position once on mount
  useEffect(() => {
    basePosition.current = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
  }, [camera.position]);


  // Update base position when animation ends
  useEffect(() => {
    if (!isAnimating) {
      // Animation just ended, update base position to current camera position
      basePosition.current = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      };
    }

   baseMousePos.current={
      x:mousePos.current.x,
      y:mousePos.current.y
    } 
  }, [isAnimating, camera]);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const posx = e.clientX;
      const posy = e.clientY;
      const maxX = window.innerWidth;
      const maxY = window.innerHeight;

      const normalizedX = -(posx / maxX - 0.5);
      const normalizedY = posy / maxY - 0.5;

      mousePos.current = {
        x: normalizedX,
        y: normalizedY,
      };
    };
    document.addEventListener("mousemove", updateMousePosition);
    return () => document.removeEventListener("mousemove", updateMousePosition);
  }, []);

  useFrame((_state, delta) => {
    // Skip mouse panning when animation is active
    if (isAnimating) return;

    const deltaX=mousePos.current.x-baseMousePos.current.x;
    const deltaY=mousePos.current.y-baseMousePos.current.y;

    easing.damp3(
      camera.position,
      [
        basePosition.current.x + deltaX * panStrenght,
        basePosition.current.y + deltaY * panStrenght,
        basePosition.current.z,
      ],
      0.3,
      delta,
    );
  });

  return null;
};

export default MousePan;
