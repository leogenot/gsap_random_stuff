<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const container = document.querySelector('.container')
  const boxCanvas = document.querySelector('#box-canvas')

  let box = {
    params: {
      width: 27,
      widthLimits: [15, 70],
      length: 80,
      lengthLimits: [70, 120],
      depth: 45,
      depthLimits: [15, 70],
      thickness: 0.6,
      thicknessLimits: [0.1, 1],
      fluteFreq: 5,
      fluteFreqLimits: [3, 7],
      flapGap: 1,
      copyrightSize: [27, 10],
    },
    els: {
      group: new THREE.Group(),
      backHalf: {
        width: {
          top: new THREE.Mesh(),
          side: new THREE.Mesh(),
          bottom: new THREE.Mesh(),
        },
        length: {
          top: new THREE.Mesh(),
          side: new THREE.Mesh(),
          bottom: new THREE.Mesh(),
        },
      },
      frontHalf: {
        width: {
          top: new THREE.Mesh(),
          side: new THREE.Mesh(),
          bottom: new THREE.Mesh(),
        },
        length: {
          top: new THREE.Mesh(),
          side: new THREE.Mesh(),
          bottom: new THREE.Mesh(),
        },
      },
    },
    animated: {
      openingAngle: 0.02 * Math.PI,
      flapAngles: {
        backHalf: {
          width: {
            top: 0,
            bottom: 0,
          },
          length: {
            top: 0,
            bottom: 0,
          },
        },
        frontHalf: {
          width: {
            top: 0,
            bottom: 0,
          },
          length: {
            top: 0,
            bottom: 0,
          },
        },
      },
    },
  }

  // Globals
  let renderer, scene, camera, orbit, lightHolder, rayCaster, mouse, copyright

  // Run the app
  initScene()
  createControls()
  window.addEventListener('resize', updateSceneSize)

  // --------------------------------------------------
  // Three.js scene

  function initScene() {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: boxCanvas,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      10,
      1000
    )
    camera.position.set(40, 90, 110)

    rayCaster = new THREE.Raycaster()
    mouse = new THREE.Vector2(0, 0)

    updateSceneSize()

    scene.add(box.els.group)
    setGeometryHierarchy()

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    lightHolder = new THREE.Group()
    const topLight = new THREE.PointLight(0xffffff, 0.5)
    topLight.position.set(-30, 300, 0)
    lightHolder.add(topLight)
    const sideLight = new THREE.PointLight(0xffffff, 0.7)
    sideLight.position.set(50, 0, 150)
    lightHolder.add(sideLight)
    scene.add(lightHolder)

    scene.add(box.els.group)
    setGeometryHierarchy()

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x9c8d7a),
      side: THREE.DoubleSide,
    })
    box.els.group.traverse(c => {
      if (c.isMesh) c.material = material
    })

    orbit = new OrbitControls(camera, boxCanvas)
    orbit.enableZoom = false
    orbit.enablePan = false
    orbit.enableDamping = true
    orbit.autoRotate = true
    orbit.autoRotateSpeed = 0.25

    createCopyright()
    createBoxElements()
    createFoldingAnimation()
    createZooming()

    render()
  }

  function render() {
    orbit.update()
    lightHolder.quaternion.copy(camera.quaternion)
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  function updateSceneSize() {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  }

  // End of Three.js scene
  // --------------------------------------------------

  // --------------------------------------------------
  // Box geometries

  function setGeometryHierarchy() {
    box.els.group.add(
      box.els.frontHalf.width.side,
      box.els.frontHalf.length.side,
      box.els.backHalf.width.side,
      box.els.backHalf.length.side
    )
    box.els.frontHalf.width.side.add(
      box.els.frontHalf.width.top,
      box.els.frontHalf.width.bottom
    )
    box.els.frontHalf.length.side.add(
      box.els.frontHalf.length.top,
      box.els.frontHalf.length.bottom
    )
    box.els.backHalf.width.side.add(
      box.els.backHalf.width.top,
      box.els.backHalf.width.bottom
    )
    box.els.backHalf.length.side.add(
      box.els.backHalf.length.top,
      box.els.backHalf.length.bottom
    )
  }

  function createBoxElements() {
    for (let halfIdx = 0; halfIdx < 2; halfIdx++) {
      for (let sideIdx = 0; sideIdx < 2; sideIdx++) {
        const half = halfIdx ? 'frontHalf' : 'backHalf'
        const side = sideIdx ? 'width' : 'length'

        const sideWidth =
          side === 'width' ? box.params.width : box.params.length
        const flapWidth = sideWidth - 2 * box.params.flapGap
        const flapHeight = 0.5 * box.params.width - 0.75 * box.params.flapGap

        const sidePlaneGeometry = new THREE.PlaneGeometry(
          sideWidth,
          box.params.depth,
          Math.floor(5 * sideWidth),
          Math.floor(0.2 * box.params.depth)
        )
        const flapPlaneGeometry = new THREE.PlaneGeometry(
          flapWidth,
          flapHeight,
          Math.floor(5 * flapWidth),
          Math.floor(0.2 * flapHeight)
        )

        const sideGeometry = createSideGeometry(
          sidePlaneGeometry,
          [sideWidth, box.params.depth],
          [true, true, true, true],
          false
        )
        const topGeometry = createSideGeometry(
          flapPlaneGeometry,
          [flapWidth, flapHeight],
          [false, false, true, false],
          true
        )
        const bottomGeometry = createSideGeometry(
          flapPlaneGeometry,
          [flapWidth, flapHeight],
          [true, false, false, false],
          true
        )

        topGeometry.translate(0, 0.5 * flapHeight, 0)
        bottomGeometry.translate(0, -0.5 * flapHeight, 0)

        box.els[half][side].top.geometry = topGeometry
        box.els[half][side].side.geometry = sideGeometry
        box.els[half][side].bottom.geometry = bottomGeometry

        box.els[half][side].top.position.y = 0.5 * box.params.depth
        box.els[half][side].bottom.position.y = -0.5 * box.params.depth
      }
    }

    updatePanelsTransform()
  }

  function createSideGeometry(baseGeometry, size, folds, hasMiddleLayer) {
    const geometriesToMerge = []
    geometriesToMerge.push(
      getLayerGeometry(
        v =>
          -0.5 * box.params.thickness +
          0.01 * Math.sin(box.params.fluteFreq * v)
      )
    )
    geometriesToMerge.push(
      getLayerGeometry(
        v =>
          0.5 * box.params.thickness + 0.01 * Math.sin(box.params.fluteFreq * v)
      )
    )
    if (hasMiddleLayer) {
      geometriesToMerge.push(
        getLayerGeometry(
          v => 0.5 * box.params.thickness * Math.sin(box.params.fluteFreq * v)
        )
      )
    }

    function getLayerGeometry(offset) {
      const layerGeometry = baseGeometry.clone()
      const positionAttr = layerGeometry.attributes.position
      for (let i = 0; i < positionAttr.count; i++) {
        const x = positionAttr.getX(i)
        const y = positionAttr.getY(i)
        let z = positionAttr.getZ(i) + offset(x)
        z = applyFolds(x, y, z)
        positionAttr.setXYZ(i, x, y, z)
      }
      return layerGeometry
    }

    function applyFolds(x, y, z) {
      let modifier = (c, s) => 1 - Math.pow(c / (0.5 * s), 10)
      if ((x > 0 && folds[1]) || (x < 0 && folds[3])) {
        z *= modifier(x, size[0])
      }
      if ((y > 0 && folds[0]) || (y < 0 && folds[2])) {
        z *= modifier(y, size[1])
      }
      return z
    }

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(
      geometriesToMerge,
      false
    )
    mergedGeometry.computeVertexNormals()

    return mergedGeometry
  }

  // End of box geometries
  // --------------------------------------------------

  // --------------------------------------------------
  // Clickable copyright

  function createCopyright() {
    const canvas = document.createElement('canvas')
    canvas.width = box.params.copyrightSize[0] * 10
    canvas.height = box.params.copyrightSize[1] * 10
    const planeGeometry = new THREE.PlaneGeometry(
      box.params.copyrightSize[0],
      box.params.copyrightSize[1]
    )

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.width)
    ctx.fillStyle = '#000000'
    ctx.font = '22px sans-serif'
    ctx.textAlign = 'end'
    ctx.fillText('VANDSTROM', canvas.width - 30, 30)
    ctx.fillText('Filtering using proteins.', canvas.width - 30, 70)

    const texture = new THREE.CanvasTexture(canvas)
    copyright = new THREE.Mesh(
      planeGeometry,
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.5,
      })
    )

    scene.add(copyright)
    trackLinks()
  }

  function trackLinks() {
    document.addEventListener(
      'mousemove',
      e => {
        updateMousePosition(e.clientX, e.clientY)
        checkCopyrightIntersect()
      },
      false
    )
    document.addEventListener('click', e => {
      updateMousePosition(
        e.targetTouches ? e.targetTouches[0].pageX : e.clientX,
        e.targetTouches ? e.targetTouches[0].pageY : e.clientY
      )
    })

    function updateMousePosition(x, y) {
      mouse.x = (x / window.innerWidth) * 2 - 1
      mouse.y = (-y / window.innerHeight) * 2 + 1
    }
  }

  function checkCopyrightIntersect() {
    let linkHovered = 0
    rayCaster.setFromCamera(mouse, camera)
    const intersects = rayCaster.intersectObject(copyright)
    if (intersects.length) {
      document.body.style.cursor = 'pointer'
      linkHovered = intersects[0].uv.y > 0.5 ? 1 : 2
    } else {
      document.body.style.cursor = 'auto'
    }
    return linkHovered
  }

  // End of Clickable copyright
  // --------------------------------------------------

  // --------------------------------------------------
  // Animation

  function createFoldingAnimation() {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.page',
          start: '0% 0%',
          end: '100% 100%',
          scrub: true,
        },
        onUpdate: () => {
          updatePanelsTransform()
          checkCopyrightIntersect()
        },
      })
      .to(box.animated, {
        duration: 1,
        openingAngle: 0.5 * Math.PI,
        ease: 'power1.inOut',
      })
      .to(
        [
          box.animated.flapAngles.backHalf.width,
          box.animated.flapAngles.frontHalf.width,
        ],
        {
          duration: 0.6,
          bottom: 0.6 * Math.PI,
          ease: 'back.in(3)',
        },
        0.9
      )
      .to(
        box.animated.flapAngles.backHalf.length,
        {
          duration: 0.7,
          bottom: 0.5 * Math.PI,
          ease: 'back.in(2)',
        },
        1.1
      )
      .to(
        box.animated.flapAngles.frontHalf.length,
        {
          duration: 0.8,
          bottom: 0.49 * Math.PI,
          ease: 'back.in(3)',
        },
        1.4
      )
      .to(
        [
          box.animated.flapAngles.backHalf.width,
          box.animated.flapAngles.frontHalf.width,
        ],
        {
          duration: 0.6,
          top: 0.6 * Math.PI,
          ease: 'back.in(3)',
        },
        1.4
      )
      .to(
        box.animated.flapAngles.backHalf.length,
        {
          duration: 0.7,
          top: 0.5 * Math.PI,
          ease: 'back.in(3)',
        },
        1.7
      )
      .to(
        box.animated.flapAngles.frontHalf.length,
        {
          duration: 0.9,
          top: 0.49 * Math.PI,
          ease: 'back.in(4)',
        },
        1.8
      )
  }

  function updatePanelsTransform() {
    // place width-sides aside of length-sides (not animated)
    box.els.frontHalf.width.side.position.x = 0.5 * box.params.length
    box.els.backHalf.width.side.position.x = -0.5 * box.params.length

    // rotate width-sides from 0 to 90 deg
    box.els.frontHalf.width.side.rotation.y = box.animated.openingAngle
    box.els.backHalf.width.side.rotation.y = box.animated.openingAngle

    // move length-sides to keep the box centered
    const cos = Math.cos(box.animated.openingAngle) // animates from 1 to 0
    box.els.frontHalf.length.side.position.x = -0.5 * cos * box.params.width
    box.els.backHalf.length.side.position.x = 0.5 * cos * box.params.width

    // move length-sides to define box inner space
    const sin = Math.sin(box.animated.openingAngle) // animates from 0 to 1
    box.els.frontHalf.length.side.position.z = 0.5 * sin * box.params.width
    box.els.backHalf.length.side.position.z = -0.5 * sin * box.params.width

    box.els.frontHalf.width.top.rotation.x =
      -box.animated.flapAngles.frontHalf.width.top
    box.els.frontHalf.length.top.rotation.x =
      -box.animated.flapAngles.frontHalf.length.top
    box.els.frontHalf.width.bottom.rotation.x =
      box.animated.flapAngles.frontHalf.width.bottom
    box.els.frontHalf.length.bottom.rotation.x =
      box.animated.flapAngles.frontHalf.length.bottom

    box.els.backHalf.width.top.rotation.x =
      box.animated.flapAngles.backHalf.width.top
    box.els.backHalf.length.top.rotation.x =
      box.animated.flapAngles.backHalf.length.top
    box.els.backHalf.width.bottom.rotation.x =
      -box.animated.flapAngles.backHalf.width.bottom
    box.els.backHalf.length.bottom.rotation.x =
      -box.animated.flapAngles.backHalf.length.bottom

    copyright.position.copy(box.els.frontHalf.length.side.position)
    copyright.position.x +=
      0.5 * box.params.length - 0.5 * box.params.copyrightSize[0]
    copyright.position.y -=
      0.5 * (box.params.depth - box.params.copyrightSize[1])
    copyright.position.z += box.params.thickness
  }

  // End of animation
  // --------------------------------------------------

  // --------------------------------------------------
  // Manual zoom (buttons only since the scroll is used
  // by folding animation)

  function createZooming() {
    const zoomInBtn = document.querySelector('#zoom-in')
    const zoomOutBtn = document.querySelector('#zoom-out')

    let zoomLevel = 1
    const limits = [0.4, 2]

    zoomInBtn.addEventListener('click', () => {
      zoomLevel *= 1.3
      applyZoomLimits()
    })
    zoomOutBtn.addEventListener('click', () => {
      zoomLevel *= 0.75
      applyZoomLimits()
    })

    function applyZoomLimits() {
      if (zoomLevel > limits[1]) {
        zoomLevel = limits[1]
        zoomInBtn.classList.add('disabled')
      } else if (zoomLevel < limits[0]) {
        zoomLevel = limits[0]
        zoomOutBtn.classList.add('disabled')
      } else {
        zoomInBtn.classList.remove('disabled')
        zoomOutBtn.classList.remove('disabled')
      }
      gsap.to(camera, {
        duration: 0.2,
        zoom: zoomLevel,
        onUpdate: () => {
          camera.updateProjectionMatrix()
        },
      })
    }
  }

  // End of Manual zoom
  // --------------------------------------------------

  // --------------------------------------------------
  // Range sliders for box parameters

  function createControls() {
    const gui = new GUI()
    gui
      .add(
        box.params,
        'width',
        box.params.widthLimits[0],
        box.params.widthLimits[1]
      )
      .step(1)
      .onChange(() => {
        createBoxElements()
        updatePanelsTransform()
      })
    gui
      .add(
        box.params,
        'length',
        box.params.lengthLimits[0],
        box.params.lengthLimits[1]
      )
      .step(1)
      .onChange(() => {
        createBoxElements()
        updatePanelsTransform()
      })
    gui
      .add(
        box.params,
        'depth',
        box.params.depthLimits[0],
        box.params.depthLimits[1]
      )
      .step(1)
      .onChange(() => {
        createBoxElements()
        updatePanelsTransform()
      })
    gui
      .add(
        box.params,
        'fluteFreq',
        box.params.fluteFreqLimits[0],
        box.params.fluteFreqLimits[1]
      )
      .step(1)
      .onChange(() => {
        createBoxElements()
      })
      .name('flute')
    gui
      .add(
        box.params,
        'thickness',
        box.params.thicknessLimits[0],
        box.params.thicknessLimits[1]
      )
      .step(0.05)
      .onChange(() => {
        createBoxElements()
      })
  }

  // End Range sliders for box parameters
  // --------------------------------------------------
})
</script>

