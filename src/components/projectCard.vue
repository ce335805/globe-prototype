<template>
  <div id="projectCard">
    <slot></slot>
  </div>
</template>

<script>
import * as Three from "three";

export default {
  name: "projectCard",
  data() {
    return {
      mouse: new Three.Vector2(),
      htmlElement: null
    }
  },
  methods: {
    onMouseMove: function (event) {
      this.htmlElement.style.left = event.clientX + 20 + 'px';
      this.htmlElement.style.top = event.clientY + 20 + 'px';

    },
  },
  mounted() {
    this.htmlElement = document.getElementById('projectCard');
    window.addEventListener('mousemove', this.onMouseMove, false);
  }
}
</script>

<style scoped>
#projectCard{
  position: absolute;
  left: 0;
  top: 0;
  background-color: #ffffff;
  min-width: 0;
  min-height: 0;
  display: block;
}
</style>
