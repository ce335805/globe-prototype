import * as Three from 'three'
import {CubicBezierCurve3} from "three";

export default class archClass {
    startPoint = null;
    endPoint = null;

    constructor(latLongStart, latLongEnd)
    {
        this.startPoint = this.degToPointOnSpere(latLongStart[0], latLongStart[1]);
        this.endPoint = this.degToPointOnSpere(latLongEnd[0], latLongEnd[1]);
    }

    degToPointOnSpere(lat, long) {
        const xCoord = Math.sin(long) * Math.cos(lat);
        const yCoord = Math.sin(lat);
        const zCoord = Math.cos(long) * Math.cos(lat);
        return new Three.Vector3(xCoord, yCoord, zCoord);
    }

    calculatePointOnConnection (fractionInBetween, pointA, pointB) {
        console.log(pointA.x);
        console.log(pointA.x);
        const angleY = -Math.atan(pointA.x / pointB.z);
        const mY = new Three.Matrix4();
        const vecY = new Three.Vector3(0, 1, 0);
        mY.makeRotationAxis(vecY, angleY);

        pointA.applyMatrix4(mY);
        pointB.applyMatrix4(mY);
        const angleX = Math.atan(pointA.y / pointA.z);
        const mX = new Three.Matrix4();
        const vecX = new Three.Vector3(1, 0, 0);
        mX.makeRotationAxis(vecX, angleX);
        pointA.applyMatrix4(mX);
        pointB.applyMatrix4(mX);
        const angleZ = Math.atan(pointB.x / pointB.y);
        const mZ = new Three.Matrix4();
        const vecZ = new Three.Vector3(0, 0, 1);
        mZ.makeRotationAxis(vecZ, angleZ);
        pointA.applyMatrix4(mZ);
        pointB.applyMatrix4(mZ);

        const theta = fractionInBetween * Math.atan(pointB.y / pointB.z);
        let connectionPoint = new Three.Vector3(0., Math.sin(theta), Math.cos(theta));

        const mYInv = new Three.Matrix4();
        mYInv.makeRotationAxis(vecY, -angleY);
        const mXInv = new Three.Matrix4();
        mXInv.makeRotationAxis(vecX, -angleX);
        const mZInv = new Three.Matrix4();
        mZInv.makeRotationAxis(vecZ, -angleZ);

        connectionPoint.applyMatrix4(mZInv);
        connectionPoint.applyMatrix4(mXInv);
        connectionPoint.applyMatrix4(mYInv);

        return connectionPoint;
    }

    makeCurve() {
        let ctrl1 = this.calculatePointOnConnection(0.4, new Three.Vector3(this.startPoint.x, this.startPoint.y, this.startPoint.z), new Three.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z));
        let ctrl2 = this.calculatePointOnConnection(0.6, new Three.Vector3(this.startPoint.x, this.startPoint.y, this.startPoint.z), new Three.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z));
        const m = new Three.Matrix4();
        m.makeScale(1.6, 1.6, 1.6);
        ctrl1.applyMatrix4(m);
        ctrl2.applyMatrix4(m);
        return new CubicBezierCurve3(this.startPoint, ctrl1, ctrl2, this.endPoint);
    }

}
