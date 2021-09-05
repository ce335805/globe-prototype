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

export default {
  name: 'globe',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      globe: null,
      testCircle: null,
      rows: 160,
      dotDensity: 80,
      imgData: null,
      imgWidth: 0,
      imgHeight: 0,
      circleArr: null,
      singleCircle: null
    }
  },
  methods: {
    init: function() {
      let container = document.getElementById('container');

      this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.005, 10);
      this.camera.position.z = 2.4;

      this.scene = new Three.Scene();

      let geometry = new Three.SphereGeometry( 1, 64, 64 );
      let material = new Three.MeshBasicMaterial({color: 0x3251a6});
      this.globe = new Three.Mesh(geometry, material);
      //this.scene.add(this.globe);

      //some stuff for performance optimization
      let pixelRatio = window.devicePixelRatio
      let AA = true
      if (pixelRatio > 1) {
        AA = false
      }
      this.renderer = new Three.WebGLRenderer({
        antialias: AA,
        powerPreference: "high-performance",
      });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      this.controls.autoRotate = true;
      this.controls.update();

    },
    animate: function() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      //this.singleCircle.position.x += 0.1;
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
          if (!this.visibilityForCoordinate(long, lat) || (lat < -60 || lat > 60)){
            continue;
          }
          let xCoord = Math.sin(long * DEG2RAD) * Math.cos(lat * DEG2RAD) * 1.001;
          let yCoord = Math.sin(lat * DEG2RAD) * 1.001;
          let zCoord = Math.cos(long * DEG2RAD) * Math.cos(lat * DEG2RAD) * 1.001;
          const m = new Three.Matrix4();
          m.makeTranslation(xCoord, yCoord, zCoord);
          let geometryCircle = new Three.CircleBufferGeometry( 0.005, 3);
          geometryCircle.applyMatrix4(m);
          geometries.push(geometryCircle);
        }
      }
      const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false);
      const materialCircle = new Three.MeshBasicMaterial({color: 0xffffff});
      materialCircle.side = Three.DoubleSide;
      const mesh = new Three.Mesh(mergedGeometry, materialCircle);
      this.scene.add(mesh);

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
      img.src = require("../assets/worldmap.png");

    },
    visibilityForCoordinate: function(long, lat) {
      const pixelRow = Math.floor(this.imgHeight/120 * (-lat + 60));
      const pixelColumn = Math.floor(this.imgWidth/360 * ((long + 180) % 360));
      return this.imgData.data[pixelRow * this.imgWidth * 4 + pixelColumn * 4 + 3] > 30;
    }
  },
  mounted() {
    this.init();
    this.loadWorldMap();
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
