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
        this.cameraPosition = new THREE.Vector3(0, 0, 5);

        this.state = {
            // cubeRotation: new THREE.Euler(),
            cameraQuaternion: new THREE.Quaternion(),
        };

        this._onAnimate = () => {
            // we will get this callback every frame

            // pretend cubeRotation is immutable.
            // this helps with updates and pure rendering.
            // React will be sure that the rotation has now updated.
            this.controls.update();
            // const { alpha, beta, gamma, orient } = this.deviceOrientation;
            // this.setState({
            //     cameraQuaternion: createQuaternion( alpha, beta, gamma, orient ),
            // });
        };
    }

    componentDidMount() {
        const controls = new DeviceOrientationController(
            this.refs.camera,
            ReactDOM.findDOMNode(this.refs.panoRoot)
        );
        controls.connect();
        this.controls = controls;
    }
    render() {
        const width = window.innerWidth; // canvas width
        const height = window.innerHeight; // canvas height

        // let { lon, lat } = this.state.camera;
        // lat = Math.max(-85, Math.min(85, lat));
        // const phi = THREE.Math.degToRad(90 - lat);
        // const theta = THREE.Math.degToRad(lon);
        //
        // const cameraPosition = new THREE.Vector3(
        //     500 * Math.sin(phi) * Math.cos(theta),
        //     500 * Math.cos(phi),
        //     500 * Math.sin(phi) * Math.sin(theta),
        // );
        
        // console.log(cameraPosition);
        return (
            <React3
                mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
                width={width}
                height={height}
                ref="panoRoot"

                onAnimate={this._onAnimate}
            >
                <scene>
                    <perspectiveCamera
                        name="camera"
                        ref="camera"
                    />
                    <mesh
                        // rotation={this.state.cubeRotation}
                        scale={new THREE.Vector3(-1, 1, 1)}
                    >
                        <sphereGeometry
                            radius={500}
                            widthSegments={600}
                            heightSegments={400}
                        />
                        <meshBasicMaterial>
                            <texture url={sphericalImgUrl} />
                        </meshBasicMaterial>
                    </mesh>
                </scene>
            </React3>);
    }
}

export default Simple;
