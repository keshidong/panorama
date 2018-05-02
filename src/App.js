import React from 'react';
import * as THREE from 'three';
import attachOrbitControls from './threejs-controls/OrbitControls';
import attachDeviceOrientationControls from './threejs-controls/DeviceOrientationControls';
import sphericalImgUrl from './images/spherical_texture.jpg';

// todo conside let webpack do it
attachOrbitControls(THREE);
attachDeviceOrientationControls(THREE);

class Simple extends React.Component {
    constructor(props, context) {
        super(props, context);

        // construct the position vector here, because if we use 'new' within render,
        // React will think that things have changed when they have not.

        this.state = {
            // cubeRotation: new THREE.Euler(),
            // cameraQuaternion: new THREE.Quaternion(),
        };
    }
    init() {
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );

        const scene = new THREE.Scene();

        const geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
        // invert the geometry on the x-axis so that all of the faces point inward
        geometry.scale( - 1, 1, 1 );

        const texture = new THREE.TextureLoader().load( sphericalImgUrl );
        // texture.offset = new THREE.Vector2( 0.1, 0 );
        // console.log(texture.transformUv({ x: 0.5, y: 0.5 }));


        const material = new THREE.MeshBasicMaterial( {
            map: texture,
        } );
        const mesh = new THREE.Mesh( geometry, material );

        scene.add( mesh );

        const rerenderer = new THREE.WebGLRenderer();
        rerenderer.setPixelRatio( window.devicePixelRatio );
        rerenderer.setSize( window.innerWidth, window.innerHeight );

        this.container.appendChild( rerenderer.domElement );

        // Add DeviceOrientation Controls
        const orbitControls = new THREE.OrbitControls(
            camera,
            rerenderer.domElement,
        );
        orbitControls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        orbitControls.dampingFactor = 0.25;
        orbitControls.screenSpacePanning = false;
        orbitControls.minDistance = 100;
        orbitControls.maxDistance = 500;
        orbitControls.maxPolarAngle = Math.PI / 2;

        // add DeviceOrientationControls
        const deviceOrientationControls = new THREE.DeviceOrientationControls(
            camera
        );

        this.camera = camera;
        this.scene = scene;
        this.rerenderer = rerenderer;
        this.orbitControls = orbitControls;
        this.deviceOrientationControls = deviceOrientationControls;

        this.controlsControl();
    }

    // switch controls
    controlsControl = () => {
        this.rerenderer.domElement.addEventListener('touchstart', () => {
            this.orbitControls.update();
            this.orbitControls.enabled = true;
            this.deviceOrientationControls.enabled = false;
        });
        this.rerenderer.domElement.addEventListener('touchend', () => {
            this.orbitControls.enabled = false;
            this.deviceOrientationControls.enabled = true;
        });
    }

    // Render loop
    animate = () => {
        this.orbitControls.update();
        this.deviceOrientationControls.update();
        this.rerenderer.render( this.scene, this.camera );
        requestAnimationFrame( this.animate );
    }

    componentDidMount() {
        this.init();

        console.log(THREE.OrbitControls);
        this.animate();
    }

    render() {
        return (
            <div ref={(dom) => {this.container = dom; }} />
        );
    }
}

export default Simple;
