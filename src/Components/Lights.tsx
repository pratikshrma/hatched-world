const Lights = () => {
  return (
    <>
      <ambientLight intensity={1} color={'#ffffff'} />
      <directionalLight intensity={1} color={'#ffffff'} position={[0, 10, 10]}/>
    </>
  )
}

export default Lights
