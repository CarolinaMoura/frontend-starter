<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { loginUser, updateSession } = useUserStore();

async function login() {
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form pure-form-aligned center" @submit.prevent="login" id="login-form">
    <!-- <h3>Login</h3> -->
    <fieldset id="login">
      <div class="pure-control-group center">
        <!-- <label for="aligned-name">Username</label> -->
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group center">
        <!-- <label for="aligned-password">Password</label> -->
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="pure-controls center">
        <button type="submit" class="pure-button pure-button-primary submit">Submit</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}

.center {
  display: flex;
  justify-content: center;
}

.pure-control-group input{
  font-size: 16px;
  min-width: 20.625rem;
  padding: 0.875rem 1rem;
  border-radius: 6px;
}

.submit {
  font-size: 16px;
  min-width: 20.625rem;
  padding: 0.875rem 1rem;
  border-radius: 6px;
}

.pure-control-group div {
  font-size: 16px;
  min-width: 20.625;
}

.pure-control-group label {
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pure-controls.center {
  margin: 1.5rem auto 0.5rem auto;
}

</style>
