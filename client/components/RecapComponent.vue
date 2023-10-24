<script setup lang="ts">
import getCurrDate from "./../utils/getCurrDate";
import SlideShow from "./SlideShow.vue";
</script>
<template>
  <div id="main-content">
    <h3>See what you missed!</h3>
    <div id="slide-show-and-date">
      <p>Yesterday</p>
      <SlideShow :date="getCurrDate()" />
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: auto;
  text-align: center;
  padding-top: 2rem;
}
#main-content {
  height: 100%;
  position: relative;
}

#slide-show-and-date {
  padding: 2rem;
}
</style>
