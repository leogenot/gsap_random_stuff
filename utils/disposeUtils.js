import { BufferGeometry, Material, Texture, Mesh, Group, Object3D } from 'three';
export function disposeObject(objectD) {
    if (!object) return;
    const geometries = new Map();
    const materials = new Map();
    const textures = new Map();
    object.traverse((object) => {
        const mesh = object;
        if (mesh.isMesh) {
            const geometry = mesh.geometry;
            if (geometry) {
                geometries.set(geometry.uuid, geometry);
            }
            const material = mesh.material;
            if (material) {
                materials.set(material.uuid, material);
                for (const key in material) {
                    const texture = material[key];
                    if (texture && texture.isTexture) {
                        textures.set(texture.uuid, texture);
                    }
                }
            }
        }
    });
    for (const entry of textures) {
        entry[1].dispose();
    }
    for (const entry of materials) {
        entry[1].dispose();
    }
    for (const entry of geometries) {
        entry[1].dispose();
    }
}