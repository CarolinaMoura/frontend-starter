<script setup lang="ts">
import { ref, watch } from "vue";
const text = ref("");
const props = defineProps({ itemss: Array<String> });
const displaySearchResults = ref(false);
const xxx = props.itemss ?? [];
const items = ref<Array<String>>(xxx.sort());
const allItems = ref<Array<String>>(xxx.sort());
const emit = defineEmits(["addItem"]);

const findResults = () => {
  if (text.value === "") {
    items.value = (props.itemss ?? []).sort();
  }
  items.value = allItems.value.sort().filter((item) => item.startsWith(text.value));
};

const handleClick = (item: String) => {
  emit("addItem", item);
  displaySearchResults.value = false;
};

watch(
  () => props.itemss,
  (newItems) => {
    items.value = (newItems ?? []).sort();
    allItems.value = (newItems ?? []).sort();
  },
);
</script>
<template>
  <div id="search">
    <div id="navigation">
      <img v-if="displaySearchResults" src="../assets/images/go-back.svg" width="32" height="32" @click="() => (displaySearchResults = false)" />
      <div id="search-stuff">
        <form @submit.prevent=""><input @click="() => (displaySearchResults = true)" v-model="text" placeholder="Add tags..." @input="findResults" /></form>
        <div v-if="displaySearchResults" id="search-results">
          <ul>
            <li v-for="item in items" @click="handleClick(item)" :key="item.toString()">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#navigation {
  display: flex;
  align-items: center;
  width: 100%;
}
ul {
  list-style: none;
  padding: 0;
  /* padding-left: 1.2rem;
  padding-right: 1.2rem; */
}
#search-stuff {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
img:hover {
  cursor: pointer;
}
li {
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 1.2rem;
}
li:hover {
  box-sizing: border-box;
  background-color: rgba(236, 236, 236, 80%);
}
#search {
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

input {
  height: 100%;
  padding: 0.3rem;
  border-radius: 10px;
}

form {
  width: 100%;
  position: relative;
}

#search-results {
  background-color: white;
  min-height: 5rem;
  position: absolute;
  top: 100%; /* Position it below the input field */
  left: 0;
  z-index: 888; /* Ensure it appears on top of other content */
  width: 100%;
  border: 1px solid #157f03;

  /* Add any other styling for the search results container */
}
</style>
