<script setup lang="ts">
import HeaderNavbar from "../components/Header/HeaderNavbar.vue";
import PostListComponent from "../components/Post/PostListComponent.vue";
import LeftFloater from "../components/ProfileFloater/LeftFloater.vue";
import ResourcesComponent from "../components/Resources/ResourcesComponent.vue";
</script>

<template>
  <HeaderNavbar />
  <main>
    <div id="profile" class="floater"><LeftFloater /></div>
    <div id="main-feed">
      <PostListComponent />
    </div>
    <div id="resources" class="floater">
      <ResourcesComponent />
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

#resources,
#profile,
#main-feed {
  border-radius: 15px;
  margin-top: 1.5rem;
  background-color: white;
}

#main-feed {
  width: 60%;
}

.floater {
  width: 15%;
  max-height: 30vh;
}

main {
  background: url("../assets/images/background.svg");
  width: 100%;
  margin: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

@media (max-width: 900px) {
  #main-feed {
    width: 100%;
  }
  .floater {
    display: none;
  }
}
</style>
