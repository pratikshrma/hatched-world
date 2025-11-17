varying vec3 vPosition;
varying float vElevation;
varying float vShoreFactor;

uniform vec3 uCameraPosition;
uniform float uShininess;
uniform float uSpecularIntensity; 
uniform float uFoamThreshold;
uniform float uFoamSoftness;
uniform vec3 uFoamColor;
uniform vec3 uShoreColor;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;


void main() {
  //first step is calculating the normals
  vec3 dx = dFdx(vPosition);
  vec3 dy = dFdy(vPosition);

  vec3 normal = normalize(cross(dx, dy));

  vec3 lightDirection = normalize(vec3(1.0, 1.0, 0.5));

  float diffuse = max(dot(normal, lightDirection), 0.0);

  vec3 viewDirection=normalize(uCameraPosition-vPosition);

  vec3 halfWayDirection=normalize(viewDirection+lightDirection);

  float specular=pow(max(dot(normal,halfWayDirection),0.0),uShininess);

  float foamFactor=smoothstep(uFoamThreshold,uFoamThreshold+uFoamSoftness,vElevation+0.1); 


  vec3 baseColor = vec3(0.1, 0.3, 0.8);
  vec3 diffusedColor = baseColor * diffuse;
  vec3 specularColor=vec3(1.0)*specular*uSpecularIntensity;
  vec3 waterColor=diffusedColor+specularColor;

  vec3 finalWaterColor=mix(uShoreColor,waterColor,vShoreFactor);
  vec3 finalColor=mix(finalWaterColor,uFoamColor,foamFactor);

   //Fog Calculations

  float distanceToCamear=distance(vPosition,uCameraPosition);

  float fogFactor=smoothstep(uFogNear,uFogFar,distanceToCamear);

  vec3 fogColor=mix(finalColor,uFogColor,fogFactor);

  gl_FragColor = vec4(fogColor, vShoreFactor);
}

