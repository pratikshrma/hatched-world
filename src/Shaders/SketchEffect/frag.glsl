uniform float time;
uniform vec2 resolution;
uniform float intensity;
uniform float uJitterIntensity;
uniform float uRandomWobble;
uniform float uEdgeDetection;
uniform float uHatchingPatternDensity1;
uniform float uHatchingPatternDensity2;
uniform float uHatchingPatternDensity3;
uniform float uHatchingPatternDensity4;
uniform float uHatchingDarkness;
uniform float uEdgeDarkness;
uniform float uContrast;
uniform float uBrightness;
uniform float uEdgeThinkness;

  // Helper functions from the original shader
  float rand(float x) {
      return fract(sin(x) * 43758.5453);
  }

  float triangle(float x) {
      return abs(1.0 - mod(abs(x), 2.0)) * 2.0 - 1.0;
  }

  // Simple edge detection using Sobel-like operator
  float detectEdge(sampler2D tex, vec2 uv, vec2 resolution) {
      vec2 texel = 1.0 / resolution;

      // Sample neighboring pixels
      float tl = length(texture2D(tex, uv + vec2(-texel.x, texel.y)).rgb);
      float t  = length(texture2D(tex, uv + vec2(0.0, texel.y)).rgb);
      float tr = length(texture2D(tex, uv + vec2(texel.x, texel.y)).rgb);
      float l  = length(texture2D(tex, uv + vec2(-texel.x, 0.0)).rgb);
      float r  = length(texture2D(tex, uv + vec2(texel.x, 0.0)).rgb);
      float bl = length(texture2D(tex, uv + vec2(-texel.x, -texel.y)).rgb);
      float b  = length(texture2D(tex, uv + vec2(0.0, -texel.y)).rgb);
      float br = length(texture2D(tex, uv + vec2(texel.x, -texel.y)).rgb);

      // Sobel operator
      float sobelX = tl + 2.0 * l + bl - tr - 2.0 * r - br;
      float sobelY = tl + 2.0 * t + tr - bl - 2.0 * b - br;

      return length(vec2(sobelX, sobelY));
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      // Quantize time for hand-drawn animation effect
      float quantizedTime = floor(time * 16.0) / 16.0;

      // Calculate aspect-corrected coordinates
      vec2 p = uv * 2.0 - 1.0;
      p.x *= resolution.x / resolution.y;

      // Add hand-drawn wobble/jitter to UV coordinates
      vec2 wobbleUV = uv;
      wobbleUV += vec2(
          triangle(p.y * rand(quantizedTime) * 4.0) * rand(quantizedTime * 1.9) * uJitterIntensity,
          triangle(p.x * rand(quantizedTime * 3.4) * 4.0) * rand(quantizedTime * 2.1) * uJitterIntensity
      );
      wobbleUV += vec2(
          rand(p.x * 3.1 + p.y * 8.7) * uRandomWobble,
          rand(p.x * 1.1 + p.y * 6.7) * uRandomWobble
      );

      // Clamp UV to avoid sampling outside texture
      wobbleUV = clamp(wobbleUV, 0.0, 1.0);

      // Sample the input texture with wobbled UVs
      vec4 color = texture2D(inputBuffer, wobbleUV);

      // Detect edges
      float edge = detectEdge(inputBuffer, wobbleUV, resolution);
      edge = smoothstep(uEdgeDetection,uEdgeThinkness, edge);

      // Calculate brightness for hatching
      float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));

      // Create cross-hatching pattern
      float xs = (rand(quantizedTime * 6.6) * 0.1 + 0.9);
      float ys = (rand(quantizedTime * 6.6) * 0.1 + 0.9);

      float hatching = max(
          clamp((sin(p.x * xs * (uHatchingPatternDensity1+ rand(quantizedTime) * 30.0) +
                     p.y * ys * (uHatchingPatternDensity2 + rand(quantizedTime * 1.91) * 30.0)) * 0.5 + 0.5) -
                (1.0 - brightness), 0.0, 1.0),
          clamp((sin(p.x * xs * (uHatchingPatternDensity3+ rand(quantizedTime * 4.74) * 30.0) +
                     p.y * ys * (uHatchingPatternDensity4+ rand(quantizedTime * 3.91) * 30.0)) * 0.5 + 0.5) -
                (1.0 - brightness) - 0.4, 0.0, 1.0)
      );

      // Apply warm paper-like color
      vec3 paperColor = vec3(1.0, 0.9, 0.8);
      vec3 sketchColor = mix(paperColor, paperColor * uHatchingDarkness, hatching);

      // Mix with edges (darker edges)
      sketchColor = mix(sketchColor, paperColor * uEdgeDarkness, edge);

      // Apply color grading (gamma and contrast)
      sketchColor = pow(sketchColor, vec3(1.0 / 2.2));
      sketchColor = sketchColor * uContrast - uBrightness;

      outputColor = mix(inputColor,vec4(sketchColor, 1.0),intensity); 


  }
