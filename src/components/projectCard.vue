<template>
  <div class="projectCard">
    <slot></slot>
  </div>
</template>

<script>
//import * as Three from "three";

export default {
  name: "projectCard",
  data() {
    return {
      //mouse: new Three.Vector2(),
      //htmlElement: null
    }
  },
  methods: {
    //onMouseMove: function (event) {
    //  this.htmlElement.style.left = event.clientX + 20 + 'px';
    //  this.htmlElement.style.top = event.clientY + 20 + 'px';
    //},
  },
  mounted() {
    //this.htmlElement = document.getElementById('projectCard');
    //window.addEventListener('mousemove', this.onMouseMove, false);
  }
}
</script>

<style scoped>
.projectCard{
  position: relative;
  padding: 20px;
  background-color: #ee3355;
  display: none;
  float:left;
}
</style>
