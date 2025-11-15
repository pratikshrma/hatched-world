uniform float opacity;
uniform bool premultiply;

float random(vec2 co){
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453); 
}

void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){
  float noise=random(uv);
  
  noise=noise-0.5;
  vec3 color=inputColor.rgb;


  if(premultiply){
    color=mix(color,color*(1.+noise),opacity);
  }else{
    color=mix(color,color+noise,opacity);
  }
  
  outputColor=vec4(color,inputColor.a);
}
