// TAMV Ceremonial Shaders - Hyper-Realistic PBR Materials
// Advanced GLSL shaders for obsidian, basalt, energy circuits, and ritual effects

export const obsidianVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const obsidianFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uRoughness;
  uniform float uMetalness;
  uniform vec3 uEnergyColor;
  uniform float uEnergyIntensity;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  
  // Noise functions for realistic surface
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  // Fresnel effect for glassy appearance
  float fresnel(vec3 viewDir, vec3 normal, float power) {
    return pow(1.0 - max(dot(viewDir, normal), 0.0), power);
  }
  
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    
    // Base obsidian color with iridescence
    float iridescence = fresnel(viewDir, vNormal, 3.0);
    vec3 iridescentColor = mix(
      uColor,
      vec3(0.3, 0.0, 0.5) + sin(vUv.x * 10.0 + uTime) * 0.2,
      iridescence * 0.3
    );
    
    // Surface imperfections
    float surfaceNoise = fbm(vUv * 15.0);
    float cracks = smoothstep(0.4, 0.5, fbm(vUv * 30.0 + uTime * 0.01));
    
    // Energy circuits pulsing through cracks
    float circuit = smoothstep(0.45, 0.5, cracks);
    float pulse = sin(uTime * 2.0 + vUv.y * 20.0) * 0.5 + 0.5;
    vec3 energyGlow = uEnergyColor * circuit * pulse * uEnergyIntensity;
    
    // Final color composition
    vec3 baseColor = iridescentColor * (0.8 + surfaceNoise * 0.2);
    vec3 finalColor = baseColor + energyGlow;
    
    // Specular reflection
    vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
    float spec = pow(max(dot(reflect(-lightDir, vNormal), viewDir), 0.0), 32.0);
    finalColor += vec3(1.0) * spec * (1.0 - uRoughness) * uMetalness;
    
    gl_FragColor = vec4(finalColor, 0.95);
  }
`;

export const basaltVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  
  uniform float uTime;
  uniform float uDisplacement;
  
  // Simplex noise for displacement
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    
    // Displacement for natural rock surface
    float displacement = snoise(position * 2.0 + uTime * 0.1) * uDisplacement;
    vec3 newPosition = position + normal * displacement;
    
    vec4 worldPosition = modelMatrix * vec4(newPosition, 1.0);
    vWorldPosition = worldPosition.xyz;
    vPosition = newPosition;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

export const basaltFragmentShader = `
  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform vec3 uAccentColor;
  uniform float uRoughness;
  uniform sampler2D uNoiseTexture;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0;
      a *= 0.5;
    }
    return v;
  }
  
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    
    // Multi-layered rock texture
    float layer1 = fbm(vUv * 8.0);
    float layer2 = fbm(vUv * 16.0 + 0.5);
    float layer3 = fbm(vUv * 32.0 + 1.0);
    
    // Combine layers for realistic basalt
    float rockPattern = layer1 * 0.5 + layer2 * 0.3 + layer3 * 0.2;
    
    // Vesicular texture (gas bubbles in basalt)
    float bubbles = smoothstep(0.6, 0.65, noise(vUv * 40.0));
    
    // Color variation
    vec3 baseColor = mix(uBaseColor, uAccentColor, rockPattern);
    baseColor *= 1.0 - bubbles * 0.3;
    
    // Ambient occlusion from crevices
    float ao = 1.0 - layer2 * 0.3;
    
    // Simple lighting
    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    float ambient = 0.2;
    
    vec3 finalColor = baseColor * (ambient + diffuse * 0.8) * ao;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const energyCircuitVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const energyCircuitFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uIntensity;
  uniform float uSpeed;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  // Circuit pattern generator
  float circuit(vec2 uv) {
    vec2 cell = floor(uv);
    vec2 local = fract(uv);
    
    float h = hash(cell);
    
    // Horizontal or vertical line based on hash
    float line = 0.0;
    if (h > 0.5) {
      line = smoothstep(0.45, 0.5, local.y) * smoothstep(0.55, 0.5, local.y);
    } else {
      line = smoothstep(0.45, 0.5, local.x) * smoothstep(0.55, 0.5, local.x);
    }
    
    // Connection nodes
    float node = 1.0 - length(local - 0.5) * 2.0;
    node = smoothstep(0.0, 0.3, node);
    
    return max(line, node * 0.5);
  }
  
  void main() {
    vec2 uv = vUv * 10.0;
    
    // Multi-scale circuit pattern
    float pattern = circuit(uv) * 0.6;
    pattern += circuit(uv * 2.0 + 0.5) * 0.3;
    pattern += circuit(uv * 4.0 + 1.0) * 0.1;
    
    // Flowing energy pulse
    float flow = sin(vUv.y * 50.0 - uTime * uSpeed) * 0.5 + 0.5;
    flow *= sin(vUv.x * 30.0 + uTime * uSpeed * 0.5) * 0.5 + 0.5;
    
    // Color gradient
    vec3 color = mix(uColor1, uColor2, vUv.y + sin(uTime) * 0.1);
    
    // Final glow
    float glow = pattern * flow * uIntensity;
    vec3 finalColor = color * glow;
    
    // Add bloom effect
    finalColor += color * pow(glow, 2.0) * 0.5;
    
    gl_FragColor = vec4(finalColor, glow * 0.8);
  }
