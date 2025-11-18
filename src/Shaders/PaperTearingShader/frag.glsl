uniform sampler2D uDissolveTexture;
uniform float uTime;
uniform float uDuration;

varying vec2 vUv;

void main() {
  vec4 textureColor = texture(uDissolveTexture, vUv);

  float progress = uTime / uDuration + 0.3;

  float dissolveStrength = step(progress, textureColor.r);
  gl_FragColor = vec4(1.0, 1.0, 1.0, dissolveStrength);
}
