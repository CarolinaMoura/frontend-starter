<script setup lang="ts">
const createTag = () => {
  const body = document.querySelector('body');
}
</script>
<template>
  <div id="resources-container">
    <h1>Resources</h1>
    <ul id="resources-list">
      <button @click="createTag"><li>Create new tag</li></button>
    </ul>
  </div>
</template>

<style>
#resources-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#resources-list {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>
