<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import HeaderNavbar from "../components/Header/HeaderNavbar.vue";
import MiddleFloater from "../components/MiddleFloater.vue";
import PostListComponent from "../components/Post/PostListComponent.vue";
import LeftFloater from "../components/ProfileFloater/LeftFloater.vue";
import RecapComponent from "../components/RecapComponent.vue";
import ResourcesComponent from "../components/Resources/ResourcesComponent.vue";
import { fetchy } from "../utils/fetchy";

const currentTab = ref("Feed");
const tags = ref("");
const mostra = ref(false);

const changeTab = (tab: string) => {
  currentTab.value = tab;
};

const getTags = async () => {
  mostra.value = false;
  tags.value = await fetchy("api/tags", "GET");
  mostra.value = true;
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

window.onscroll = function () {
  var button = document.getElementById("scrollToTopButton") as HTMLButtonElement;
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
};

onBeforeMount(async () => {
  await getTags();
});
</script>

<template>
  <HeaderNavbar />
  <main>
    <div id="profile" class="floater"><LeftFloater /></div>
    <div id="main-feed">
      <MiddleFloater @changeTab="changeTab">
        <div id="main-flow">
          <PostListComponent :tags="tags" v-if="currentTab === 'Feed' && mostra" />
          <RecapComponent v-if="currentTab === 'Recap'" />
        </div>
      </MiddleFloater>
    </div>
    <div id="resources" class="floater">
      <ResourcesComponent @refreshTags="getTags" />
    </div>
  </main>
  <button id="scrollToTopButton" @click="scrollToTop">Top</button>
</template>

<style scoped>
h1 {
  text-align: center;
}

#resources,
#profile,
#main-feed {
  margin-top: 1.5rem;
  background-color: white;
  border-radius: 15px;
}

#main-feed {
  width: 60%;
  background-color: transparent;
}

.floater {
  width: 15%;
  max-height: 30vh;
}

#main-flow {
  min-height: 100vh;
  background-color: white;
  border-radius: 15px;
}

#scrollToTopButton {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 15px;
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
