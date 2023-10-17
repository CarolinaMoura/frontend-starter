<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "../../stores/user";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const profilePic = ref("");
const { currentUsername } = storeToRefs(useUserStore());

const getProfilePicture = async () => {
  const user = await fetchy(`api/users/${currentUsername.value}`, "GET");
  profilePic.value = user.picture;
};

onBeforeMount(async () => {
  await getProfilePicture();
});
</script>
<template>
  <div id="personal-data">
    <img :src="profilePic" />
    <h1>{{ currentUsername }}</h1>
  </div>
</template>

<style>
#personal-data > img {
  border-radius: 100%;
}
#personal-data {
  display: flex;
  margin: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-around;
}
</style>
