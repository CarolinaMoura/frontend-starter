<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import SearchBar from "../SearchBar.vue";

const content = ref("");
const props = defineProps(["tags"]);
const emit = defineEmits(["refreshPosts"]);
let canAddTags = ref<Array<string>>([]);
let listaTags = ref<Array<string>>([]);
const mostra = ref(false);

const createPost = async (content: string, tags: Array<string>) => {
  try {
    const post = await fetchy("api/posts", "POST", {
      body: { content },
    });
    const postId = post.post._id;
    for (const tag of tags) {
      await fetchy(`api/tags/attachments/${tag}/${postId}/false`, "POST");
    }
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
  listaTags.value = [];
  canAddTags.value = [...props.tags];
};

onBeforeMount(async () => {
  canAddTags.value = props.tags.map((tag) => tag);
  mostra.value = true;
});

const addTag = (tag: string) => {
  listaTags.value = [...listaTags.value, tag];
  canAddTags.value = props.tags.filter((tag: String) => {
    for (const tagg of listaTags.value) {
      if (tag === tagg) {
        return false;
      }
    }
    return true;
  });
};

const removeTag = (tag: string) => {
  if (!listaTags.value.includes(tag)) {
    throw new Error("Tag isn't selected");
  }
  listaTags.value = listaTags.value.filter((sel) => sel !== tag);
  canAddTags.value = [...canAddTags.value, tag];
};
</script>

<template>
  <form @submit.prevent="createPost(content, listaTags)">
    <SearchBar :items="canAddTags" @addItem="addTag" />
    <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <ul id="selected-tags">
      <li v-for="(tag, ix) in listaTags" :key="ix">
        <button id="remove-tag-button" @click="removeTag(tag)" @submit.prevent="">{{ tag }} <img src="../../assets/images/x.svg" /></button>
      </li>
    </ul>
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

#selected-tags {
  list-style-type: none;
  padding-left: 0;
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

#remove-tag-button {
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: 0.3rem;
  padding: 0.2rem;
}

#remove-tag-button > img {
  width: 16px;
  height: 16px;
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
