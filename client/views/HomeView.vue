<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import HeaderNavbar from "../components/Header/HeaderNavbar.vue";
import PostListComponent from "../components/Post/PostListComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <HeaderNavbar />
  <main>
    <section>
      <!-- <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1> -->
    </section>
    <PostListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

main {
  background-color: white;
  width: 60%;
  margin:auto;
  min-height: 100vh;
}
</style>
