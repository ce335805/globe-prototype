<template>
  <div>
    <div id="container"></div>
    <project-card v-if="renderCard"
                  v-bind:km-run="kmRun"
                  v-bind:project="projects[intersectedIndex]"
                  v-bind:reached-message="this.reachedMessage">
    </project-card>
  </div>
</template>

<script>
import * as Three from 'three'
import {DEG2RAD} from "three/src/math/MathUtils";
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils";
import ProjectCard from "@/components/projectCard";
//import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import vertexShader from 'raw-loader!glslify-loader!../../assets/shaders/vertex.glsl'
import fragmentShader from 'raw-loader!glslify-loader!../../assets/shaders/fragment.glsl'

export default {
  name: 'globe',
  components: {ProjectCard},
  props: ['projects', 'kmRun', 'containerSize', 'aspectAngleX', 'aspectAngleY', 'reachedMessage'],
  data() {
    return {
      container: null,
      camera: null,
      scene: null,
      renderer: null,
      globe: null,
      imgData: null,
      imgWidth: 0,
      imgHeight: 0,
      landMesh: null,
      archesGroup: null,
      tubesGroup: null,
      mouse: new Three.Vector2(),
      INTERSECTED: null,
      intersectedIndex: 0,
      renderCard: false,
    }
  },
  methods: {
    init: function () {
      this.container = document.getElementById('container');
      this.container.style.width = this.containerSize;
      this.container.style.height = this.containerSize;
      this.camera = new Three.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.005, 10);
      this.camera.position.z = 2.8;
      this.scene = new Three.Scene();
      this.renderer = new Three.WebGLRenderer({
        antialias: false,
        powerPreference: "high-performance",
        alpha: true
      });
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.container.appendChild(this.renderer.domElement);
      this.renderer.setClearColor(0xffffff, 0);
      //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      //this.controls.update();
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      //this.controls.update();
      this.handleHover();
      this.renderer.render(this.scene, this.camera);
    },
    onMouseMove: function (event) {
      this.mouse.x = ((event.clientX - this.container.getBoundingClientRect().left) / this.container.clientWidth) * 2 - 1;
      this.mouse.y = -((event.clientY - this.container.getBoundingClientRect().top) / this.container.clientHeight) * 2 + 1;
    },
    onClick: function () {
      if(this.renderCard){
        window.open(this.projects[this.intersectedIndex].url);
      }
    },
    handleHover: function () {
      var mousePosition3D = new Three.Vector3(this.mouse.x, this.mouse.y, 1.);
      mousePosition3D.unproject(this.camera);
      var ray = new Three.Raycaster(this.camera.position, mousePosition3D.sub(this.camera.position).normalize());

      var intersects = ray.intersectObjects(this.tubesGroup.children);

      const color0 = 0xffc97b;
      const colorHovered = 0xf57b42;

      if (intersects.length > 0) {
        if (intersects[0].object !== this.INTERSECTED) {
          if (this.INTERSECTED) {
            this.INTERSECTED.material.opacity = 0.;
            this.projects[this.intersectedIndex].getArchMesh().material.color.setHex(color0);
          }
          this.INTERSECTED = intersects[0].object;
          this.INTERSECTED.material.opacity = 0.15;

          for (let projectInd = 0; projectInd < this.projects.length; projectInd += 1) {
            if (this.INTERSECTED === this.projects[projectInd].getTubeMesh()) {
              this.intersectedIndex = projectInd;
            }
          }
          this.renderCard = true;
          document.body.style.cursor = 'pointer';
          this.projects[this.intersectedIndex].getArchMesh().material.color.setHex(colorHovered);
        }
      } else {
        if (this.INTERSECTED)
          this.INTERSECTED.material.opacity = 0.;
        this.INTERSECTED = null;
        this.projects[this.intersectedIndex].getArchMesh().material.color.setHex(color0);
        this.renderCard = false;
        document.body.style.cursor = 'auto';
      }
    },
    addLights: function(){
      const ambientLight = new Three.AmbientLight(0xffffff, 0.3);
      this.scene.add(ambientLight);

      const directionalLight1 = new Three.DirectionalLight(0xffffff, 0.3);
      directionalLight1.position.set(-1, 1, .8);
      this.scene.add(directionalLight1);

      const directionalLight2 = new Three.DirectionalLight(0xffffff, 0.3);
      directionalLight2.position.set(-1, .5, 1.5);
      this.scene.add(directionalLight2);

      const directionalLight3 = new Three.DirectionalLight(0xffffff, 0.3);
      directionalLight3.position.set(-1, 1.5, 1.5);
      this.scene.add(directionalLight3);

      const directionalLight5 = new Three.DirectionalLight(0xffffff, .4);
      directionalLight5.position.set(-1, 1., -2.);
      this.scene.add(directionalLight5);

      const directionalLight6 = new Three.DirectionalLight(0xffffff, 1.25);
      directionalLight6.position.set(-1, 0.3, -1.2);
      this.scene.add(directionalLight6);
    },
    addGlobeAndAthmosphere(){
      let geometry = new Three.SphereGeometry(1, 64, 64);
      let material = new Three.MeshPhongMaterial({
        color: 0x3A93C0,
        opacity: 1.,
        transparent: true,
        shininess: 5.
      });

      let geometryAtmosphere = new Three.SphereGeometry(1.1, 64, 64);
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
    },
    drawLandmassOnGlobe: function () {
      let geometries = [];
      const rows = 160;
      const dotDensity = 80;
      for (let lat = -90; lat <= 90; lat += 180 / rows) {
        const radius = Math.cos(Math.abs(lat) * DEG2RAD);
        const circumference = radius * Math.PI * 2;
        const dotsForLat = Math.floor(circumference * dotDensity);
        for (let x = 0; x < dotsForLat; x += 1) {
          const long = x * 360. / dotsForLat;
          if (!this.isLandPixelVisible(long, lat)) {
            continue;
          }
          let geometryCircle = new Three.CircleBufferGeometry(0.005, 5);
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
        cnvs.width = img.width;
        cnvs.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
        vm.imgData = ctx.getImageData(0, 0, img.width, img.height);
        vm.imgWidth = img.width;
        vm.imgHeight = img.height;
        vm.drawLandmassOnGlobe();
        //rotate globe to nice position
        const m = new Three.Matrix4();
        const vecY = new Three.Vector3(0, 1, 0);
        m.makeRotationAxis(vecY, vm.aspectAngleY * DEG2RAD);
        vm.landMesh.applyMatrix4(m);
        const vecX = new Three.Vector3(1, 0, 0);
        m.makeRotationAxis(vecX, vm.aspectAngleX * DEG2RAD);
        vm.landMesh.applyMatrix4(m);
      };
      img.src = require("../../assets/worldmap2.png");

    },
    isLandPixelVisible: function (long, lat) {
      const pixelRow = Math.floor(this.imgHeight / 180 * (-lat + 90));
      const pixelColumn = Math.floor(this.imgWidth / 360 * ((long + 180) % 360));
      return this.imgData.data[pixelRow * this.imgWidth * 4 + pixelColumn * 4 + 3] > 120;
    },
    addArchesToScene: function () {
      this.archesGroup = new Three.Group();
      this.tubesGroup = new Three.Group();
      this.archesGroup.renderOrder = 0;
      this.tubesGroup.renderOrder = 2;
      for (let projectInd = 0; projectInd < this.projects.length; projectInd += 1) {
        this.projects[projectInd].arch.rotateY(this.aspectAngleY, 0);
        this.projects[projectInd].arch.rotateX(this.aspectAngleX, 0);
        this.archesGroup.add(this.projects[projectInd].getArchMesh());
        this.tubesGroup.add(this.projects[projectInd].getTubeMesh());
      }
      this.scene.add(this.archesGroup);
      this.scene.add(this.tubesGroup);
    },
  },
  mounted() {
    this.init();
    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('click', this.onClick, false);
    this.addGlobeAndAthmosphere();
    this.addLights();
    this.loadWorldMap();
    this.addArchesToScene();
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
