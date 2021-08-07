<template>
  <div>
    <div id="container"></div>
    <canvas id = "drawWorldMap"></canvas>
  </div>
</template>

<script>
import * as Three from 'three'
import {DEG2RAD} from "three/src/math/MathUtils";

export default {
  name: 'globe',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      globe: null,
      rows: 160,
      dotDensity: 80,
      imgData: null,
      imgWidth: 0,
      imgHeight: 0
    }
  },
  methods: {
    init: function() {
      let container = document.getElementById('container');

      this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.005, 10);
      this.camera.position.z = 2;

      this.scene = new Three.Scene();

      let geometry = new Three.SphereGeometry( 1, 64, 64 );
      let material = new Three.MeshBasicMaterial({color: 0x1177ff});
      this.globe = new Three.Mesh(geometry, material);
      this.scene.add(this.globe);

      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

    },
    animate: function() {
      requestAnimationFrame(this.animate);
      this.globe.rotation.x += 0.0;
      this.globe.rotation.y += 0.0;
      this.renderer.render(this.scene, this.camera);
    },
    drawCircles: function() {
      let geometryCircle = new Three.CircleGeometry( 0.005, 5);
      let materialCircle = new Three.MeshBasicMaterial({color: 0xffffff});

      for (let lat = -90; lat <=90; lat += 180/this.rows){
        const radius = Math.cos(Math.abs(lat) * DEG2RAD);
        const circumference = radius * Math.PI * 2;
        const dotsForLat = Math.floor(circumference * this.dotDensity);
        for(let x = 0; x < dotsForLat; x += 1){
          const long = x * 360./dotsForLat;
          if(lat < -50 || lat > 50) {
            continue;
          }
          if (!this.visibilityForCoordinate(long, lat)){
            continue;
          }
          let circle = new Three.Mesh(geometryCircle, materialCircle);
          this.scene.add(circle);
          let xCoord = Math.sin(long * DEG2RAD) * Math.cos(lat * DEG2RAD) * 1.001;
          let yCoord = Math.sin(lat * DEG2RAD) * 1.001;
          let zCoord = Math.cos(long * DEG2RAD) * Math.cos(lat * DEG2RAD) * 1.001;
          circle.position.set(xCoord, yCoord, zCoord);
        }
      }
    },
    loadWorldMap: function(){
      //let ctx = document.createElement('canvas').getContext('2d');
      let cnvs = document.getElementById('drawWorldMap')
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
        console.log(img.width);
        console.log(img.height);
        vm.drawCircles();
      };
      img.src = require("../assets/worldmap.png");

    },
    visibilityForCoordinate: function(long, lat) {
      const pixelRow = Math.floor(this.imgHeight/100 * (-lat + 50));
      const pixelColumn = Math.floor(this.imgWidth/360 * ((long + 90) % 360));
      return this.imgData.data[pixelRow * this.imgWidth * 4 + pixelColumn * 4 + 3] > 0;
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
