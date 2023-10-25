<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import MessageVue from "../components/MessageVue.vue";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";
import router from "../router";

const { currentUsername } = storeToRefs(useUserStore());
const { deleteUser } = useUserStore();

const clickedDelete = ref(false);

async function delete_() {
  clickedDelete.value = true;
}

async function deleteForReal() {
  await deleteUser();
  void router.push({ name: "Login" });
}

async function chickenedOut() {
  clickedDelete.value = false;
}

async function goBackHome() {
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="column" id="settings-container">
    <span id="go-back" @click="goBackHome">Go back to home</span>
    <h1>Settings for {{ currentUsername }}</h1>
    <button class="button-error pure-button" @click="delete_">Delete User</button>
    <MessageVue :is-activated="clickedDelete" @toggle="chickenedOut">
      <p>Are you sure you want to delete your account? All your posts will be lost forever.</p>
      <div id="buttons">
        <button @click="deleteForReal">Yes</button>
        <button @click="chickenedOut">No</button>
      </div>
    </MessageVue>
    <UpdateUserForm />
  </main>
</template>

<style scoped>
#buttons {
  display: flex;
  justify-content: right;
  gap: 2rem;
}
#go-back {
  font-size: 1.2rem;
  margin-top: 3rem;
  margin-bottom: -1rem;
}
h1 {
  margin-top: 0;
}
#buttons button {
  cursor: pointer;
  padding: 1rem;
}

#go-back {
  margin-bottom: 2rem;
  border: none;
  background-color: transparent;
  color: rgb(58, 118, 239);
}
#go-back:hover {
  transition: 0.7s;
  cursor: pointer;
  text-decoration: underline;
}

#settings-container {
  background-color: white;
  width: 60%;
  margin: auto;
  margin-top: 10rem;
  padding-bottom: 2rem;
  border-radius: 15px;
}

@media (max-width: 800px) {
  #settings-container {
    width: 100%;
  }
}
</style>
