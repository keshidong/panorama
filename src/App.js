import React from 'react';
import React3 from 'react-three-renderer'
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import DeviceOrientationController from './utils/DeviceOrientationController';
import sphericalImgUrl from './images/spherical_texture.jpg';

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

        const material = new THREE.MeshBasicMaterial( {
            map: new THREE.TextureLoader().load( sphericalImgUrl ),
        } );

        const mesh = new THREE.Mesh( geometry, material );

        scene.add( mesh );

        const rerenderer = new THREE.WebGLRenderer();
        rerenderer.setPixelRatio( window.devicePixelRatio );
        rerenderer.setSize( window.innerWidth, window.innerHeight );

        this.container.appendChild( rerenderer.domElement );

        // Add DeviceOrientation Controls
        const controls = new DeviceOrientationController(
            camera,
            this.container,
        );
        controls.connect();

        this.camera = camera;
        this.scene = scene;
        this.rerenderer = rerenderer;
        this.controls = controls;
    }

    // Render loop
    animate = () => {
        this.controls.update();
        this.rerenderer.render( this.scene, this.camera );
        requestAnimationFrame( this.animate );
    }

    componentDidMount() {
        this.init();

        this.animate();
    }

    render() {
        return (
            <div ref={(dom) => {this.container = dom; }} />
        );
    }
}

export default Simple;