<template>
  <main class="three-scroll">
    <div class="frame">
      <div class="frame__title">
        <h1 class="frame__title-main">
          On-Scroll Folding Cardboard Box with Three.js & GSAP
        </h1>
      </div>
    </div>
    <div class="content">
      <div class="page">
        <div class="container">
          <canvas id="box-canvas"></canvas>
          <div class="ui-controls">
            <button
              class="unbutton ui-controls__button"
              id="zoom-in"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              class="unbutton ui-controls__button"
              id="zoom-out"
              aria-label="Zoom out"
            >
              -
            </button>
            <div>Scroll to animate</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="postcss" scoped>
*,
*::after,
*::before {
  box-sizing: border-box;
}

:root {
  font-size: 12px;
  --color-text: #111;
  --color-bg: #e7e5dd;
  --color-link: #82725c;
  --color-link-hover: #000;
  --padding-page: 1.5rem;
  touch-action: pan-x pan-y;
  text-transform: uppercase;
}

body {
  margin: 0;
  color: var(--color-text);
  background-color: var(--color-bg);
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Page Loader */
.js .loading::before,
.js .loading::after {
  content: '';
  position: fixed;
  z-index: 1000;
}

.js .loading::before {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-bg);
}

.js .loading::after {
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  margin: -30px 0 0 -30px;
  border-radius: 50%;
  opacity: 0.4;
  background: var(--color-link);
  animation: loaderAnim 0.7s linear infinite alternate forwards;
}

