<template>
  <div class="projectCard">
    <slot></slot>
    <div class="progressBar">
      <div class="colorBar" v-bind:style="{ width: this.progressFraction }"></div>
    </div>
  </div>
</template>

<script>
//import * as Three from "three";

export default {
  name: "projectCard",
  props: ['kmRun', 'kmDistance'],
  data() {
    return {
      //mouse: new Three.Vector2(),
      //htmlElement: null
    }
  },
  computed: {
    progressFraction: function () {
      const progressNumeric = this.kmRun / this.kmDistance * 100;
      return progressNumeric.toString() + "%";
    }
  },
  methods: {
    //onMouseMove: function (event) {
    //  this.htmlElement.style.left = event.clientX + 20 + 'px';
    //  this.htmlElement.style.top = event.clientY + 20 + 'px';
    //},
  },
  mounted() {
    //const progressNumeric = this.kmRun / this.kmDistance * 100;
    //console.log(progressNumeric);
    //this.progressFraction = progressNumeric.toString() + "%";
    //console.log(this.progressFraction);
    //this.htmlElement = document.getElementById('projectCard');
    //window.addEventListener('mousemove', this.onMouseMove, false);
  }
}
</script>

<style scoped>
.projectCard{
  display: none;
  float:left;
  width: 400px;

  padding: 20px;
  background-color: #ffffff;


  border-style: solid;
  border-width: 2px;
  border-color: #636363;
  border-radius: 4px;
}
.progressBar{
  width: 100%;
  margin: 5px;
  border-style: solid;
  border-width: 2px;
  border-color: #636363;
  border-radius: 2px;

}
.colorBar{
  background-color: #52c3e5;
  height: 20px;
  width: 50%;
}
</style>
