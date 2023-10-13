<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
import { ref } from "vue";

const isRegister = ref(false);
</script>

<template>
  <main class="row">
    <!-- <h1>Please login or register!</h1> -->
    <div id="container">
      <button @click="isRegister = !isRegister" id="toggle-registration">
        <span v-if="isRegister">Already have an account?</span>
        <span v-else>Don't have an account yet?</span>
      </button>
      <div id="initial-div">
        <div id="name-column">
          <h1>ADDapp</h1>
          <p>Navigating life with clarity and confidence</p>
        </div>
        <RegisterForm v-if="isRegister" />
        <LoginForm v-else />
        <!-- <RegisterForm /> -->
      </div>
    </div>
  </main>
</template>

<style>
.row {
  font-size: 16px;
  width: 45%;
  margin: auto;
  text-align: center;
}

#name-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  flex-wrap: wrap;
}
#toggle-registration {
  margin-bottom: 2rem;
  border: none;
  background-color: transparent;
  color: rgb(58, 118, 239);
}
#toggle-registration:hover {
  transition: 0.7s;
  cursor: pointer;
  text-decoration: underline;
}

#initial-div {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
}

#initial-div > * {
  flex-grow: 1;
  flex-basis: 1;
}

@media (max-width: 800px) {
  .row {
    width: 100%;
  }
}

h1 {
  text-align: center;
}

#container {
  background-color: white;
  padding: 10px;
  border: 1px solid white;
  border-radius: 30px;
  margin: 10rem auto;
  padding-top: 2rem;
  padding-bottom: rem;
}
</style>
