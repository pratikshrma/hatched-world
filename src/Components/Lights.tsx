import { useControls,folder } from "leva"

const Lights = () => {
  const {aIntensity,dlIntensity}=useControls({
    "Light Controls":folder({
      aIntensity:{
        value:0.4,
        min:0.0,
        max:2.0,
        step:0.1,
      },
      dlIntensity:{
        value:2.0,
        min:0.0,
        max:5.0,
        step:0.1
      }
    })
  })


  return (
    <>
      <ambientLight intensity={aIntensity} color={'#ffffff'} />
      <directionalLight castShadow intensity={dlIntensity} color={'#ffffff'} position={[0, 10, 10]}/>
    </>
  )
}

export default Lights
