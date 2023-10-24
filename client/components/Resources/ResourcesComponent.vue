<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import LoaderAnimated from "../LoaderAnimated.vue";
import MessageVue from "../MessageVue.vue";
const isActivated = ref(false);
const isCreation = ref(true);
const text = ref("");
const notFetched = ref(true);
const ans = ref("");
const emit = defineEmits(["refreshTags"]);

const toggleTag = async () => {
  isCreation.value = true;
  notFetched.value = true;
  text.value = "";
  ans.value = "";
  isActivated.value = !isActivated.value;
};

const createTag = async (newTag: string) => {
  isCreation.value = !isCreation.value;
  const partial = await fetchy(`api/tags/repeated/${newTag}`, "GET");
  if (partial[0] == "1") {
    const actualTag = partial.split("1")[1];
    await fetchy(`api/tags/${actualTag}`, "POST");
    emit("refreshTags");
    ans.value = `Tag "${actualTag}" created with success`;
  } else {
    ans.value = `That isn't a valid tag. Check if there's a similar existent tag or if you mispelled your word.`;
  }
  notFetched.value = false;
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
      <form @submit.prevent="createTag(text)">
        <input type="text" v-model="text" />
      </form>
    </div>
    <div v-else id="wait-while-processing">
      <div v-if="notFetched">
        <p>Wait while we analyze your request!</p>
        <LoaderAnimated />
      </div>
      <div v-else>
        <p>{{ ans }}</p>
      </div>
    </div></MessageVue
  >
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

#wait-while-processing > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
