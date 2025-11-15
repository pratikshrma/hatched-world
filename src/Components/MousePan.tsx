import { useFrame, useThree } from "@react-three/fiber";
import { folder, useControls } from "leva";
import { easing } from "maath";
import { useEffect, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
}

const MousePan = () => {
  //plan
  //so first take the mouse coordinates
  ///convert them into normalized coordinates
  //then apply then normailzed coords * strendgth * cam pos ho jna cahia usse
  
  const { camera } = useThree();
  const {camPosition, camRotation} = useControls({
    "Camera Orientation": folder({
      camPosition: {
        value: [camera.position.x,camera.position.y,camera.position.z],
      },
      camRotation: {
        value: [camera.rotation.x,camera.rotation.y,camera.rotation.z],
      },
    }),
  });
  useEffect(()=>{
  
  camera.position.set(camPosition[0],camPosition[1],camPosition[2])
  camera.rotation.set(camRotation[0],camRotation[1],camRotation[2])
    
  },[camPosition,camRotation])

  const basePosition = useRef({
    x: 0.0,
    y: 0.0,
    z: 0.0
  });

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

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const posx = e.clientX;
      const posy = e.clientY;
      const maxX = window.innerWidth;
      const maxY = window.innerHeight;

      const normalizedX = posx / maxX - 0.5;
      const normalizedY = -(posy / maxY - 0.5);

      mousePos.current = {
        x: normalizedX,
        y: normalizedY,
      };
    };
    document.addEventListener("mousemove", updateMousePosition);
    return () => document.removeEventListener("mousemove", updateMousePosition);
  }, []);

  useEffect(() => {
    basePosition.current = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
  }, [camera]);

  useFrame((_state, delta) => {
    easing.damp3(
      camera.position,
      [
        basePosition.current.x + mousePos.current.x * panStrenght,
        basePosition.current.y + mousePos.current.y * panStrenght,
        basePosition.current.z
      ],
      0.3,
      delta
    );
  });

  return null;
};

export default MousePan;
