<template>
  <div>
    <div id="container"></div>
    <canvas id="drawWorldMap"></canvas>
    <project-card>
      <div id = "project0" style="display: none; padding: 10px;">This is project 0!</div>
      <div id = "project1" style="display: none; padding: 10px;">This is project 1!</div>
      <div id = "project2" style="display: none; padding: 10px;">This is project 2!</div>
      <div id = "project3" style="display: none; padding: 10px;">This is project 3!</div>
      <div id = "project4" style="display: none; padding: 10px;">This is project 4!</div>
      <div id = "project5" style="display: none; padding: 10px;">This is project 5!</div>
      <div id = "project6" style="display: none; padding: 10px;">This is project 6!</div>
      <div id = "project7" style="display: none; padding: 10px;">This is project 7!</div>
      <div id = "project8" style="display: none; padding: 10px;">This is project 8!</div>
      <div id = "project9" style="display: none; padding: 10px;">This is project 9!</div>
  </project-card>
  </div>
</template>

<script>
import * as Three from 'three'
import {DEG2RAD} from "three/src/math/MathUtils";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils";
import archClass from "@/classes/arch";
import ProjectCard from "@/components/projectCard";

export default {
  name: 'globe',
  components: {ProjectCard},
  data() {
    return {
      container: null,
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
      coordinatesArches: [
        [[0.9326, 0.1740], [0.0593, 0.5936]],
        [[0.9326, 0.1740], [26.6 * DEG2RAD, 86.8 * DEG2RAD]],//Nepal
        [[0.9326, 0.1740], [23.4 * DEG2RAD, 78.8 * DEG2RAD]],//India
        [[0.9326, 0.1740], [0.9 * DEG2RAD, 37.3 * DEG2RAD]],//Kenya
        [[0.9326, 0.1740], [8.9 * DEG2RAD, 37.2 * DEG2RAD]],//Ethopia, Ijaji
        [[0.9326, 0.1740], [-18.8 * DEG2RAD, 30.0 * DEG2RAD]],//Zimbabwe
        [[0.9326, 0.1740], [8.9 * DEG2RAD, -11.7 * DEG2RAD]],//Sierra Leone
        [[0.9326, 0.1740], [17.8 * DEG2RAD, 34.9 * DEG2RAD]],//Mozambique
        [[0.9326, 0.1740], [13.7 * DEG2RAD, 26.4 * DEG2RAD]],//Zambia
        [[0.9326, 0.1740], [10.6 * DEG2RAD, 38.0 * DEG2RAD]]//Ethiopia
      ],
      arches: [],
      mouse: new Three.Vector2(),
      INTERSECTED: null,
      intersectedIndex: 1,
      containerRect: null,
      archesGroup: null
    }
  },
  //threex.domevents - use for mouse-hover
  methods: {
    init: function () {
      let container = document.getElementById('container');
      this.containerRect = container.getBoundingClientRect();
      this.container = container;
      this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.005, 10);
      this.camera.position.z = 2.4;

      this.scene = new Three.Scene();

      let geometry = new Three.SphereGeometry(1, 64, 64);
      let material = new Three.MeshBasicMaterial({color: 0x3251a6, opacity: 0.7, transparent: true});
      this.globe = new Three.Mesh(geometry, material);
      this.scene.add(this.globe);

      this.renderer = new Three.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.update();
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      this.controls.update();
      //const m = new Three.Matrix4();
      //const vecY = new Three.Vector3(0, 1, 0);
      //m.makeRotationAxis(vecY, 0.05 * DEG2RAD);
      //this.landMesh.applyMatrix4(m);
      //this.arches[0].curveMesh.applyMatrix4(m);
      //this.arches[0].archRangeTick();

      this.update();
      this.renderer.render(this.scene, this.camera);
    },
    onMouseMove: function (event) {
      this.mouse.x = ((event.clientX - this.containerRect.left) / this.container.clientWidth) * 2 - 1;
      this.mouse.y = -((event.clientY - this.containerRect.top) / this.container.clientHeight) * 2 + 1;
    },
    update: function () {
      var vector = new Three.Vector3(this.mouse.x, this.mouse.y, 1.);
      vector.unproject(this.camera);
      var ray = new Three.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());

      var intersects = ray.intersectObjects(this.archesGroup.children);

      if (intersects.length > 0) {
        // if the closest object intersected is not the currently stored intersection object
        if (intersects[0].object !== this.INTERSECTED) {
          // restore previous intersection object (if it exists) to its original color
          if (this.INTERSECTED) {
            this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
            document.getElementById("project" + this.intersectedIndex).style.display = "none";
          }
          // store reference to closest object as current intersection object
          this.INTERSECTED = intersects[0].object;
          // store color of closest object (for later restoration)
          this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
          // set a new color for closest object
          this.INTERSECTED.material.color.setHex(0xffffff);

          for (let archInd = 0; archInd < this.arches.length; archInd += 1) {
              if(this.INTERSECTED === this.arches[archInd].curveMesh){
                this.intersectedIndex = archInd;
              }
          }
          document.body.style.cursor = 'pointer';
          document.getElementById("project" + this.intersectedIndex).style.display = "block";
        }
      } else // there are no intersections
      {
        // restore previous intersection object (if it exists) to its original color
        if (this.INTERSECTED)
          this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
        // remove previous intersection object reference
        //     by setting current intersection object to "nothing"
        this.INTERSECTED = null;
        document.getElementById("project" + this.intersectedIndex).style.display = "none";
        document.body.style.cursor = 'auto';
      }

      this.controls.update();
      //this.stats.update();
    },
    drawCircles: function () {
      let geometries = [];
      for (let lat = -90; lat <= 90; lat += 180 / this.rows) {
        const radius = Math.cos(Math.abs(lat) * DEG2RAD);
        const circumference = radius * Math.PI * 2;
        const dotsForLat = Math.floor(circumference * this.dotDensity);
        for (let x = 0; x < dotsForLat; x += 1) {
          const long = x * 360. / dotsForLat;
          if (!this.visibilityForCoordinate(long, lat)) {
            continue;
          }
          let geometryCircle = new Three.CircleBufferGeometry(0.004, 5);
          const xCoord = Math.sin(long * DEG2RAD) * Math.cos(lat * DEG2RAD) * 1.001;
          const yCoord = Math.sin(lat * DEG2RAD) * 1.001;
          const zCoord = Math.cos(long * DEG2RAD) * Math.cos(lat * DEG2RAD) * 1.001;
          const m = new Three.Matrix4();
          const vecX = new Three.Vector3(1, 0, 0);
          m.makeRotationAxis(vecX, -lat * DEG2RAD);
          geometryCircle.applyMatrix4(m);
          const vecY = new Three.Vector3(0, 1, 0);
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
    }
    ,

    loadWorldMap: function () {
      let cnvs = document.createElement('canvas')
      let ctx = cnvs.getContext('2d');
      let img = new Image();
      let vm = this;
      img.onload = function () {
        //console.log('image loaded');
        cnvs.width = img.width;
        cnvs.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
        vm.imgData = ctx.getImageData(0, 0, img.width, img.height);
        vm.imgWidth = img.width;
        vm.imgHeight = img.height;
        vm.drawCircles();
        //rotate globe to nice position
        const m = new Three.Matrix4();
        const vecY = new Three.Vector3(0, 1, 0);
        m.makeRotationAxis(vecY, -37 * DEG2RAD);
        vm.landMesh.applyMatrix4(m);
        const vecX = new Three.Vector3(1, 0, 0);
        m.makeRotationAxis(vecX, 20 * DEG2RAD);
        vm.landMesh.applyMatrix4(m);
      };
      img.src = require("../assets/worldmap2.png");

    }
    ,
    visibilityForCoordinate: function (long, lat) {
      const pixelRow = Math.floor(this.imgHeight / this.drawnLatDegs * (-lat + this.drawnLatDegs / 2));
      const pixelColumn = Math.floor(this.imgWidth / 360 * ((long + 180) % 360));
      return this.imgData.data[pixelRow * this.imgWidth * 4 + pixelColumn * 4 + 3] > 120;
    }
    ,
    drawArch: function () {
      this.arches = [
        new archClass(this.coordinatesArches[0][0], this.coordinatesArches[0][1]),
        new archClass(this.coordinatesArches[1][0], this.coordinatesArches[1][1]),
        new archClass(this.coordinatesArches[2][0], this.coordinatesArches[2][1]),
        new archClass(this.coordinatesArches[3][0], this.coordinatesArches[3][1]),
        new archClass(this.coordinatesArches[4][0], this.coordinatesArches[4][1]),
        new archClass(this.coordinatesArches[5][0], this.coordinatesArches[5][1]),
        new archClass(this.coordinatesArches[6][0], this.coordinatesArches[6][1]),
        new archClass(this.coordinatesArches[7][0], this.coordinatesArches[7][1]),
        new archClass(this.coordinatesArches[8][0], this.coordinatesArches[8][1]),
        new archClass(this.coordinatesArches[9][0], this.coordinatesArches[9][1])
      ];
      this.archesGroup = new Three.Group();
      for (let archInd = 0; archInd < this.arches.length; archInd += 1) {
        //this.scene.add(this.arches[archInd].curveMesh);
        this.archesGroup.add(this.arches[archInd].curveMesh);
      }
      this.scene.add(this.archesGroup);
    }
    ,
    rotateArches: function () {
      const m = new Three.Matrix4();
      const vecY = new Three.Vector3(0, 1, 0);
      m.makeRotationAxis(vecY, -37 * DEG2RAD);

      for (let archInd = 0; archInd < this.arches.length; archInd += 1) {
        this.arches[archInd].curveMesh.applyMatrix4(m);
      }

      const vecX = new Three.Vector3(1, 0, 0);
      m.makeRotationAxis(vecX, 20 * DEG2RAD);
      for (let archInd = 0; archInd < this.arches.length; archInd += 1) {
        this.arches[archInd].curveMesh.applyMatrix4(m);
      }

    }
    ,
  },
  mounted() {
    this.init();
    window.addEventListener( 'mousemove', this.onMouseMove, false );
    this.loadWorldMap();
    this.drawArch();
    this.rotateArches();
    this.animate();
  }
}
</script>

<style scoped>

#container {
  height: 800px;
  width: 800px;
}

#drawWorldMap {
  height: 300px;
  width: 600px;
}

</style>
