<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import SearchBar from "../SearchBar.vue";

const content = ref("");
const emit = defineEmits(["refreshPosts"]);
const allTags = ref();

const createPost = async (content: string) => {
  try {
    await fetchy("api/posts", "POST", {
      body: { content },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};

const mostra = ref(false);
const getTags = async () => {
  allTags.value = await fetchy("api/tags", "GET");
  mostra.value = true;
};

onBeforeMount(async () => {
  await getTags();
  console.log(allTags.value);
});
</script>

<template>
  <form @submit.prevent="createPost(content)">
    <SearchBar v-if="mostra" :items="allTags" />
    <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
form {
  margin-top: 3rem;
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

textarea:focus-visible {
  outline: 2px solid #157f03;
  border: none;
}
</style>
