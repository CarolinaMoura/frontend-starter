<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import LoaderAnimated from "../LoaderAnimated.vue";
const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
const profilePic = ref("");
const thumbnail = ref("");
const tags = ref("");
const prefix = ref("data:image/png;base64,");

const deletePost = async () => {
  try {
    await fetchy(`api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

const getProfilePicture = async () => {
  const user = await fetchy(`api/users/${props.post.author}`, "GET");
  profilePic.value = user.picture;
};

const getThumbnail = async () => {
  const imageSrc = await fetchy(`api/thumbnails/${encodeURIComponent(props.post.content)}`, "GET");
  thumbnail.value = imageSrc;
};

const getTags = async () => {
  const attachments = await fetchy(`api/tags/attachments/${props.post._id}`, "GET");
  tags.value = attachments.map((att: { tagName: string }) => {
    return att.tagName.startsWith("#") ? att.tagName : "#" + att.tagName;
  });
};

onBeforeMount(async () => {
  await getProfilePicture();
  await getTags();
  await getThumbnail();
});
</script>

<template>
  <section id="identifiers">
    <img :src="profilePic" class="pfp" />
    <p class="author">{{ props.post.author }}</p>
  </section>
  <section id="content-section">
    <div id="thumbnail">
      <img v-if="thumbnail !== ''" :src="prefix + thumbnail" />
      <div v-else style="margin: 1rem; display: flex; justify-content: center; align-items: center; flex-direction: column">
        <p style="color: #157f03; text-align: center">Don't worry! This will take only a few seconds...</p>
        <LoaderAnimated />
      </div>
    </div>
    <p>{{ props.post.content }}</p>
  </section>
  <div class="grande-base">
    <div class="tags">
      <button v-for="tag in tags" :key="tag" class="tag-button">{{ tag }}</button>
    </div>
    <div class="base">
      <menu v-if="props.post.author == currentUsername">
        <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
        <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
      </menu>
      <article class="timestamp">
        <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
  flex: 2;
}

.tags {
  margin-bottom: 1.5rem;
}

.tag-button {
  padding: 0.3rem;
  border: 1px solid black;
  border-radius: 10px;
}

#thumbnail {
  border: 1px solid black;
  width: 10rem;
  height: 10rem;
  flex: 1;
  float: right;
}

#thumbnail > img {
  width: 100%;
  height: 100%;
}

#content-section {
  padding: 4rem;
  padding-top: 2rem;
}

#identifiers {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 1000px) {
  #thumbnail {
    float: none;
    margin: auto;
    margin-bottom: 1.5rem;
  }
}

.pfp {
  width: 3rem;
  height: 3rem;
  border-radius: 100%;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