@keyframes loaderAnim {
  to {
    opacity: 1;
    transform: scale3d(0.5, 0.5, 1);
  }
}

a {
  text-decoration: none;
  color: var(--color-link);
  outline: none;
  cursor: pointer;
}

a:hover {
  color: var(--color-link-hover);
  outline: none;
}

/* Better focus styles from https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible */
a:focus {
  /* Provide a fallback style for browsers
	 that don't support :focus-visible */
  outline: none;
  background: lightgrey;
}

a:focus:not(:focus-visible) {
  /* Remove the focus indicator on mouse-focus for browsers
	 that do support :focus-visible */
  background: transparent;
}

a:focus-visible {
  /* Draw a very noticeable focus style for
	 keyboard-focus on browsers that do support
	 :focus-visible */
  outline: 2px solid red;
  background: transparent;
}

.unbutton {
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  cursor: pointer;
}

.unbutton:focus {
  outline: none;
}

.frame {
  position: fixed;
  color: var(--color-title);
  padding: var(--padding-page);
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto;
  grid-template-areas: 'title prev sponsor';
  justify-content: start;
  margin-bottom: 3rem;
  grid-gap: 2rem;
  z-index: 1000;
}

.frame a:not(.frame__title-back) {
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  display: inline-block;
}

.frame a:not(.frame__title-back)::before {
  content: '';
  height: 1px;
  width: 100%;
  background: currentColor;
  position: absolute;
  top: 90%;
  transition: transform 0.3s;
  transform-origin: 0% 50%;
}

