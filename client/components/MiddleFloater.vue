<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["changeTab"]);
const pages = ref(["Feed", "Recap"]);
</script>

<template>
  <div id="tab-bar">
    <div class="tab-container" @click="emit('changeTab', page)" v-for="page in pages" :key="page">
      <div class="tab">{{ page }}</div>
    </div>
  </div>
  <div id="actual-content">
    <slot></slot>
  </div>
</template>

<style scoped>
#tab-bar {
  height: 3.5rem;
  padding-left: 0.6rem;
  padding-right: 0.6rem;
  background-color: transparent;
  display: flex;
  justify-content: left;
  align-items: center;
  box-sizing: border-box;
}

.tab {
  height: 100%;
  /* box-sizing: border-box;
  border: 5px solid black;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px; */
}

.tab {
  min-width: 180px;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  background-color: white; /* Change to your desired background color */
  color: #000; /* Change to your desired text color */
  padding: 10px 50px;
  clip-path: polygon(15% 1%, 85% 1%, 99% 99%, 1% 99%);
}

.tab:hover {
  cursor: pointer;
}

.tab-container {
  box-sizing: border-box;
  height: 100%;
  clip-path: polygon(14% 0, 86% 0, 100% 100%, 0 100%);
  background-color: rgb(235, 233, 233);
}
</style>
