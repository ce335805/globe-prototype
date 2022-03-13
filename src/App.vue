<template>
  <div id="app">
    <globe v-bind:projects="this.projects" v-bind:km-run="154000"></globe>>
  </div>
</template>

<script>
import globe from './components/globe/Globe.vue'
import projectClass from "@/classes/project";

export default {
  name: 'App',
  components: {
    globe
  },
  computed: {
  projects: function () {
    return[
      //coordinatesArches: [
      //  [[0.9326, 0.1740], [0.0593, 0.5936]],
      //  [[0.9326, 0.1740], [26.6 * DEG2RAD, 86.8 * DEG2RAD]],//Nepal
      //  [[0.9326, 0.1740], [23.4 * DEG2RAD, 78.8 * DEG2RAD]],//India
      //  [[0.9326, 0.1740], [0.9 * DEG2RAD, 37.3 * DEG2RAD]],//Kenya
      //  [[0.9326, 0.1740], [8.9 * DEG2RAD, 37.2 * DEG2RAD]],//Ethopia, Ijaji
      //  [[0.9326, 0.1740], [-18.8 * DEG2RAD, 30.0 * DEG2RAD]],//Zimbabwe
      //  [[0.9326, 0.1740], [9.5 * DEG2RAD, -10. * DEG2RAD]],//Sierra Leone 8.9, -11.7
      //  [[0.9326, 0.1740], [17.8 * DEG2RAD, 34.9 * DEG2RAD]],//Mozambique
      //  [[0.9326, 0.1740], [13.7 * DEG2RAD, 26.4 * DEG2RAD]],//Zambia
      //  [[0.9326, 0.1740], [10.6 * DEG2RAD, 38.0 * DEG2RAD]]//Ethiopia
      //],
        new projectClass([0.0593, 0.5936], false, 'Project0', 'This is project 0', 'www.vivaconagua.org/en/', "@/assets/Moon.jpg")
    ];
  }}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
