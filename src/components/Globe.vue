<template>
  <div>
    <div id="container"></div>
    <canvas id = "drawWorldMap"></canvas>
  </div>
</template>

<script>
import * as Three from 'three'
import {DEG2RAD} from "three/src/math/MathUtils";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils";
import {CubicBezierCurve3} from "three";

export default {
  name: 'globe',
  data() {
    return {
      drawnLatDegs: 180,
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      globe: null,
      testCircle: null,
      rows: 120,
      dotDensity: 60,
      imgData: null,
      imgWidth: 0,
      imgHeight: 0,
      circleArr: null,
      landMesh: null,
      testCurveCoordinates1: [0.9326, 0.1740],
      testCurveCoordinates2: [0.0593, 0.5936],
      curveGeometry: null,
      curveMesh: null,
      curveRangeStart: 0,
      curveRangeStop: 0,
      archExpanding: true,
    }
  },
  //threex.domevents - use for mouse-hover
  methods: {
    init: function() {
      let container = document.getElementById('container');

      this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.005, 10);
      this.camera.position.z = 2.4;

      this.scene = new Three.Scene();

      let geometry = new Three.SphereGeometry( 1, 64, 64 );
      let material = new Three.MeshBasicMaterial({color: 0x3251a6, opacity: 0.7, transparent: true});
      this.globe = new Three.Mesh(geometry, material);
      this.scene.add(this.globe);

      //some stuff for performance optimization
      //let pixelRatio = window.devicePixelRatio
      //let AA = true
      //if (pixelRatio > 1) {
      //  AA = false
      //}
      this.renderer = new Three.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      //this.controls.autoRotate = true;
      this.controls.update();

    },
    animate: function() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      const m = new Three.Matrix4();
      const vecY = new Three.Vector3( 0, 1, 0 );
      m.makeRotationAxis(vecY, 0.1 * DEG2RAD);
      this.landMesh.applyMatrix4(m);
      this.curveMesh.applyMatrix4(m);
      this.archRangeTick();
      this.curveGeometry.setDrawRange(this.curveRangeStart, this.curveRangeStop - this.curveRangeStart);
      this.renderer.render(this.scene, this.camera);
    },
    drawCircles: function() {
      let geometries = [];
      for (let lat = -90; lat <=90; lat += 180/this.rows){
        const radius = Math.cos(Math.abs(lat) * DEG2RAD);
        const circumference = radius * Math.PI * 2;
        const dotsForLat = Math.floor(circumference * this.dotDensity);
        for(let x = 0; x < dotsForLat; x += 1){
          const long = x * 360./dotsForLat;
          if (!this.visibilityForCoordinate(long, lat)){
            continue;
          }
          let geometryCircle = new Three.CircleBufferGeometry( 0.004, 5);
          const xCoord = Math.sin(long * DEG2RAD) * Math.cos(lat * DEG2RAD) * 1.001;
          const yCoord = Math.sin(lat * DEG2RAD) * 1.001;
          const zCoord = Math.cos(long * DEG2RAD) * Math.cos(lat * DEG2RAD) * 1.001;
          const m = new Three.Matrix4();
          const vecX = new Three.Vector3( 1, 0, 0 );
          m.makeRotationAxis(vecX, -lat * DEG2RAD);
          geometryCircle.applyMatrix4(m);
          const vecY = new Three.Vector3( 0, 1, 0 );
          m.makeRotationAxis(vecY, long * DEG2RAD);
          geometryCircle.applyMatrix4(m);
          m.makeTranslation(xCoord, yCoord, zCoord);
          geometryCircle.applyMatrix4(m);
          geometries.push(geometryCircle);
        }
      }
      const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false);
      const materialCircle = new Three.MeshBasicMaterial({color: 0xffffff});
      materialCircle.side = Three.DoubleSide;
      this.landMesh = new Three.Mesh(mergedGeometry, materialCircle);
      this.scene.add(this.landMesh);
    },

    loadWorldMap: function(){
      let cnvs = document.createElement('canvas')
      let ctx = cnvs.getContext('2d');
      let img = new Image();
      let vm = this;
      img.onload = function() {
        console.log('image loaded');
        cnvs.width = img.width;
        cnvs.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
        vm.imgData = ctx.getImageData(0, 0, img.width, img.height);
        vm.imgWidth = img.width;
        vm.imgHeight = img.height;
        vm.drawCircles();
      };
      img.src = require("../assets/worldmap2.png");

    },
    visibilityForCoordinate: function(long, lat) {
      const pixelRow = Math.floor(this.imgHeight/this.drawnLatDegs * (-lat + this.drawnLatDegs/2));
      const pixelColumn = Math.floor(this.imgWidth/360 * ((long + 180) % 360));
      return this.imgData.data[pixelRow * this.imgWidth * 4 + pixelColumn * 4 + 3] > 120;
    },
    drawArch: function() {
      const curve = this.makeCurve();
      this.curveGeometry = new Three.TubeBufferGeometry( curve, 50, 0.0025, 4, false );
      const material = new Three.MeshBasicMaterial( { color: 0x00ff00 } );
      this.curveMesh = new Three.Mesh( this.curveGeometry, material );

      this.scene.add( this.curveMesh );
    },
    makeCurve: function () {
      const startLocation = this.degToPointOnSpere(this.testCurveCoordinates1[0], this.testCurveCoordinates1[1]);
      const endLocation = this.degToPointOnSpere(this.testCurveCoordinates2[0], this.testCurveCoordinates2[1]);
      const m = new Three.Matrix4();
      m.makeScale(1.5, 1.5, 1.5);
      let ctrl1 = this.degToPointOnSpere(this.testCurveCoordinates1[0], this.testCurveCoordinates1[1]);
      let ctrl2 = this.degToPointOnSpere(this.testCurveCoordinates2[0], this.testCurveCoordinates2[1]);
      ctrl1.applyMatrix4(m);
      ctrl2.applyMatrix4(m);
      return new CubicBezierCurve3(startLocation, ctrl1, ctrl2, endLocation);
    },
    degToPointOnSpere: function(lat, long) {
      const xCoord = Math.sin(long) * Math.cos(lat);
      const yCoord = Math.sin(lat);
      const zCoord = Math.cos(long) * Math.cos(lat);
      return new Three.Vector3( xCoord, yCoord, zCoord );
    },
    archRangeTick: function() {
      //let count = this.curveGeometry.attributes.position.count;
      let count = 1200;
      if(this.curveRangeStop - this.curveRangeStart < 2 * count && this.archExpanding){
        this.curveRangeStop += 10;
      } else if (this.curveRangeStop - this.curveRangeStart >= 2 * count && this.archExpanding) {
        this.archExpanding = false;
      } else if(this.curveRangeStop - this.curveRangeStart > 0 && !this.archExpanding){
        this.curveRangeStart += 10;
      } else {
        this.archExpanding = true;
        this.curveRangeStart = 0;
        this.curveRangeStop = 0;
      }
    }
  },
  mounted() {
    this.init();
    this.loadWorldMap();
    this.drawArch();
    this.animate();
  }
}
</script>

<style scoped>

#container{
  height: 800px;
  width: 800px;
}

#drawWorldMap{
  height: 300px;
  width: 600px;
}

</style>
