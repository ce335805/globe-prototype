<template>
  <div class="projectCard" id="projectCard" v-bind:class="{show: this.showCard, hide: !this.showCard}">

    <div>
      <div class="imageContainer">
        <img class="image" v-bind:src="this.project.imgUrl" alt="A project specific picture.">
      </div>
      <div class="textContainer">
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
      </div>
    </div>

    <div class="progress">
      <div class="progressBar"
           v-bind:class="{ lightBackground: this.isReached }">
        <div class="multiplesRight" v-if="this.isInfoRight">{{ this.infoRight }}</div>
        <div class="colorBar" v-bind:style="{ width: this.progressFractionModulo }">
          <div class="multiplesLeft" v-if="this.isInfoLeft">{{ this.infoLeft }}</div>
        </div>
      </div>
      <div v-if="this.isReached"><p>{{ this.replacedReachedMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "projectCard",
  props: ['kmRun', 'project', 'reachedMessage'],
  data() {
    return {
      card: null,
      showCard: false,
    }
  },
  computed: {
    progressFractionModulo: function () {
      const progressNumeric = ((this.kmRun / this.project.distance) * 100) % 100;
      return progressNumeric.toString() + "%";
    },
    isReached: function () {
      return this.kmRun > this.project.distance;
    },
    multiples: function () {
      return Math.floor(this.kmRun / this.project.distance);
    },
    reachedMessageReplacements: function () {
      return {
        times: this.multiples.toString(),
        kmTotal: this.kmRun.toString(),
      };
    },
    replacedReachedMessage: function () {
      return this.reachedMessage.replace(/{(\w+)}/g,
          (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
              this.reachedMessageReplacements[placeholderWithoutDelimiters] || placeholderWithDelimiters);
    },
    isInfoRight: function () {
      return ((this.kmRun / this.project.distance) * 100) % 100 < 50;
    },
    isInfoLeft: function () {
      return ((this.kmRun / this.project.distance) * 100) % 100 >= 50;
    },
    infoRight: function () {
      if (this.isReached) {
        return this.multiples.toString() + " times";
      } else {
        return (this.project.distance - this.kmRun).toString() + "km to go";
      }
    },
    infoLeft: function () {
      if (this.isReached) {
        return this.multiples.toString() + " times";
      } else {
        return this.kmRun.toString + "km done";
      }
    },
  },
  methods: {
    onMouseMove: function (event) {
      this.showCard = true;
      this.card.style.left = event.clientX + 20 + 'px';
      this.card.style.top = event.clientY + 20 + 'px';
    },
  },
  mounted() {
    this.card = document.getElementById('projectCard');
    window.addEventListener('mousemove', this.onMouseMove, false);
    console.log(this.project.imgUrl)
  }
}
</script>

<style scoped>

.show {
  display: block;
}

.hide {
  display: none;
}

.projectCard {
  box-sizing: border-box;
  position: absolute;
  width: 500px;
  background-color: #ffffff;
  padding: 0px;


  border-style: solid;
  border-width: 2px;
  border-color: #636363;
  border-radius: 4px;
}

.progress {
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


.imageContainer {
  float: left;
  padding: 10px;
}

.textContainer {
  padding: 10px;
}

p {
  text-align: justify;
}

.image {
  width: 200px;
  height: 200px;
}

</style>
