<script setup>
import { gsap } from 'gsap/all'
onMounted(() => {
  const imagesContainer = document.querySelector('.images')
  const preview = document.querySelector('.preview')
  const minimap = document.querySelector('.minimap')

  function getElementTop(element) {
    let top = 0
    while (element) {
      top += element.offsetTop
      element = element.offsetParent
    }
    return top
  }

  const imagesStart = getElementTop(imagesContainer)
  const imagesEnd = imagesStart + imagesContainer.offsetHeight
  const viewportHeight = window.innerHeight
  const previewHeight = preview.offsetHeight
  const previewMaxTranslate = (minimap.offsetHeight - previewHeight) * 2.84

  function handleScroll() {
    const scrollPosition = window.scrollY
    const scrollRange = imagesEnd - imagesStart - viewportHeight
    const previewScrollRange = Math.min(previewMaxTranslate, scrollRange)

    if (
      scrollPosition >= imagesStart &&
      scrollPosition <= imagesEnd - viewportHeight
    ) {
      let scrollFraction = (scrollPosition - imagesStart) / scrollRange
      let previewTranslateY = scrollFraction * previewScrollRange
      preview.style.transform = `translateX(-50%) translateY(${previewTranslateY}px)`
    } else if (scrollPosition < imagesStart) {
      preview.style.transform = 'translateX(-50%) translateY(0px)'
    } else {
      preview.style.transform = `translateX(-50%) translateY(${previewMaxTranslate}px)`
    }
  }

  window.addEventListener('scroll', handleScroll)

  const togglePoint = window.innerHeight * 4
  const wrapper = document.querySelector('.wrapper')

  function checkScroll() {
    if (window.scrollY >= togglePoint) {
      wrapper.classList.add('dark-theme')
    } else {
      wrapper.classList.remove('dark-theme')
    }
  }

  window.addEventListener('scroll', checkScroll)
})
</script>

<template>
  <div class="minimap-gallery">
    <div class="gallery">
      <div class="minimap">
        <div class="preview">
          <div class="item-preview" v-for="item in 10" :key="item">
            <img
              src="https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
        </div>
        <div class="active-img-indicator"></div>
      </div>

      <div class="images">
        <div class="item" v-for="item in 10" :key="item">
          <div class="item-img">
            <img
              src="https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div class="item-copy">
            <p>img_01.jpg</p>
            <p>01</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <h1>
        Explore a world where every horizon promises new wonders and each
        journey is a tapestry of breathtaking landscapes and timeless moments.
        With us, your travel transcends into a utopian adventure.
      </h1>
      <div class="hero-img">
        <img src="./assets/hero.jpg" alt="" />
      </div>
      <h1>
        Discover the charm of hidden gems and cultural treasures on a voyage
        that delves deep into the heart of the world's most elusive
        destinations. Join us to transform the ordinary into the extraordinary.
      </h1>
      <h1>
        Venture beyond the conventional with our expertly curated expeditions
        that connect you with the pulse of distant locales through immersive
        experiences and local insights. Embark on a journey unlike any other.
      </h1>
    </div>
  </div>
</template>

<style lang="postcss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: 'PP Neue Montreal';
}

.wrapper {
  width: 100%;
  height: 100%;
  background-color: #000;
  transition: 0.5s background-color;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

a,
p {
  text-decoration: none;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  transition: 0.5s color;
}

h1 {
  font-size: 50px;
  font-weight: 500;
  margin-bottom: 1em;
  transition: 0.5s color;
}

nav {
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.5em;
  z-index: 2;
}

.container {
  width: 100%;
  height: 100%;
  padding: 5em 2.5em;
}

.gallery {
  position: relative;
  width: 100%;
  display: flex;
  z-index: 0;
}

.minimap {
  position: sticky;
  top: 0;
  width: 25%;
  height: 100vh;
  padding-top: 300px;
  overflow: hidden;
  background-color: #000;
  transition: 0.5s background-color;
}

.active-img-indicator {
  position: absolute;
  top: 300px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 125px;
  border: 1.5px solid #fff;
  border-radius: 4px;
  mix-blend-mode: difference;
  z-index: 2;
}

.preview {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 1254px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.images {
  position: relative;
  top: 0;
  width: 75%;
}

.item {
  position: relative;
  width: 500px;
  height: 600px;
  overflow: hidden;
  margin: 50px auto;
}

.item-img {
  width: 500px;
  height: 550px;
}

.item-copy {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  text-transform: uppercase;
}

.item-preview {
  position: relative;
  width: 100px;
  height: 125px;
  padding: 10px;
  overflow: hidden;
}

.hero-img {
  margin-bottom: 2em;
}

.wrapper.dark-theme,
.wrapper.wrapper.dark-theme .minimap {
  background-color: #fff;
}

.wrapper.dark-theme a,
.wrapper.dark-theme p,
.wrapper.dark-theme h1 {
  color: #000;
}

@media (max-width: 900px) {
  .item {
    width: 400px;
    height: 500px;
  }
}
</style>
