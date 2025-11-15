uniform float intensity;

void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){
  //Get the original color from the scene
  vec3 color=inputColor.rgb;

  //Apply sepia transformation matrix
  //These values create the warm, brownish sepia tone
  vec3 sepia;
  sepia.r = dot(color, vec3(0.393, 0.769, 0.189));
  sepia.g = dot(color, vec3(0.349, 0.686, 0.168));
  sepia.b = dot(color, vec3(0.272, 0.534, 0.131)); 


  outputColor=vec4(mix(color,sepia,intensity),inputColor.a);
}
