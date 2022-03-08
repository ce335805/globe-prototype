<template>
  <div class="projectCard">
    <slot></slot>
    <div class="progress">
    <div class="progressBar"
         v-bind:class="{ lightBackground: this.isReached }">
      <div class="multiplesRight" v-if="this.isInfoRight">{{this.infoRight}}</div>
      <div class="colorBar" v-bind:style="{ width: this.progressFractionModulo }">
        <div class="multiplesLeft" v-if="this.isInfoLeft">{{this.infoLeft}}</div>
      </div>
    </div>
    <div v-if="this.isReached"><p>We ran to this project {{this.multiples}} times! {{this.kmRun}}km in total!</p></div>
    </div>
    </div>
</template>

<script>
//import * as Three from "three";

export default {
  name: "projectCard",
  props: ['kmRun', 'kmDistance', 'url'],
  data() {
    return {
      allCards: null
    }
  },
  computed: {
    progressFractionModulo: function () {
      const progressNumeric = ((this.kmRun / this.kmDistance) * 100) % 100;
      return progressNumeric.toString() + "%";
    },
    isReached: function () {
      return this.kmRun > this.kmDistance;
    },
    multiples: function () {
      return Math.floor(this.kmRun / this.kmDistance);
    },
    isInfoRight: function () {
      return ((this.kmRun / this.kmDistance) * 100) % 100 < 50;
    },
    isInfoLeft: function () {
      return ((this.kmRun / this.kmDistance) * 100) % 100 >= 50;
    },
    infoRight: function () {
      if(this.isReached){
        return this.multiples.toString() + " times";
      } else {
        return (this.kmDistance - this.kmRun).toString() + "km to go";
      }
    },
    infoLeft: function () {
      if(this.isReached){
        return this.multiples.toString() + " times";
      } else {
        return this.kmRun.toString + "km done";
      }
    },
  },
  methods: {
    onMouseMove: function (event) {
      for (let ind = 0; ind < this.allCards.length; ind++) {
        this.allCards[ind].style.left = event.clientX + 20 + 'px';
        this.allCards[ind].style.top = event.clientY + 20 + 'px';
      }
    },
    onClick: function () {
      window.open(this.url, '_blank').focus();
    }
  },
  mounted() {
    const progressNumeric = this.kmRun / this.kmDistance * 100;
    this.progressFractionModulo = progressNumeric.toString() + "%";
    this.allCards = document.getElementsByClassName('projectCard');
    window.addEventListener('mousemove', this.onMouseMove, false);
  }
}
</script>

<style scoped>
.projectCard {
  box-sizing: border-box;
  position: absolute;
  display: none;
  width: 500px;

  padding: 0px;
  background-color: #ffffff;


  border-style: solid;
  border-width: 2px;
  border-color: #636363;
  border-radius: 4px;
}

.progress{
  box-sizing: border-box;
  clear: left;
  padding: 0px 5px 5px 5px;
}

.progressBar {
  box-sizing: border-box;
  width: 100%;
  margin: 0px;
  border-style: solid;
  border-width: 2px;
  border-color: #636363;
  border-radius: 2px;
  text-align: right;

}

.colorBar {
  box-sizing: border-box;
  background-color: #52c3e5;
  height: 20px;
  width: 50%;
}

.lightBackground {
  background-color: #bee8ff;
}
.multiplesRight {
  float: right;
  font-size: 18px;
  font-weight: bold;
  margin-left: 5px;
  margin-right: 5px;
}

.multiplesLeft {
  float: left;
  font-weight: bold;
  font-size: 18px;
  margin-left: 5px;
  margin-right: 5px;
}

</style>
