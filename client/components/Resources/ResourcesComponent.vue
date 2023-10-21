<script setup lang="ts">
import { ref } from "vue";
import LoaderAnimated from "../LoaderAnimated.vue";
import MessageVue from "../MessageVue.vue";
const isActivated = ref(false);
const isCreation = ref(true);
const text = ref("");

const toggleTag = async () => {
  isActivated.value = !isActivated.value;
};

const createTag = () => {
  isCreation.value = !isCreation.value;
};
</script>
<template>
  <MessageVue id="popup-tags" :isActivated="isActivated" @toggle="toggleTag">
    <div id="create-tag" v-if="isCreation">
      <p>Your tag should meet the following criteria:</p>
      <ul>
        <li>contain only alphanumeric lowercase characters</li>
        <li>not contain inappropriate content</li>
      </ul>
      <form @submit.prevent="createTag">
        <input
          type="text"
          :value="text"
          @input="
            (event) => {
              text = (!text.startsWith('#') ? '#' : '') + text;
            }
          "
        />
      </form>
    </div>
    <div v-else id="wait-while-processing">
      <p>Wait while we analyze your request!</p>
      <LoaderAnimated /></div
  ></MessageVue>
  <div id="resources-container">
    <h1>Resources</h1>
    <ul id="resources-list">
      <button @click="toggleTag"><li>Create new tag</li></button>
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

#wait-while-processing {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
