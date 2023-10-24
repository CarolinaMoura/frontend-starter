<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchPostForm from "./SearchPostForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchTag = ref("");
const wholeKey = ref("");

async function getPosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("api/posts", "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  posts.value = postResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

const getPostsByTags = async (tag: string) => {
  try {
    const results = await fetchy(`api/tags/${tag}`, "GET");
    posts.value = results;
  } catch {
    posts.value = [];
  }
  searchTag.value = tag;
};

const noSearch = async () => {
  loaded.value = false;
  searchTag.value = "";
  await getPosts();
  loaded.value = true;
};

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <div :key="wholeKey">
    <div id="upper-post-list">
      <button v-if="searchTag" id="go-back-button" @click="noSearch">Get back</button>
      <div id="search-div">
        <h2 v-if="searchTag">Posts with the tag "{{ searchTag }}":</h2>
        <SearchPostForm @getPostsByTags="getPostsByTags" @getBack="noSearch" />
      </div>
    </div>
    <section v-if="isLoggedIn">
      <CreatePostForm @refreshPosts="getPosts" />
    </section>
    <p v-if="searchTag">The result of your search:</p>
    <section class="posts" v-if="loaded && posts.length !== 0">
      <article v-for="post in posts" :key="post._id">
        <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
        <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      </article>
    </section>
    <p v-else-if="loaded">No posts found</p>
    <p v-else>Loading...</p>
  </div>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

#go-back-button {
  border-radius: 10px;
  background-color: rgba(250, 250, 250);
  height: 5rem;
  cursor: pointer;
}

#search-div {
  display: flex;
  justify-content: center;
  align-items: center;
}

#upper-post-list {
  display: flex;
  padding: 3rem;
  padding-bottom: 0;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}
</style>
