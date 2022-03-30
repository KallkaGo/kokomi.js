import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import mitt, { type Emitter } from "mitt";

import gsap from "gsap";

export interface BasicPanoramaConfig {
  radius: number;
}

class BasicPanorama extends Component {
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  emitter: Emitter<any>;
  constructor(base: Base, config: Partial<BasicPanoramaConfig> = {}) {
    super(base);

    const { radius = 5000 } = config;

    const geometry = new THREE.SphereGeometry(radius, 60, 40);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      transparent: true,
      opacity: 1,
    });
    this.material = material;
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;

    this.emitter = mitt();
  }
  addExisting(): void {
    const { base, mesh } = this;
    const { scene } = base;

    scene.add(mesh);
  }
  outputPosition() {
    window.addEventListener("click", (event) => {
      const intersects = this.base.interactionManager.raycaster.intersectObject(
        this.mesh,
        true
      );
      const point = intersects[0].point.clone();
      const position = {
        x: point.x.toFixed(2),
        y: point.y.toFixed(2),
        z: point.z.toFixed(2),
      };
      const message = `${position.x}, ${position.y}, ${position.z}`;
      console.log(message);
      this.emitter.emit("click", point);
    });
  }
  show() {
    this.material.opacity = 1;
  }
  hide() {
    this.material.opacity = 0;
  }
  fadeIn(duration = 0.5) {
    return new Promise((resolve) => {
      gsap.fromTo(
        this.material,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration,
          onComplete() {
            resolve(true);
          },
        }
      );
    });
  }
  fadeOut(duration = 0.5) {
    return new Promise((resolve) => {
      gsap.fromTo(
        this.material,
        {
          opacity: 1,
        },
        {
          opacity: 0,
          duration,
          onComplete() {
            resolve(true);
          },
        }
      );
    });
  }
}

export { BasicPanorama };