import * as kokomi from "kokomi.js";
import * as STDLIB from "three-stdlib";
// import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import gsap from "gsap";
import { Mesh, MeshStandardMaterial } from "three";

import type Experience from "../Experience";
import * as THREE from "three";

export default class City extends kokomi.Component {
  declare base: Experience;
  model: any;
  isRun!: boolean;
  road!: any;
  controlPoints: THREE.Vector3[];
  animationLoop: any;
  group:any;

  constructor(base: Experience) {
    super(base);
    this.controlPoints = [];
  }

  addExisting() {
    this.isRun = true;
    const model = this.base.am.items["city_road"] as STDLIB.GLTF;
    this.model = model;
    this.model.scene.position.y = -3;
    this.model.scene.position.z = 51.5;
    this.model.scene.position.x = 10;
    this.model.scene.scale.set(2, 2, 2);
    this.container.add(this.model.scene);
    this.createRoad();
    this.runRoad();
  }

  setCar() {
    const model = this.base.am.items["sm_car"] as STDLIB.GLTF;
  }

  createRoad() {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 5),
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(-20, 0, 10),
    ];
    this.controlPoints = points;

    this.updateRoadGeometry();

    // 使用GSAP进行过渡动画
    gsap.to(this.road.material, {
      duration: 2,
      opacity: 1,
      onComplete: () => {
       
      },
    });
  }

  updateRoadGeometry() {
    if (!this.controlPoints || this.controlPoints.length === 0) {
     
      return;
    }

    const curve = new THREE.CatmullRomCurve3(this.controlPoints);
    const tubularSegments = 100;
    const radius = 1;
    const radialSegments = 8;
    const closed = false;

    const geometry = new THREE.TubeGeometry(
      curve,
      tubularSegments,
      radius,
      radialSegments,
      closed
    );

    const positionAttribute = geometry.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      vertex.y *= 0.1;
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 1;

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#2076ff");
    gradient.addColorStop(1, "#abcbff");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const gradientTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.MeshBasicMaterial({
      map: gradientTexture,
      side: THREE.DoubleSide,
      opacity: 0,
      transparent: true,
    });

    if (this.road) {
      this.road.geometry.dispose();
      this.road.geometry = geometry;
    } else {
      this.road = new THREE.Mesh(geometry, material);
      this.road.rotation.y = Math.PI / 2;
      this.container.add(this.road);
    }
  }

  updateControlPoint(
    index: number,
    xValue: number | null = null,
    xStep: number | null = 0,
    zValue: number | null = null,
    zStep: number | null = 0
  ): void {
    if (!this.controlPoints || this.controlPoints.length <= index) {
      console.error(`Control point at index ${index} is not defined.`);
      return;
    }

    const point = this.controlPoints[index].clone();

    if (xValue !== null && xStep !== null) {
      if (point.x < xValue) {
        point.setX(point.x + xStep);
      } else if (point.x > xValue) {
        point.setX(point.x - xStep);
      }
    }

    if (zValue !== null && zStep !== null) {
      if (point.z >= zValue) {
        point.setZ(point.z - zStep);
      } else if (point.z < zValue) {
        point.setZ(point.z + zStep);
      }
    }

    this.controlPoints[index] = point;
    this.updateRoadGeometry();
  }

  runRoad() {
    const t1 = gsap.to(this.model.scene.position, {
      x: 1,
      duration: 3,
      delay: 2,
      onComplete: () => {},
    });
    const t2 = gsap.to(this.model.scene.position, {
      z: 52,
      duration: 3,
      delay: 2.5,
      onComplete: () => {
        t4();
        console.log("Road added to scene with smooth transition.");
      },
    });

    const car = this.base.am.items["sm_car"] as STDLIB.GLTF;
    const group = new THREE.Group();
    group.add(this.model.scene);
    group.position.copy(car.scene.position);
    this.group = group
    this.container.add(this.group);
    const t3LINE = () => {
      const animateControlPoints = () => {
        this.updateControlPoint(3, 0, 0.03, 15, 0.055); //-20, 0, 10
        //   this.updateControlPoint(4, 0, 0.007, null,null);
        // this.animationLoop = requestAnimationFrame(animateControlPoints);
        requestAnimationFrame(animateControlPoints);
      };

      animateControlPoints();
    };
    setTimeout(() => {
      t3LINE();
    }, 1000);
    const t3 = gsap.to(group.rotation, {
      y: Math.PI / 2,
      duration: 6,
      delay: 2.5,
      onComplete: () => {
       
      },
    });
    const t4 = () => {
      gsap.to(this.model.scene.position, {
        x: 0,
        z: 45,
        duration: 3,
        onComplete: () => {
          t5();
          cancelAnimationFrame(this.animationLoop);
        
        },
      });
    };

    const t5 = () => {
      gsap.to(this.model.scene.position, {
        x: 0,
        z: 10,
        duration: 10,
        onComplete: () => {
        
        },
      });
    };
  }
  removeAllModelsAndAnimations() {
    this.container.remove(this.road);
    this.model.scene.position.y = -3;
    this.model.scene.position.z = 51.5;
    this.model.scene.position.x = 10;
    // 取消动画循环
    if (this.animationLoop) {
      // cancelAnimationFrame(this.animationLoop);
      this.animationLoop = null;
    }
      // 移除道路模型
      if (this.model) {
        this.container.remove(this.model.scene);
        // 释放资源
        this.model = null;
      }
      this.group
      if ( this.group) {
        this.container.remove( this.group);
        // 释放资源
        this.group = null;
      }
      // 移除 tube 对象
      if (this.road) {
        this.container.remove(this.road);
        // 释放资源
        this.road.geometry.dispose();
        this.road.material.dispose();
        this.road = null;
      }
  }
  playAuto() {
    const bgm = new Howl({
      src: "audio/roadBgm.mp3",
      loop: false,
    });
    bgm.play();
  }
}
