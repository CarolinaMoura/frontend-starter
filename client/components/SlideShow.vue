<script setup lang="ts">
import { Transition, TransitionGroup, onBeforeMount, ref, watch } from "vue";
import { fetchy } from "../utils/fetchy";
import slicing from "../utils/slicing";

interface IHighlight {
  count: number;
  target: string;
}

interface IPost {
  author?: string;
  content: string;
  thumbnail: string;
}

/*
Slider based on --> http://www.storytrail.co
*/
const maxSlideDisplay = 5;
const props = defineProps({ date: String });
const data = ref<string>(props.date ?? "");
const slides = ref<number>(5);
const slidesArray = ref<IPost[]>([]);
const active = ref<number>(1);
const loading = ref(true);

const loadSlideShow = async (date: string) => {
  const posts = await fetchy("api/highlights", "GET", {
    query: {
      date,
    },
  });
  const withoutPicture: { content: string; author: string }[] = slicing(posts, 0, maxSlideDisplay);
  slidesArray.value = await Promise.all(
    withoutPicture.map(async (post) => {
      const thumbnail = (await fetchy(`api/thumbnails/${post.content}`, "GET")) as string;
      const prefix = "data:image/png;base64,";
      return { ...post, thumbnail: prefix + thumbnail };
    }),
  );
  const qttSlides = Math.min(5, slidesArray.value.length);
  slides.value = qttSlides;
};

watch(data, async (newDate) => {
  loading.value = true;
  await loadSlideShow(newDate);
  loading.value = false;
});

const move = (amount: number) => {
  let newActive;
  const newIndex = active.value + amount;
  if (newIndex > slides.value) newActive = 1;
  if (newIndex === 0) newActive = slides.value;
  active.value = newActive || newIndex;
};
const jump = (index: number) => {
  active.value = index;
};

onBeforeMount(() => {
  loading.value = true;
  loadSlideShow(data.value);
  loading.value = false;
});
</script>
<template>
  <div id="app">
    <div class="slides">
      <TransitionGroup v-if="!loading" name="slide" mode="out-in">
        <Transition name="slide-fade" enter-class="slide-in" leave-class="slide-out">
          <div class="slide-content" v-if="slidesArray.length > 0" :key="active">
            <div class="name">
              <!-- <h3>{{ slidesArray[active - 1].author }}</h3> -->
              <h3>says</h3>
              <p>{{ slidesArray[active - 1].content }}</p>
            </div>
            <img :src="slidesArray[active - 1].thumbnail" width="200" height="200" />
          </div>
        </Transition>
      </TransitionGroup>
    </div>
    <span class="prev" @click="move(-1)">
      <i class="fa fa-chevron-left" aria-hidden="true"></i>
    </span>
    <span class="next" @click="move(1)">
      <i class="fa fa-chevron-right" aria-hidden="true"></i>
    </span>
    <ul class="dots">
      <li v-for="(dot, index) in slides" :class="{ active: index + 1 === active }" @click="jump(index)"></li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
$primary: #157f03;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  height: 100%;
  width: 100%;
  position: relative;
}

.slide-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5rem;
}

.prev,
.next {
  position: absolute;
  top: 50%;
  width: 50px;
  height: 50px;
  border: 2px solid $primary;
  color: $primary;
  border-radius: 50%;
  cursor: pointer;
  line-height: 48px;
  text-align: center;
  text-indent: -2px;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    background: $primary;
    color: #fff;
    transform: scale(1.2);
  }

  &:active {
    transform: translate(0, 3px) scale(1.2);
  }
}

.next {
  right: 0;
  margin-left: auto;
  margin-right: 25px;
  text-indent: 2px;
}

.dots {
  display: block;
  width: 100%;
  text-align: center;

  li {
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: $primary;
    opacity: 0.2;
    display: inline-block;
    margin: 0 3px;
    cursor: pointer;
    transition:
      opacity 0.4s ease-in-out,
      width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &.active {
      width: 22px;
      opacity: 1;
    }
  }
}

.slides {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-weight: bold;

  @media (min-width: 600px) {
    font-size: 0.7rem;
  }

  @media (min-width: 900px) {
    font-size: 1rem;
  }

  .animated {
    transition: all 400ms;
    position: absolute;
    transform: translate(-50%, -50%);
  }

  .slide-in {
    opacity: 0;
    transform: translate(-40%, -50%);
  }

  .slide-in-active {
    transition-delay: 150ms;
  }

  .slide-out {
    opacity: 1;
  }

  .slide-out-active {
    opacity: 0;
    transform: translate(-60%, -50%);
  }
}

.buttons {
  position: absolute;
  top: 10px;
  left: 10px;
}

button {
  padding: 10px;
  outline: none;
  border: none;
  -webkit-appearance: none;
  background: $primary;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;

  &:disabled {
    opacity: 0.2;
    cursor: no-drop;
  }
}

.slide-content {
  min-height: 30vh;
}
</style>
