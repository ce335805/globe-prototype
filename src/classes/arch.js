import * as Three from 'three'
import {CubicBezierCurve3} from "three";
import Ellipse from "@/classes/ellipse";
import {DEG2RAD} from "three/src/math/MathUtils";

export default class archClass {
    startPoint = null;
    endPoint = null;
    curveGeometry = null;
    curveMesh = null;
    tubeGeometry = null;
    tubeMesh = null;
    onLandDistance = 0;
    ellipse = null;
    isMoon = false;
    //circleMeshA;
    //circleMeshB;

    constructor(latLongStart, latLongEnd, isMoon) {
        this.isMoon = isMoon;
        if(isMoon){
            this.startPoint = this.degToPointOnSpere(latLongStart[0], latLongStart[1]);
            this.endPoint = new Three.Vector3(1., 5., 1.);
            this.initializeMesh();
            this.onLandDistance = 384400;

        } else {
            this.startPoint = this.degToPointOnSpere(latLongStart[0], latLongStart[1]);
            this.endPoint = this.degToPointOnSpere(latLongEnd[0], latLongEnd[1]);
            this.initializeMesh();
            this.calculateOnLandDistance(this.startPoint, this.endPoint);
            //this.makeCircleConnectingPoints(this.startPoint, this.endPoint)

            //console.log(this.endPoint.x);
            //console.log(this.endPoint.y);
            //console.log(this.endPoint.z);

            //const circleGeometry = new Three.CircleBufferGeometry(0.02, 20);
            //const m = new Three.Matrix4();
            //m.makeTranslation(this.endPoint.x, this.endPoint.y, this.endPoint.z);
            //circleGeometry.applyMatrix4(m);
            //const materialCircle = new Three.MeshBasicMaterial({color: 0xff4411});
            //materialCircle.side = Three.DoubleSide;
            //this.circleMeshA = new Three.Mesh(circleGeometry, materialCircle);
        }
    }

    degToPointOnSpere(lat, long) {
        const xCoord = Math.sin(long) * Math.cos(lat);
        const yCoord = Math.sin(lat);
        const zCoord = Math.cos(long) * Math.cos(lat);
        return new Three.Vector3(xCoord, yCoord, zCoord);
    }

    calculatePointOnConnection(fractionInBetween, pointA, pointB) {
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

    makeMoonCurve() {
        const vecHamMoon = new Three.Vector3(this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y, this.endPoint.z - this.startPoint.z)
        const perpVec = new Three.Vector3(0.1 * vecHamMoon.y, - 0.1 * vecHamMoon.x, 0.);
        let angle = 1.;

        const mRot = new Three.Matrix4();
        mRot.makeRotationAxis(vecHamMoon, angle);
        perpVec.applyMatrix4(mRot);

        let f1 = 0.2;
        let f2 = 0.8;

        let ctrl1 = new Three.Vector3(f1 * (this.endPoint.x + this.startPoint.x) + perpVec.x, f1 * (this.endPoint.y + this.startPoint.y) + perpVec.y, f1 * (this.endPoint.z + this.startPoint.z + perpVec.z));
        let ctrl2 = new Three.Vector3(f2 * (this.endPoint.x + this.startPoint.x) + perpVec.x, f2 * (this.endPoint.y + this.startPoint.y) + perpVec.y, f2 * (this.endPoint.z + this.startPoint.z + perpVec.z));
        return new CubicBezierCurve3(this.startPoint, ctrl1, ctrl2, this.endPoint);
    }

    initializeMesh() {
        let curve = null;
        if(this.isMoon){
            curve = this.makeMoonCurve();
        } else {
            curve = this.makeCurve();
        }

        this.curveGeometry = new Three.TubeBufferGeometry(curve, 50, 0.0025, 4, false);
        const material = new Three.MeshBasicMaterial({color: 0xffc97b});
        this.curveMesh = new Three.Mesh(this.curveGeometry, material);

        this.tubeGeometry = new Three.TubeBufferGeometry(curve, 50, 0.015, 4, false);
        const tubeMaterial = new Three.MeshBasicMaterial({
            color: 0xffc97b,
            transparent: true,
            opacity: 0.0
        });
        this.tubeMesh = new Three.Mesh(this.tubeGeometry, tubeMaterial);
    }



    calculateOnLandDistance(pointA, pointB) {
        const angleY = -Math.atan(pointB.x / pointB.z);
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

        const theta = Math.atan(pointB.y / pointB.z);
        this.onLandDistance = -theta * 6365;
    }

    makeCircleConnectingPoints(pointA, pointB){

        console.log(pointA);
        console.log(pointB);

        let ellipse = new Ellipse(1.005, 1.005);

        const ellipseGeometry = new Three.TubeBufferGeometry(ellipse, 50, 0.003, 4, false);
        const ellipseMaterial = new Three.MeshBasicMaterial({color: 0xff5511});

        this.ellipse = new Three.Mesh(ellipseGeometry, ellipseMaterial);

        const angleY = -Math.atan(pointA.z / pointA.x) + 0.1;
        console.log(angleY);
        const mY = new Three.Matrix4();
        const vecY = new Three.Vector3(0, 1, 0);
        mY.makeRotationAxis(vecY, angleY);
        this.curveMesh.applyMatrix4(mY);
        //pointA.applyMatrix4(mY);
        //pointB.applyMatrix4(mY);


        //const angleY = Math.atan(pointB.z / pointB.x);
        //console.log(angleY);
        ////const angleY = 0.;
        //const mY = new Three.Matrix4();
        //const vecY = new Three.Vector3(0, 1, 0);
        //mY.makeRotationAxis(vecY, angleY);
        //this.ellipse.applyMatrix4(mY);

        //const angleX = Math.atan(pointA.y / pointA.z);
        //const mX = new Three.Matrix4();
        //const vecX = new Three.Vector3(1, 0, 0);
        //mX.makeRotationAxis(vecX, angleX);
        //this.ellipse.applyMatrix4(mX);
//
        //const angleZ = Math.atan(pointB.x / pointB.y + 1);
        //const mZ = new Three.Matrix4();
        //const vecZ = new Three.Vector3(0, 0, 1);
        //mZ.makeRotationAxis(vecZ, angleZ);
        //this.ellipse.applyMatrix4(mZ);

    }

    addToScene(scene){
        scene.add(this.curveMesh);
        scene.add(this.tubeMesh);
    }

    rotateX(angleX){
        const mX = new Three.Matrix4();
        const vecX = new Three.Vector3(1, 0, 0);
        mX.makeRotationAxis(vecX, angleX * DEG2RAD);
        this.curveMesh.applyMatrix4(mX);
        this.tubeMesh.applyMatrix4(mX);
    }

    rotateY(angleY){
        const mY = new Three.Matrix4();
        const vecY = new Three.Vector3(0, 1, 0);
        mY.makeRotationAxis(vecY, angleY * DEG2RAD);
        this.curveMesh.applyMatrix4(mY);
        this.tubeMesh.applyMatrix4(mY);
    }
}

