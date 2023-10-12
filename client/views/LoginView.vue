<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
</script>

<template>
  <main class="row">
    <!-- <h1>Please login or register!</h1> -->
    <div id="initial-div">
      <h1>ADDapp</h1>
      <LoginForm />
      <!-- <RegisterForm /> -->
    </div>
  </main>
</template>

<style>
.row {
  font-size: 16px;
  width: 56.25rem;
  margin: auto;
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

h1 {
  margin: auto;
  text-align: center;
}

#initial-div {
  background-color: white;
  padding: 10px;
  border: 1px solid white;
  border-radius: 30px;
  margin: 10rem auto;
  padding-top: 4rem;
  padding-bottom: 4rem;
}
</style>