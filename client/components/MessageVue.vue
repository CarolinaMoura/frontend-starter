<script setup lang="ts">
import { computed, defineProps } from "vue";
const props = defineProps({ isActivated: Boolean });

const xButton = computed(() => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#7b8679" viewBox="0 0 256 256">
      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  `;
  return svg;
});

const onHoverExitButton = () => {
  const svg = document.querySelectorAll("svg");
  if (svg) {
    svg[0].style.fill = "#000000";
  }
};

const notOnHoverExitButton = () => {
  const svg = document.querySelectorAll("svg");
  if (svg) {
    svg[0].style.fill = "#7b8679";
  }
};
</script>
<template>
  <div id="everything" v-if="props.isActivated">
    <div id="message-filter" class="overlay"></div>
    <div class="popup">
      <div class="exit" @mouseover="onHoverExitButton" @mouseout="notOnHoverExitButton" @click="$emit('toggle')">
        <div v-html="xButton" @mouseover="onHoverExitButton" @mouseout="notOnHoverExitButton"></div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style>
.exit {
  display: flex;
  flex-direction: row-reverse;
}

.exit-button {
  width: 1rem;
  height: 1rem;
}

.exit-button:hover {
  cursor: pointer;
}

.popup {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

.exit:hover {
  cursor: pointer;
}

.popup {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: auto;
  background: #fff;
  z-index: 998;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  filter: blur(5px); /* Adds a blur effect to the background */
  z-index: 997; /* Below the pop-up */
}

#message-message {
  background-color: white;
  margin: auto;
  z-index: 999;
}
</style>