`;

export const volumetricLightVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const volumetricLightFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uDensity;
  uniform vec3 uLightPosition;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }
  
  void main() {
    // Distance from light source
    float dist = length(vPosition - uLightPosition);
    float falloff = 1.0 / (1.0 + dist * dist * 0.1);
    
    // Volumetric noise for god rays
    float volumetric = noise(vPosition * uDensity + uTime * 0.5);
    volumetric *= noise(vPosition * uDensity * 2.0 - uTime * 0.3);
    
    // Combine
    float intensity = falloff * volumetric * uIntensity;
    
    vec3 finalColor = uColor * intensity;
    
    gl_FragColor = vec4(finalColor, intensity * 0.5);
  }
`;

export const glyphVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glyphFragmentShader = `
  uniform float uTime;
  uniform vec3 uGlowColor;
  uniform float uGlowIntensity;
  uniform float uRevealProgress;
  uniform sampler2D uGlyphTexture;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    // Glyph visibility based on reveal progress
    float reveal = smoothstep(0.0, 1.0, uRevealProgress - (1.0 - vUv.y) * 0.5);
    
    // Pulsing glow
    float pulse = sin(uTime * 2.0) * 0.2 + 0.8;
    
    // Edge glow effect
    float edge = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 2.0);
    edge *= pow(1.0 - abs(vUv.y - 0.5) * 2.0, 2.0);
    
    float glow = edge * pulse * uGlowIntensity * reveal;
    
    vec3 finalColor = uGlowColor * glow;
    
    // Add subtle scanlines
    float scanline = sin(vUv.y * 200.0 + uTime * 10.0) * 0.1;
    finalColor += uGlowColor * scanline * glow;
    
    gl_FragColor = vec4(finalColor, glow);
  }
`;

export const portalVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const portalFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uIntensity;
  uniform float uDistortion;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  #define PI 3.14159265359
  
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
  }
  
  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);
    float angle = atan(center.y, center.x);
    
    // Spiral distortion
    float spiral = angle + dist * 10.0 - uTime * 2.0;
    
    // Swirling noise
    vec2 distortedUv = center;
    distortedUv.x += sin(spiral) * uDistortion * dist;
    distortedUv.y += cos(spiral) * uDistortion * dist;
    
    float n1 = noise(distortedUv * 5.0 + uTime);
    float n2 = noise(distortedUv * 10.0 - uTime * 0.5);
    
    // Color layers
    vec3 color = mix(uColor1, uColor2, n1);
    color = mix(color, uColor3, n2 * 0.5);
    
    // Edge glow
    float edgeGlow = 1.0 - smoothstep(0.3, 0.5, dist);
    float ringGlow = smoothstep(0.35, 0.4, dist) * smoothstep(0.5, 0.45, dist);
    
    // Final composition
    float intensity = (edgeGlow + ringGlow * 2.0) * uIntensity;
    vec3 finalColor = color * intensity;
    
    // Add sparkles
    float sparkle = pow(noise(vUv * 50.0 + uTime * 3.0), 10.0) * 5.0;
    finalColor += vec3(1.0) * sparkle * intensity;
    
    gl_FragColor = vec4(finalColor, intensity * (1.0 - dist * 1.5));
  }
`;
