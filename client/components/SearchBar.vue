<script setup lang="ts">
import { ref } from "vue";
const text = ref("");
const props = defineProps({ items: Array<String> });
const items = ref(props.items);

const findResults = () => {};
</script>
<template>
  <div id="search">
    <form @submit.prevent=""><input v-model="text" placeholder="Search tags..." @input="findResults" /></form>
    <div id="search-results">
      <div id="search-results">
        <ul>
          <li v-for="item in items" :key="item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
#search {
  display: flex;
  flex-direction: column;
  gap: 0;
  justify-content: center;
  align-items: start;
}

input {
  width: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

form {
  width: 100%;
  margin: auto;
  padding: 0;
}

#search-results {
  background-color: white;
  min-height: 5rem;
  position: relative;
  top: 0;
  left: 0;
  z-index: 888;
  margin-top: 0;
  width: 100%;
}
</style>
