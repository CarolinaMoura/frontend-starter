<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import HeaderNavbar from "../components/Header/HeaderNavbar.vue";
import PostListComponent from "../components/Post/PostListComponent.vue";
import ResourcesComponent from '../components/Resources/ResourcesComponent.vue';

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <HeaderNavbar />
  <main>
    <div>
    <PostListComponent />
  </div>
  <div>
    <ResourcesComponent />
  </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

main {
  background: url('../assets/images/background.svg');
  width: 100%;
  margin:auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
