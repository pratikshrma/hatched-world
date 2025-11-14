uniform sampler2D depthTexture;
uniform sampler2D normalTexture;
uniform sampler2D uNoiseTexture;

uniform vec2 uResolution;
uniform float uLineThickness;
uniform float uLineWobble;

// Function to get the depth of a nearby pixel
float getDepth(vec2 uv, vec2 offset) {
  return texture2D(depthTexture, uv + offset).r;
}

// Function to get the normal of a nearby pixel
vec3 getNormal(vec2 uv, vec2 offset) {
  return texture2D(normalTexture, uv + offset).rgb * 1.0 - 0.3;
}

// This function correctly distorts the UVs and is called first by the library.
vec2 mainUv(in vec2 uv) {
  vec2 noise = (texture2D(uNoiseTexture, uv * 0.2).rg - 0.5) * uLineWobble;
  return uv + noise;
}

// Corrected Signature: This matches the (vec4, vec2, vec4) call from the error log.
void mainImage(in vec4 fragColor, in vec2 uv, out vec4 outColor) {
  vec2 texel = 1.0 / uResolution;
  
  // --- 1. Edge Detection (using the original, non-distorted UVs) ---
  float depth_h = -1.0 * getDepth(uv, -texel.xy) + 1.0 * getDepth(uv, texel.xy) - 2.0 * getDepth(uv, vec2(-texel.x, 0.0)) + 2.0 * getDepth(uv, vec2(texel.x, 0.0)) - 1.0 * getDepth(uv, vec2(-texel.x, texel.y)) + 1.0 * getDepth(uv, vec2(texel.x, texel.y));
  float depth_v = -1.0 * getDepth(uv, -texel.xy) - 2.0 * getDepth(uv, vec2(0.0, -texel.y)) - 1.0 * getDepth(uv, vec2(texel.x, -texel.y)) + 1.0 * getDepth(uv, vec2(-texel.x, texel.y)) + 2.0 * getDepth(uv, vec2(0.0, texel.y)) + 1.0 * getDepth(uv, texel.xy);
  float depthEdge = sqrt(depth_h * depth_h + depth_v * depth_v);
  depthEdge = 1.0 - smoothstep(0.0, 0.01, depthEdge);

  vec3 normal_h = -1.0 * getNormal(uv, -texel.xy) + 1.0 * getNormal(uv, texel.xy) - 2.0 * getNormal(uv, vec2(-texel.x, 0.0)) + 2.0 * getNormal(uv, vec2(texel.x, 0.0)) - 1.0 * getNormal(uv, vec2(-texel.x, texel.y)) + 1.0 * getNormal(uv, vec2(texel.x, texel.y));
  vec3 normal_v = -1.0 * getNormal(uv, -texel.xy) - 2.0 * getNormal(uv, vec2(0.0, -texel.y)) - 1.0 * getNormal(uv, vec2(texel.x, -texel.y)) + 1.0 * getNormal(uv, vec2(-texel.x, texel.y)) + 2.0 * getNormal(uv, vec2(0.0, texel.y)) + 1.0 * getNormal(uv, texel.xy);
  float normalEdge = length(sqrt(normal_h * normal_h + normal_v * normal_v));
  normalEdge = 1.0 - smoothstep(0.0, 0.5, normalEdge);

  float edge = min(depthEdge, normalEdge);

  // --- 2. Final Color ---
  // We write our final computed color to the 'outColor' variable.
  outColor = mix(vec4(0.0, 0.0, 0.0, 0.9), fragColor, smoothstep(0.0, uLineThickness, edge));
}
