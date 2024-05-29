// Three JS
import { gsap } from 'gsap'
import * as THREE from 'three'
import { vertexShader } from './vertexShader'
import { fragmentShader } from './fragmentShader'

function init(mesh) {
    createPrimitive(mesh);
    animation();
}


var shapeGroupPosition = { x: 0, y: 0, z: 0 };
var shapeGroupScale = { x: 1, y: 1, z: 1 };

//--------------------------------------------------------------------
var _primitive, mat;
var shapeGroup = new THREE.Group();
var start = Date.now();

//--------------------------------------------------------------------
class primitiveElement {
    constructor(mesh) {
        this.mesh = new THREE.Object3D();
        mat = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                time: {
                    type: "f",
                    value: 0.1
                },
                pointscale: {
                    type: "f",
                    value: 0.2
                },
                decay: {
                    type: "f",
                    value: 0.3
                },
                size: {
                    type: "f",
                    value: 0.3
                },
                displace: {
                    type: "f",
                    value: 0.3
                },
                complex: {
                    type: "f",
                    value: 0.0
                },
                waves: {
                    type: "f",
                    value: 0.10
                },
                eqcolor: {
                    type: "f",
                    value: 0.0
                },
                rcolor: {
                    type: "f",
                    value: 0.0
                },
                gcolor: {
                    type: "f",
                    value: 0.0
                },
                bcolor: {
                    type: "f",
                    value: 0.0
                },
                fragment: {
                    type: "i",
                    value: true
                },
                redhell: {
                    type: "i",
                    value: true
                }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
        //---
        var geo = new THREE.IcosahedronGeometry(2, 32);
        var wir = new THREE.IcosahedronGeometry(2.3, 32);
        this.shape = new THREE.Mesh(geo, mat);
        this.point = new THREE.Points(wir, mat);
        //---
        shapeGroup.add(this.point);
        shapeGroup.add(this.shape);
        mesh.add(shapeGroup);
    }

    dispose() {
        // Dispose of mesh and material
        this.shape.geometry.dispose();
        this.shape.material.dispose();
        this.point.geometry.dispose();
        this.point.material.dispose();

        // Remove mesh from parent
        shapeGroup.remove(this.point);
        shapeGroup.remove(this.shape);
    }
}
function createPrimitive(mesh) {
    if (_primitive) {
        _primitive.dispose();
    }
    _primitive = new primitiveElement(mesh);
}

var options = {
    perlin: {
        speed: 0.2,
        size: 2.5,
        perlins: 1.0,
        decay: 1,
        displace: .1,
        complex: 0.50,
        waves: 2.5,
        eqcolor: 9.0,
        rcolor: 0.4,
        gcolor: 0.05,
        bcolor: 0.6,
        fragment: true,
        points: false,
        redhell: false
    },
    perlinRandom: function () {
        gsap.to(this.perlin, {
            //decay: Math.random() * 1.0,
            waves: Math.random() * 20.0,
            complex: Math.random() * 1.0,
            displace: Math.random() * 2.5,
            ease: 'elastic.easeOut',
            duration: 2,
        });
    },
    random: function () {
        //this.perlin.redhell = Math.random() >= 0.5; // 10 1 0.1 1.2
        gsap.to(this.perlin, {
            eqcolor: 11.0,
            rcolor: Math.random() * 1.5,
            gcolor: Math.random() * 0.5,
            bcolor: Math.random() * 1.5,
            ease: 'power1.easeInOut',
            duration: 1,
        });
    },
    normal: function () {
        this.perlin.redhell = true; // 10 1 0.1 1.2
        gsap.to(this.perlin, {
            //speed: 0.12,
            eqcolor: 10.0,
            rcolor: 1.5,
            gcolor: 1.5,
            bcolor: 1.5,
            ease: 'power1.easeInOut',
            duration: 1,
        });
    },
    darker: function () {
        this.perlin.redhell = false; // 10 1 0.1 1.2
        gsap.to(this.perlin, {
            //speed: 0.5,
            eqcolor: 9.0,
            rcolor: 0.4,
            gcolor: 0.05,
            bcolor: 0.6,
            ease: 'power1.easeInOut',
            duration: 1,
        });
    },
    volcano: function () {
        this.perlin.redhell = false; // 10 1 0.1 1.2
        //this.perlin.speed = 0.83;

        gsap.to(this.perlin, {
            size: 0.7,
            waves: 0.6,
            complex: 1.0,
            displace: 0.3,
            eqcolor: 9.0,
            rcolor: 0.85,
            gcolor: 0.05,
            bcolor: 0.32,
            ease: 'power1.easeInOut',
            duration: 1,
        });
    },
    cloud: function () {
        this.perlin.redhell = true; // 10 1 0.1 1.2
        //this.perlin.speed = 0.1;

        gsap.to(this.perlin, {
            size: 1.0,
            waves: 20.0,
            complex: 0.1,
            displace: 0.1,
            eqcolor: 4.0,
            rcolor: 1.5,
            gcolor: 0.7,
            bcolor: 1.5,
            ease: 'power1.easeInOut',
            duration: 1
        });
    },
    tornasol: function () {
        this.perlin.redhell = false; // 10 1 0.1 1.2
        //this.perlin.speed = 0.25;

        gsap.to(this.perlin, {
            size: 1.0,
            waves: 3.0,
            complex: 0.65,
            displace: 0.5,
            eqcolor: 9.5,
            rcolor: 1.5,
            gcolor: 1.5,
            bcolor: 1.5,
            ease: 'power1.easeInOut',
            duration: 1,
        });
    },
    darkWater: function () {
        this.perlin.redhell = false; // 10 1 0.1 1.2
        //this.perlin.speed = 0.25;

        gsap.to(this.perlin, {
            size: 1.0,
            waves: 3.0,
            complex: 0.65,
            displace: 0.5,
            eqcolor: 9.5,
            rcolor: 1.5,
            gcolor: 1,
            bcolor: 1.5,
            ease: 'power1.easeInOut',
            duration: 1,
        });
    }

}



const controls = {
    shapeGroupPosition,
    shapeGroupScale
};

function animation() {
    var performance = Date.now() * 0.003;
    //---
    //_primitive.shape.visible = !options.perlin.points;
    _primitive.point.visible = options.perlin.points;
    //---
    mat.uniforms['time'].value = (options.perlin.speed / 1000) * (Date.now() - start);

    mat.uniforms['pointscale'].value = options.perlin.perlins;
    mat.uniforms['decay'].value = options.perlin.decay;
    mat.uniforms['size'].value = options.perlin.size;
    mat.uniforms['displace'].value = options.perlin.displace;
    mat.uniforms['complex'].value = options.perlin.complex;
    mat.uniforms['waves'].value = options.perlin.waves;
    mat.uniforms['fragment'].value = options.perlin.fragment;

    mat.uniforms['redhell'].value = options.perlin.redhell;
    mat.uniforms['eqcolor'].value = options.perlin.eqcolor;
    mat.uniforms['rcolor'].value = options.perlin.rcolor;
    mat.uniforms['gcolor'].value = options.perlin.gcolor;
    mat.uniforms['bcolor'].value = options.perlin.bcolor;

    shapeGroup.position.set(shapeGroupPosition.x, shapeGroupPosition.y, shapeGroupPosition.z);
    shapeGroup.scale.set(shapeGroupScale.x, shapeGroupScale.y, shapeGroupScale.z);
    //---
    requestAnimationFrame(animation);
}



export default () => {
    return {
        init,
        controls,
        options
    }
}