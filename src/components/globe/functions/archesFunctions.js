import * as Three from "three";
import {DEG2RAD} from "three/src/math/MathUtils";

export function rotateArches (arches) {
    const m = new Three.Matrix4();
    const vecY = new Three.Vector3(0, 1, 0);
    m.makeRotationAxis(vecY, -25 * DEG2RAD);

    for (let archInd = 0; archInd < arches.length; archInd += 1) {
        arches[archInd].curveMesh.applyMatrix4(m);
        arches[archInd].tubeMesh.applyMatrix4(m);
    }

    const vecX = new Three.Vector3(1, 0, 0);
    m.makeRotationAxis(vecX, 20 * DEG2RAD);
    for (let archInd = 0; archInd < arches.length; archInd += 1) {
        arches[archInd].curveMesh.applyMatrix4(m);
        arches[archInd].tubeMesh.applyMatrix4(m);
    }
}

export function fillDistances(arches, distances) {
    for (let archInd = 0; archInd < arches.length; archInd += 1) {
        distances.push(arches[archInd].onLandDistance);

        console.log(distances[archInd]);
    }
}
