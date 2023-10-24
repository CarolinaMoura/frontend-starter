<script setup lang="ts">
import router from "@/router";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";

const { logoutUser } = useUserStore();

const profilePic = ref("");
const { currentUsername } = storeToRefs(useUserStore());

const getProfilePicture = async () => {
  const user = await fetchy(`api/users/${currentUsername.value}`, "GET");
  profilePic.value = user.picture;
};

async function logout() {
  await logoutUser();
  void router.push({ name: "Login" });
}

onBeforeMount(async () => {
  await getProfilePicture();
});
</script>
<template>
  <div id="personal-data">
    <img :src="profilePic" />
    <h1>{{ currentUsername }}</h1>
    <button class="pure-button pure-button-primary" @click="logout">Logout</button>
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