.frame a:not(.frame__title-back):hover::before {
  transform: scaleX(0);
  transform-origin: 100% 50%;
}

.frame__title {
  grid-area: title;
  display: flex;
  align-items: start;
}

.frame__title-main {
  font-size: 1rem;
  margin: 0;
  font-weight: normal;
  max-width: 32ch;
}

.frame__title-back {
  position: relative;
  display: flex;
  align-items: flex-end;
}

.frame__title-back span {
  display: none;
}

.frame__title-back svg {
  fill: currentColor;
}

.frame__prev {
  grid-area: prev;
  align-self: start;
}

.page {
  width: 100%;
  height: 300vh;
}

.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}

.container canvas {
  touch-action: auto !important; /* overwriting threejs */
}

.ui-controls {
  position: absolute;
  bottom: 0;
  right: 0;
  user-select: none;
  text-align: end;
  min-width: 200px;
  padding: var(--padding-page);
}

.ui-controls__button {
  cursor: pointer;
  display: inline-block;
  text-align: center;
  font-size: 1.15rem;
  border: 1px solid #000;
  padding: 0.65rem 1rem;
  line-height: 1;
  cursor: pointer;
  margin: 0 0 1rem 0.5rem;
}

.ui-controls__button.disabled {
  pointer-events: none;
  cursor: auto;
  opacity: 0.3;
}

.lil-gui {
  --background-color: #f6f6f6;
  --text-color: #3d3d3d;
  --title-background-color: #efefef;
  --title-text-color: #3d3d3d;
  --widget-color: #eaeaea;
  --hover-color: #f0f0f0;
  --focus-color: #fafafa;
  --number-color: #07aacf;
  --string-color: #8da300;
}

@media screen and (min-width: 53em) {
}
</style>
