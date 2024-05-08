import { PerspectiveCamera, Scene, WebGLRenderer, SpotLight } from 'three';
import { disposeObject } from '@/utils/disposeUtils';
export function useThree() {
    function initThree(canvasMountId) {
        const canvas = document.getElementById(canvasMountId);
        const camera = new PerspectiveCamera(75, 200 / 200, 0.1, 1000);
        camera.position.set(1, 0, 1.7);
        camera.lookAt(0, 0, 0);
        const spotLight = new SpotLight('white', 0.2);
        spotLight.position.set(0.1, -1, 3);
        const scene = new Scene();
        scene.add(spotLight);
        const renderer = new WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
        });
        return { scene, camera, renderer };
    }
    function cleanUpThree(scene, renderer) {
        disposeObject(scene);
        renderer.dispose();
    }
    return {
        initThree,
        cleanUpThree,
    };
}