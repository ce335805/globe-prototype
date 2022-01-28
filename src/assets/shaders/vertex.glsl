varying vec3 vertexNormal;
varying vec3 vertexPosition;

void main() {
    vertexNormal = normal;
    vertexPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
