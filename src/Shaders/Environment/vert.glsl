void main(){
  vec4 modelPositions=modelMatrix*vec4(position,1.0);
  vec4 viewPositions=viewMatrix*modelPositions;
  vec4 projectedPositions=projectionMatrix*viewPositions;
  gl_Position=projectedPositions;
}
