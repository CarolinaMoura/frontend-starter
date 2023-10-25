<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useToastStore } from "../../stores/toast";
import { useUserStore } from "../../stores/user";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());
</script>
<template>
  <header>
    <nav>
      <div class="title">
        <img src="../../assets/images/logo.svg" id="logo" />
        <RouterLink :to="{ name: 'Home' }"> </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink class="option" :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home <img src="../../assets/images/home.svg" /> </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink class="option" :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Advanced <img src="../../assets/images/settings.svg" /> </RouterLink>
        </li>
        <li v-else>
          <RouterLink class="option" :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
</template>

<style scoped>
@import "../../assets/toast.css";

nav {
  padding: 1em 2em;
  background-color: #3c9f2a;
  display: flex;
  align-items: center;
}

.option {
  display: flex;
  align-items: center;
}

.option > img {
  padding: 0.6rem;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.underline {
  text-decoration: underline;
}

#logo {
  height: 5em;
}
</style>
