<script setup lang="ts">
import { ref } from "vue";

const tag = ref("");
const emit = defineEmits(["getPostsByTags"]);
</script>

<template>
  <form @submit.prevent="emit('getPostsByTags', tag)" class="pure-form">
    <fieldset>
      <legend>Search by tags!</legend>
      <input id="tag" type="text" v-model="tag" placeholder="Ex.: mit" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
  justify-content: center;
}

legend {
  text-align: center;
}
</style>
