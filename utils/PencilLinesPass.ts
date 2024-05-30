import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass';
import { PencilLinesMaterial } from './PencilLinesMaterial';
import * as THREE from 'three';

export class PencilLinesPass extends Pass {
    fsQuad: FullScreenQuad;
    material: PencilLinesMaterial;
    normalBuffer: THREE.WebGLRenderTarget;
    normalMaterial: THREE.MeshNormalMaterial;

    scene: THREE.Scene;
    camera: THREE.Camera;
    meshRenderTarget: THREE.WebGLRenderTarget;

    constructor({
        width,
        height,
        scene,
        camera
    }: {
        width: number;
        height: number;
        scene: THREE.Scene;
        camera: THREE.Camera;
    }) {
        super();

        this.scene = scene;
        this.camera = camera;

        this.material = new PencilLinesMaterial();
        this.fsQuad = new FullScreenQuad(this.material);

        const normalBuffer = new THREE.WebGLRenderTarget(width, height);
        normalBuffer.texture.format = THREE.RGBAFormat;
        normalBuffer.texture.type = THREE.HalfFloatType;
        normalBuffer.texture.minFilter = THREE.NearestFilter;
        normalBuffer.texture.magFilter = THREE.NearestFilter;
        normalBuffer.texture.generateMipmaps = false;
        normalBuffer.stencilBuffer = false;
        this.normalBuffer = normalBuffer;

        this.normalMaterial = new THREE.MeshNormalMaterial();

        this.material.uniforms.uResolution.value = new THREE.Vector2(width, height);

        const loader = new THREE.TextureLoader();
        loader.load('/images/cloud-noise.png', (texture) => {
            this.material.uniforms.uTexture.value = texture;
        });

        // Create a separate render target for the mesh
        this.meshRenderTarget = new THREE.WebGLRenderTarget(width, height, {
            format: THREE.RGBAFormat,
            type: THREE.HalfFloatType,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            generateMipmaps: false,
            stencilBuffer: false
        });
    }

    dispose() {
        this.material.dispose();
        this.fsQuad.dispose();
        this.normalBuffer.dispose();
        this.meshRenderTarget.dispose();
    }

    render(
        renderer: THREE.WebGLRenderer,
        writeBuffer: THREE.WebGLRenderTarget,
        readBuffer: THREE.WebGLRenderTarget
    ) {
        // Render normal buffer
        renderer.setRenderTarget(this.normalBuffer);
        const overrideMaterialValue = this.scene.overrideMaterial;
        this.scene.overrideMaterial = this.normalMaterial;
        renderer.render(this.scene, this.camera);
        this.scene.overrideMaterial = overrideMaterialValue;

        this.material.uniforms.uNormals.value = this.normalBuffer.texture;

        // Render mesh to meshRenderTarget
        renderer.setRenderTarget(this.meshRenderTarget);
        renderer.clear(true, true, true);
        renderer.render(this.scene, this.camera);

        // Apply pencil lines effect
        this.material.uniforms.tDiffuse.value = this.meshRenderTarget.texture;

        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
            this.fsQuad.render(renderer);
        } else {
            renderer.setRenderTarget(writeBuffer);
            if (this.clear) renderer.clear();
            this.fsQuad.render(renderer);
        }
    }
}
