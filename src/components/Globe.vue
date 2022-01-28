<template>
  <div>
    <div id="container"></div>

    <project-card id="project0" v-bind:km-run="this.kmRun" v-bind:km-distance="this.distances[0]">
      <div>This is project 0!</div>
    </project-card>

    <project-card id="project1" v-bind:km-run="this.kmRun" v-bind:km-distance="this.distances[1]">
      <div>This is project 1!</div>
    </project-card>

    <project-card id="project2" v-bind:km-run="this.kmRun" v-bind:km-distance="this.distances[2]">
      <div>This is project 2!</div>
    </project-card>

    <project-card id="project3" v-bind:km-run="this.kmRun" v-bind:km-distance="this.distances[3]">
      <div>This is project 3!</div>
    </project-card>

    <project-card id="project4" v-bind:km-run="this.kmRun" v-bind:km-distance="this.distances[4]">
      <div>This is project 4!</div>
    </project-card>

    <project-card id="project5" v-bind:km-run="this.kmRun" v-bind:km-distance="this.distances[5]">
      <div>This is project 5!</div>
    </project-card>

    <project-card id="project6" v-bind:km-run="this.kmRun" v-bind:km-distance="this.distances[6]">
      <div>This is project 6!</div>
    </project-card>

    <project-card id="project7" v-bind:km-run="this.kmRun" v-bind:km-distance="this.distances[7]">
      <div>This is project 7!</div>
    </project-card>

    <project-card id="project8" v-bind:km-run="this.kmRun" v-bind:km-distance="this.distances[8]">
      <div>This is project 8!</div>
    </project-card>

    <project-card id="project9" v-bind:km-run="this.kmRun" v-bind:km-distance="this.distances[9]">
      <div>This is project 9!</div>
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

import vertexShader from 'raw-loader!glslify-loader!../assets/shaders/vertex.glsl'
import fragmentShader from 'raw-loader!glslify-loader!../assets/shaders/fragment.glsl'

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
      rows: 160,
      dotDensity: 80,
      imgData: null,
      imgWidth: 0,
      imgHeight: 0,
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
      archesGroup: null,
      mouse: new Three.Vector2(),
      INTERSECTED: null,
      intersectedIndex: 1,
      containerRect: null,
      kmRun: 2871,
      distances: [],
    }
  },
  methods: {
    init: function () {
      let container = document.getElementById('container');
      this.containerRect = container.getBoundingClientRect();
      this.container = container;
      this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.005, 10);
      this.camera.position.z = 2.4;

      this.scene = new Three.Scene();

      let geometry = new Three.SphereGeometry(1, 64, 64);
      let material = new Three.MeshPhongMaterial({
        color: 0x3A93C0,
        opacity: 1.,
        transparent: true,
        shininess: 5.
      });

      let geometryAtmosphere = new Three.SphereGeometry(1.15, 64, 64);
      let materialAtmosphere = new Three.ShaderMaterial({
        vertexShader,
        fragmentShader,
        blending: Three.AdditiveBlending,
        side: Three.BackSide
      });
      this.globe = new Three.Mesh(geometry, material);
      let athmosphere = new Three.Mesh(geometryAtmosphere, materialAtmosphere)
      this.scene.add(this.globe);
      this.scene.add(athmosphere);

      const ambientLight = new Three.AmbientLight(0xffffff, 0.3);
      this.scene.add(ambientLight);

      const directionalLight1 = new Three.DirectionalLight(0xffffff, 0.7);
      directionalLight1.position.set(-1, 1, .8);
      this.scene.add(directionalLight1);

      //const directionalLight2 = new Three.DirectionalLight(0xffffff, 0.2);
      //directionalLight2.position.set(-1, 1.5, 0.3);
      //this.scene.add(directionalLight2);
//
      //const directionalLight3 = new Three.DirectionalLight(0xffffff, 0.2);
      //directionalLight3.position.set(-1, 0.5, 0.3);
      //this.scene.add(directionalLight3);
//
      //const directionalLight4 = new Three.DirectionalLight(0xffffff, 0.2);
      //directionalLight4.position.set(-1, 1, 0.3);
      //this.scene.add(directionalLight4);

      const directionalLight5 = new Three.DirectionalLight(0xffffff, 1.0);
      directionalLight5.position.set(-1, 1, -2.);
      this.scene.add(directionalLight5);

      //const pointLight = new Three.PointLight( 0xffffff, 4, 100 );
      //pointLight.position.set( -50, 50, 20 );
      //this.scene.add( pointLight );

      this.renderer = new Three.WebGLRenderer({antialias: true, powerPreference: "high-performance"});
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.update();
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      this.controls.update();
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
        if (intersects[0].object !== this.INTERSECTED) {
          if (this.INTERSECTED) {
            this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
            document.getElementById("project" + this.intersectedIndex).style.display = "none";
          }
          this.INTERSECTED = intersects[0].object;
          this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
          this.INTERSECTED.material.color.setHex(0xffffff);

          for (let archInd = 0; archInd < this.arches.length; archInd += 1) {
            if (this.INTERSECTED === this.arches[archInd].curveMesh) {
              this.intersectedIndex = archInd;
            }
          }
          document.body.style.cursor = 'pointer';
          document.getElementById("project" + this.intersectedIndex).style.display = "block";
        }
      } else {
        if (this.INTERSECTED)
          this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
        this.INTERSECTED = null;
        document.getElementById("project" + this.intersectedIndex).style.display = "none";
        document.body.style.cursor = 'auto';
      }
      this.controls.update();
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
    },
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
        m.makeRotationAxis(vecY, -25 * DEG2RAD);
        vm.landMesh.applyMatrix4(m);
        const vecX = new Three.Vector3(1, 0, 0);
        m.makeRotationAxis(vecX, 20 * DEG2RAD);
        vm.landMesh.applyMatrix4(m);
      };
      img.src = require("../assets/worldmap2.png");

    },
    visibilityForCoordinate: function (long, lat) {
      const pixelRow = Math.floor(this.imgHeight / this.drawnLatDegs * (-lat + this.drawnLatDegs / 2));
      const pixelColumn = Math.floor(this.imgWidth / 360 * ((long + 180) % 360));
      return this.imgData.data[pixelRow * this.imgWidth * 4 + pixelColumn * 4 + 3] > 120;
    },
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
    },
    rotateArches: function () {
      const m = new Three.Matrix4();
      const vecY = new Three.Vector3(0, 1, 0);
      m.makeRotationAxis(vecY, -25 * DEG2RAD);

      for (let archInd = 0; archInd < this.arches.length; archInd += 1) {
        this.arches[archInd].curveMesh.applyMatrix4(m);
      }

      const vecX = new Three.Vector3(1, 0, 0);
      m.makeRotationAxis(vecX, 20 * DEG2RAD);
      for (let archInd = 0; archInd < this.arches.length; archInd += 1) {
        this.arches[archInd].curveMesh.applyMatrix4(m);
      }
    },
    fillDistances: function () {
      for (let archInd = 0; archInd < this.arches.length; archInd += 1) {
        this.distances.push(this.arches[archInd].onLandDistance);

        console.log(this.distances[archInd]);
      }
    },
  },
  mounted() {
    this.init();
    window.addEventListener('mousemove', this.onMouseMove, false);
    this.loadWorldMap();
    this.drawArch();
    this.rotateArches();
    this.fillDistances();
    this.animate();
  }
}
</script>

<style scoped>

#container {
  float: left;
  height: 800px;
  width: 800px;
}

</style>
