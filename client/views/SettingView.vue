<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import MessageVue from "../components/MessageVue.vue";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";
import router from "../router";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

const clickedDelete = ref(false);

async function delete_() {
  clickedDelete.value = true;
}

async function deleteForReal() {
  await deleteUser();
  void router.push({ name: "Login" });
}
</script>

<template>
  <main class="column">
    <h1>Settings for {{ currentUsername }}</h1>
    <button class="button-error pure-button" @click="delete_">Delete User</button>
    <MessageVue :is-activated="clickedDelete">
      <p>Are you sure you want to delete your account? All your posts will be lost.</p>
      <button @click="deleteForReal">Yes</button>
    </MessageVue>
    <UpdateUserForm />
  </main>
</template>
