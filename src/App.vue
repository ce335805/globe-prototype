<template>
  <div id="app">
    <globe/>
  </div>
</template>

<script>
import globe from './components/Globe.vue'

export default {
  name: 'App',
  components: {
    globe
  }
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
