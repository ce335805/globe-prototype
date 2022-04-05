<template>
  <div id="includeGlobe">
    <globe
        v-bind:projects="this.projects"
        v-bind:km-run="154000"
        v-bind:container-size="'600px'"
        v-bind:aspect-angle-x="10"
        v-bind:aspect-angle-y="-35"
        v-bind:reached-message="`We reached this project {times} times! We ran {kmTotal}km in total!`">
    </globe>
  </div>
</template>

<script>

import globe from "@/components/Globe"
import projectClass from "@/classes/project";
import {DEG2RAD} from "three/src/math/MathUtils";

export default {
  name: 'IncludeGlobe',
  components: {globe},
  computed: {
    projects: function () {
      return [
        new projectClass([0.0593, 0.5936], false, 'Project0', 'This is project 0', 'https://www.vivaconagua.org/en/', "@/assets/Moon.jpg"),
        new projectClass([26.6 * DEG2RAD, 86.8 * DEG2RAD], false, 'Project1', 'This is project 1 in Nepal', 'https://www.vivaconagua.org/en/', "@/assets/Moon.jpg"),
        new projectClass([23.4 * DEG2RAD, 78.8 * DEG2RAD], false, 'Project2', 'This is project 2 in India', 'https://www.vivaconagua.org/en/', "@/assets/Moon.jpg"),
        new projectClass([0.9 * DEG2RAD, 37.3 * DEG2RAD], false, 'Project3', 'This is project 3 in Kenya', 'https://www.vivaconagua.org/en/', "@/assets/Moon.jpg"),
        new projectClass([8.9 * DEG2RAD, 37.2 * DEG2RAD], false, 'Project4', 'This is project 4 in Ethopia, Ijaji', 'https://www.vivaconagua.org/en/', "@/assets/Moon.jpg"),
        new projectClass([-18.8 * DEG2RAD, 30.0 * DEG2RAD], false, 'Project5', 'This is project 5 in Zimbabwe', 'https://www.vivaconagua.org/en/', "@/assets/Moon.jpg"),
        new projectClass([9.5 * DEG2RAD, -10. * DEG2RAD], false, 'Project6', 'This is project 6 in Sierra Leone', 'https://www.vivaconagua.org/en/', "@/assets/Moon.jpg"),
        new projectClass([17.8 * DEG2RAD, 34.9 * DEG2RAD], false, 'Project7', 'This is project 7 in Mozambique', 'https://www.vivaconagua.org/en/', "@/assets/Moon.jpg"),
        new projectClass([13.7 * DEG2RAD, 26.4 * DEG2RAD], false, 'Project8', 'This is project 8 in Zambia', 'https://www.vivaconagua.org/en/', "@/assets/Moon.jpg"),
        new projectClass([10.6 * DEG2RAD, 38.0 * DEG2RAD], false, 'Project9', 'This is project 9 in Ethiopia', 'https://www.vivaconagua.org/en/', "@/assets/Moon.jpg"),
        new projectClass([10.6 * DEG2RAD, 38.0 * DEG2RAD], true, 'The Moon', 'This is the Moon!', 'https://en.wikipedia.org/wiki/Moon', "@/assets/Moon.jpg"),
      ];
    }}
}
</script>

<style>
#includeGlobe {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
