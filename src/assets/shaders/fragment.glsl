varying vec3 vertexNormal;
varying vec3 vertexPosition;

void main() {
    float intensity =  pow(0.6 - dot(vertexNormal, vec3(0., 0., 1.)), 2.0) * (dot(vertexPosition, vec3(-0.71, 0.71, 0.)) + 2.);
    gl_FragColor = vec4(0.4, 0.8, .9, 0.9) * intensity;
}
