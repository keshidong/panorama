import React from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import sphericalImgUrl from './images/spherical_texture.jpg';

class Simple extends React.Component {
    constructor(props, context) {
        super(props, context);

        // construct the position vector here, because if we use 'new' within render,
        // React will think that things have changed when they have not.
        this.cameraPosition = new THREE.Vector3(0, 0, 5);

        this.state = {
            // cubeRotation: new THREE.Euler(),
            camera: {
                lon: 0,
                lat: 0,
                phi: 0,
            },
        };

        this._onAnimate = () => {
            // we will get this callback every frame

            // pretend cubeRotation is immutable.
            // this helps with updates and pure rendering.
            // React will be sure that the rotation has now updated.
            const { lon, lat, phi } = this.state.camera;
            this.setState({
                // cubeRotation: new THREE.Euler(
                //     this.state.cubeRotation.x + 0.005,
                //     this.state.cubeRotation.y + 0.005,
                //     0
                // ),
                camera: {
                    lon: lon + 0.1,
                    lat,
                    phi,
                },
            });
        };
    }

    componentDidMount() {
        window.addEventListener('deviceorientation', (e) => {
            const { alpha, beta, gamma } = e;
            console.log(alpha, beta, gamma);
            this.setState({
                camera: {
                    lon: -alpha,
                    lat: beta - 90,
                },
            })
        })
    }
    render() {
        const width = window.innerWidth; // canvas width
        const height = window.innerHeight; // canvas height

        let { lon, lat } = this.state.camera;
        lat = Math.max(-85, Math.min(85, lat));
        const phi = THREE.Math.degToRad(90 - lat);
        const theta = THREE.Math.degToRad(lon);

        const cameraPosition = new THREE.Vector3(
            500 * Math.sin(phi) * Math.cos(theta),
            500 * Math.cos(phi),
            500 * Math.sin(phi) * Math.sin(theta),
        );
        
        // console.log(cameraPosition);
        return (
            <React3
                mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
                width={width}
                height={height}

                // onAnimate={this._onAnimate}
            >
                <scene>
                    <perspectiveCamera
                        name="camera"
                        fov={70}
                        aspect={width / height}
                        near={1}
                        far={1000}

                        lookAt={cameraPosition}
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
