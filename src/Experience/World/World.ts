import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
// import { Howl } from "howler";
import TWEEN from "three/examples/jsm/libs/tween.module.js";
import type Experience from "../Experience";

import TestObject from "./TestObject";
import DynamicEnv from "./DynamicEnv";
import StartRoom from "./StartRoom";
import Car from "./Car";
import Speedup from "./Speedup";
import CameraShake from "./CameraShake";
import Furina from "./Furina";
import Road from "./Road";
import City from "./City";
export default class World extends kokomi.Component {
  declare base: Experience;
  testObject: TestObject | null;
  dynamicEnv!: DynamicEnv;
  startRoom!: StartRoom;
  car!: Car;
  road!: Road;
  city!: City;
  furina!: Furina;
  speedup!: Speedup;
  environment!: kokomi.Environment;
  cameraShake!: CameraShake;
  isWheels: boolean;
  currentIndex: number;
  ambientLight: any;
  t1!: ReturnType<typeof gsap.timeline>;
  t2!: ReturnType<typeof gsap.timeline>;
  t3!: ReturnType<typeof gsap.timeline>;
  t4!: ReturnType<typeof gsap.timeline>;
  t5!: ReturnType<typeof gsap.timeline>;
  t6!: ReturnType<typeof gsap.timeline>;
  t7!: ReturnType<typeof gsap.timeline>;
  t8!: ReturnType<typeof gsap.timeline>;
  t9!: ReturnType<typeof gsap.timeline>;
  constructor(base: Experience) {
    super(base);

    this.testObject = null;
    this.isWheels = false;
    this.currentIndex = 0;
    this.base.am.on("ready", () => {
      this.handleAssets();
      this.setLine();
      // this.testObject = new TestObject(this.base);
      // this.testObject.addExisting();

      const t1 = gsap.timeline();
      this.t1 = t1;
      const t2 = gsap.timeline();
      this.t2 = t2;
      const t3 = gsap.timeline();
      this.t3 = t3;
      const t4 = gsap.timeline();
      this.t4 = t4;
      const t5 = gsap.timeline();
      this.t5 = t5;
      const t6 = gsap.timeline();
      this.t6 = t6;
      const t7 = gsap.timeline();
      this.t7 = t7;
      const t8 = gsap.timeline();
      this.t8 = t8;
      const t9 = gsap.timeline();
      this.t9 = t9;

      this.base.scene.background = new THREE.Color("black");

      const envmap1 = kokomi.getEnvmapFromHDRTexture(
        this.base.renderer,
        this.base.am.items["ut_env_night"]
      );
      const envmap2 = kokomi.getEnvmapFromHDRTexture(
        this.base.renderer,
        this.base.am.items["ut_env_light"]
      );
      const dynamicEnv = new DynamicEnv(this.base, {
        envmap1,
        envmap2,
      });
      this.dynamicEnv = dynamicEnv;
      this.base.scene.environment = dynamicEnv.envmap;
      dynamicEnv.setWeight(1);
      // dynamicEnv.lerpWeight(1, 4);

      console.log(this.base.controls.controls);
      this.base.controls.controls.maxDistance = 30;
      const startRoom = new StartRoom(this.base);
      this.startRoom = startRoom;
      startRoom.addExisting();

      const car = new Car(this.base);
      this.car = car;
      car.addExisting();

      const road = new Road(this.base);
      this.road = road;
      const city = new City(this.base);
      this.city = city;
      if (this.base.params.isFurina) {
        const furina = new Furina(this.base);
        this.furina = furina;
        furina.addExisting();
      }

      const speedup = new Speedup(this.base);
      this.speedup = speedup;
      speedup.addExisting();

      const environment = new kokomi.Environment(this.base, {
        resolution: 512,
        scene: this.base.scene,
        options: {
          minFilter: THREE.LinearMipMapLinearFilter,
          anisotropy: 0,
          depthBuffer: false,
          generateMipmaps: true,
        },
        textureType: THREE.UnsignedByteType,
        ignoreObjects: [this.car.model.scene],
      });
      this.environment = environment;

      const cameraShake = new CameraShake(this.base);
      this.cameraShake = cameraShake;
      cameraShake.setIntensity(0);

      this.base.interactionManager.add(car.model.scene);
      car.model.scene.addEventListener("click", () => {
        if (this.currentIndex == 0) {
          this.rush();
        }
      });

      this.on("enter", () => {
        this.base.params.disableInteract = false;
      });

      this.enter();
      // this.enterDirectly();

      // const bgm = new Howl({
      //   src: "audio/bgm.mp3",
      //   loop: true,
      // });
      // bgm.play();
    });
  }
  handleAssets() {
    const items = this.base.am.items;
    (items["ut_car_body_ao"] as THREE.Texture).flipY = false;
    (items["ut_car_body_ao"] as THREE.Texture).colorSpace =
      THREE.LinearSRGBColorSpace;
    (items["ut_car_body_ao"] as THREE.Texture).minFilter = THREE.NearestFilter;
    (items["ut_car_body_ao"] as THREE.Texture).magFilter = THREE.NearestFilter;
    (items["ut_car_body_ao"] as THREE.Texture).channel = 1;
    (items["ut_startroom_ao"] as THREE.Texture).flipY = false;
    (items["ut_startroom_ao"] as THREE.Texture).colorSpace =
      THREE.LinearSRGBColorSpace;
    (items["ut_startroom_ao"] as THREE.Texture).channel = 1;
    (items["ut_startroom_light"] as THREE.Texture).flipY = false;
    (items["ut_startroom_light"] as THREE.Texture).colorSpace =
      THREE.SRGBColorSpace;
    (items["ut_startroom_light"] as THREE.Texture).channel = 1;
    (items["ut_floor_normal"] as THREE.Texture).flipY = false;
    (items["ut_floor_normal"] as THREE.Texture).colorSpace =
      THREE.LinearSRGBColorSpace;
    (items["ut_floor_normal"] as THREE.Texture).wrapS = THREE.RepeatWrapping;
    (items["ut_floor_normal"] as THREE.Texture).wrapT = THREE.RepeatWrapping;
    (items["ut_floor_roughness"] as THREE.Texture).flipY = false;
    (items["ut_floor_roughness"] as THREE.Texture).colorSpace =
      THREE.LinearSRGBColorSpace;
    (items["ut_floor_roughness"] as THREE.Texture).wrapS = THREE.RepeatWrapping;
    (items["ut_floor_roughness"] as THREE.Texture).wrapT = THREE.RepeatWrapping;

    if (this.base.params.isFurina) {
      (items["decal"] as THREE.Texture).flipY = false;
      (items["decal"] as THREE.Texture).colorSpace = THREE.LinearSRGBColorSpace;
    }
  }
  clearAllTweens() {
    this.t1.clear();
    this.t2.clear();
    this.t3.clear();
    this.t4.clear();
    this.t5.clear();
    this.t6.clear();
    this.t7.clear();
    this.t8.clear();
    this.t9.clear();
  }
  enter() {
    if (this.currentIndex == 0) {
      this.startRoom.lightMat.opacity = 0;
      this.rush();
      const options = { x: 0.23, y: 2.85, z: -11.5 };
      this.moveCameraToPosition(
        options,
        () => {
          this.rushDone();
          this.VisibilityTitle1(true);
        },
        4
      );
    }

    this.base.params.disableInteract = true;
    this.dynamicEnv.setWeight(0);
    this.startRoom.lightMat.emissive.set(new THREE.Color("#000000"));
    this.startRoom.lightMat.emissiveIntensity = 0;
    this.dynamicEnv.setIntensity(0);
    this.startRoom.customFloorMat.uniforms.uColor.value.set(
      new THREE.Color("#000000")
    );
    this.startRoom.customFloorMat.uniforms.uReflectIntensity.value = 0;
    this.furina?.setColor(new THREE.Color("#000000"));

    document.querySelector(".loader-screen")?.classList.add("hollow");

    this.base.params.isCameraMoving = true;
    // this.t1.to(this.base.params.cameraPos, {
    //   x: 0.23,
    //   y: 2.85,
    //   z: -11.5,
    //   duration: 0.1,
    //   ease: "power2.inOut",
    //   onComplete: () => {
    //     this.base.params.isCameraMoving = false;
    //     this.emit("enter");
    //   },
    // });
    const lightColor = new THREE.Color();
    const blackColor = new THREE.Color("#000000");
    const whiteColor = new THREE.Color("#ffffff");
    this.t2.to(this.base.params, {
      lightAlpha: 1,
      lightIntensity: 1,
      reflectIntensity: 25,
      furinaLerpColor: 1,
      duration: 4,
      delay: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        lightColor
          .copy(blackColor)
          .lerp(whiteColor, this.base.params.lightAlpha);

        this.startRoom.lightMat.emissive.set(lightColor);
        this.startRoom.lightMat.emissiveIntensity =
          this.base.params.lightIntensity;

        this.startRoom.customFloorMat.uniforms.uColor.value.set(lightColor);
        this.startRoom.customFloorMat.uniforms.uReflectIntensity.value =
          this.base.params.reflectIntensity;

        this.furina?.setColor(lightColor);
      },
    });
    this.t3
      .to(this.base.params, {
        envIntensity: 1,
        duration: 4,
        delay: 0.5,
        ease: "power2.inOut",
        onUpdate: () => {
          this.dynamicEnv.setIntensity(this.base.params.envIntensity);
        },
      })
      .to(
        this.base.params,
        {
          envWeight: 1,
          duration: 4,
          ease: "power2.inOut",
          onUpdate: () => {
            this.dynamicEnv.setWeight(this.base.params.envWeight);
          },
        },
        "-=2.5"
      );
  }
  enterDirectly() {
    document.querySelector(".loader-screen")?.classList.add("hollow");
    this.base.params.isCameraMoving = false;
    this.base.controls.controls.setPosition(0, 0.8, -7);
    this.base.params.envIntensity = 1;
    this.emit("enter");
  }
  async rush() {
    if (this.currentIndex !== 0) {
      return;
    }
    if (this.base.params.isRushing) {
      this.rushDone();
      return;
    }

    if (this.base.params.disableInteract) {
      return;
    }
    this.isWheels = true;
    this.wheels();
    this.base.params.disableInteract = true;
    this.clearAllTweens();
    // this.base.controls.controls.setPosition(6.4, 1, -3);
    const floorColor = new THREE.Color();
    const blackColor = new THREE.Color("#000000");
    const camera = this.base.camera as THREE.PerspectiveCamera;

    const furinaColor = new THREE.Color();
    const furinaFadeColor = new THREE.Color("#666666");

    this.furina?.drive();

    this.t4
      .to(this.base.params, {
        speed: 4,
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
          this.base.params.isRushing = true;
          this.base.params.disableInteract = false;
        },
      })
      .to(this.base.params, {
        speed: 10,
        duration: 4,
        ease: "power2.out",
      });
    this.t5.to(this.base.params, {
      lightOpacity: 0,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        //隐藏灯光板
        this.startRoom.lightMat.opacity = this.base.params.lightOpacity;
      },
    });
    this.t6.fromTo(
      this.base.params,
      {
        floorLerpColor: 0,
        furinaLerpColor: 0,
      },
      {
        floorLerpColor: 1,
        furinaLerpColor: 1,
        duration: 4,
        ease: "none",
        onUpdate: () => {
          floorColor.lerp(blackColor, this.base.params.floorLerpColor);
          this.startRoom.customFloorMat.uniforms.uColor.value.set(floorColor);

          furinaColor.lerp(furinaFadeColor, this.base.params.furinaLerpColor);
          this.furina?.setColor(furinaColor);
        },
      }
    );
    this.t7.to(this.base.params, {
      envIntensity: 0.01,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.dynamicEnv.setIntensity(this.base.params.envIntensity);
      },
    });
    this.t8.to(this.base.params, {
      speedUpOpacity: 1,
      cameraFov: 36,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        this.speedup.material.uniforms.uOpacity.value =
          this.base.params.speedUpOpacity;

        camera.fov = this.base.params.cameraFov;
        camera.updateProjectionMatrix();
      },
    });
    await kokomi.sleep(1000);
    this.base.scene.environment = this.environment.texture;
    this.t9.to(this.base.params, {
      carBodyEnvIntensity: 10,
      cameraShakeIntensity: 1,
      bloomLuminanceSmoothing: 0.4,
      bloomIntensity: 2,
      duration: 4,
      ease: "power2.out",
      onUpdate: () => {
        this.car.setBodyEnvmapIntensity(this.base.params.carBodyEnvIntensity);
        this.cameraShake.setIntensity(this.base.params.cameraShakeIntensity);
        this.base.post.setLuminanceSmoothing(
          this.base.params.bloomLuminanceSmoothing
        );
        this.base.post.setIntensity(this.base.params.bloomIntensity);
      },
    });
  }
  // 车轮滚动
  wheels() {
    this.VisibilityMenu(false);
    // 从资源管理器中获取汽车模型
    const carModel = this.base.am.items["sm_car"];
    const wheelFrontLeft = this.findObjectByName(
      carModel.scene,
      "wheels001_wheels6_0"
    );
    const wheelFrontRight = this.findObjectByName(
      carModel.scene,
      "wheels_wheels6_0"
    );
    // 确保所有车轮对象都存在
    if (wheelFrontLeft && wheelFrontRight) {
      // 渲染循环
      const animate = () => {
        if (!this.isWheels) {
          this.VisibilityMenu(true);
          return; // 如果标志为false，停止动画
        }
        requestAnimationFrame(animate);
        // 旋转车轮
        const rotationSpeed = 0.1; // 车轮旋转速度
        wheelFrontLeft.rotation.x -= rotationSpeed;
        wheelFrontRight.rotation.x -= rotationSpeed;
      };

      animate();
    } else {
      console.log("找不到所有车轮对象");
    }
  }

  // 查找车轮对象
  findObjectByName(
    obj: { name: any; children: string | any[] },
    name: string
  ): any {
    if (obj.name === name) {
      return obj;
    }
    for (let i = 0; i < obj.children.length; i++) {
      const result = this.findObjectByName(obj.children[i], name);
      if (result) {
        return result;
      }
    }
    return null;
  }
  rushDone() {
    if (this.base.params.disableInteract) {
      return;
    }

    this.base.params.disableInteract = true;
    this.clearAllTweens();
    const floorColor = new THREE.Color();
    const whiteColor = new THREE.Color("#ffffff");
    const camera = this.base.camera as THREE.PerspectiveCamera;

    const furinaColor = new THREE.Color();
    const furinaOriginalColor = new THREE.Color("#ffffff");

    this.furina?.pause();

    this.t4.to(this.base.params, {
      speed: 0,
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        this.base.params.isRushing = false;
        this.base.params.disableInteract = false;
      },
    });
    this.t5.to(this.base.params, {
      lightOpacity: 1,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.startRoom.lightMat.opacity = this.base.params.lightOpacity;
      },
    });
    this.t6.fromTo(
      this.base.params,
      { floorLerpColor: 0, furinaLerpColor: 0 },
      {
        floorLerpColor: 1,
        furinaLerpColor: 1,
        duration: 4,
        ease: "none",
        onUpdate: () => {
          floorColor.lerp(whiteColor, this.base.params.floorLerpColor);
          this.startRoom.customFloorMat.uniforms.uColor.value.set(floorColor);

          furinaColor.lerp(
            furinaOriginalColor,
            this.base.params.furinaLerpColor
          );
          this.furina?.setColor(furinaColor);
        },
      }
    );
    this.t7.to(this.base.params, {
      envIntensity: 1,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.dynamicEnv.setIntensity(this.base.params.envIntensity);
      },
    });
    this.t8.to(this.base.params, {
      speedUpOpacity: 0,
      cameraFov: 33.4,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        this.speedup.material.uniforms.uOpacity.value =
          this.base.params.speedUpOpacity;

        camera.fov = this.base.params.cameraFov;
        camera.updateProjectionMatrix();
      },
    });
    this.t9.to(this.base.params, {
      carBodyEnvIntensity: 1,
      cameraShakeIntensity: 0,
      bloomLuminanceSmoothing: 1.6,
      bloomIntensity: 1,
      duration: 4,
      ease: "power2.out",
      onUpdate: () => {
        this.car.setBodyEnvmapIntensity(this.base.params.carBodyEnvIntensity);
        this.cameraShake.setIntensity(this.base.params.cameraShakeIntensity);
        this.base.post.setLuminanceSmoothing(
          this.base.params.bloomLuminanceSmoothing
        );
        this.base.post.setIntensity(this.base.params.bloomIntensity);
      },
    });
    this.base.scene.environment = this.dynamicEnv.envmap;
    setTimeout(() => {
      this.isWheels = false;
      const father = document.querySelector(".line") as Element;
      //@ts-ignore
      father.style.display = "flex"; // 设置元素 display 为 none
    }, 1500);
  }
  rush3() {
    this.city.addExisting();
    setTimeout(() => {
      const targetPosition = { x: -31.82, y: 56.71, z: 3.61 };
      this.moveCameraToPosition(targetPosition, null, 5);
      setTimeout(() => {
        const targetPosition2 = { x: -14.53, y: 8.41, z: 0.01 };
        this.moveCameraToPosition(
          targetPosition2,
          () => {
            const father = document.querySelector(".line") as Element;
            //@ts-ignore
            father.style.display = "flex"; // 设置元素 display 为 none
          },
          2
        );
      }, 5000);
    }, 2000);
    this.isWheels = true;
    this.wheels();
    this.base.params.disableInteract = true;
    this.clearAllTweens();
    setTimeout(() => {
      this.VisibilityMenu(true);
      this.VisibilityTitle3(true);
    }, 7000);
    // this.base.controls.controls.setPosition(6.4, 1, -3);
    const floorColor = new THREE.Color();
    const blackColor = new THREE.Color("#000000");
    const camera = this.base.camera as THREE.PerspectiveCamera;
    camera.near = 0.1; // 将近剪切面调近
    camera.far = 100; // 根据场景实际情况调整远剪切面
    camera.updateProjectionMatrix();

    const furinaColor = new THREE.Color();
    const furinaFadeColor = new THREE.Color("#666666");

    this.furina?.drive();
    const ambientLight = new THREE.AmbientLight("0xffffff", 0.1); // 第一个参数是颜色，第二个参数是光强度 // 第一个参数是颜色，第二个参数是光强度
    ambientLight.position.y = ambientLight.position.y + 2; // 设置灯光的位置
    this.ambientLight = ambientLight;
    this.container.add(this.ambientLight);
    this.t4
      .to(this.base.params, {
        speed: 4,
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
          this.base.params.isRushing = true;
          this.base.params.disableInteract = false;
        },
      })
      .to(this.base.params, {
        speed: 10,
        duration: 4,
        ease: "power2.out",
      });
    this.t5.to(this.base.params, {
      lightOpacity: 0,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        //隐藏灯光板
        this.startRoom.lightMat.opacity = this.base.params.lightOpacity;
      },
    });
    this.t6.fromTo(
      this.base.params,
      {
        floorLerpColor: 0,
        furinaLerpColor: 0,
      },
      {
        floorLerpColor: 1,
        furinaLerpColor: 1,
        duration: 4,
        ease: "none",
        onUpdate: () => {
          floorColor.lerp(blackColor, this.base.params.floorLerpColor);
          this.startRoom.customFloorMat.uniforms.uColor.value.set(floorColor);

          furinaColor.lerp(furinaFadeColor, this.base.params.furinaLerpColor);
          // this.furina?.setColor(furinaColor);
        },
      }
    );

    // ----
    this.startRoom.toggleModelVisibility(false);

    // ----
    this.t7.to(this.base.params, {
      envIntensity: 0.01,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.dynamicEnv.setIntensity(this.base.params.envIntensity);
      },
    });
    // ----
  }
  setLine() {
    const lines = document.querySelectorAll(".child");
    lines.forEach((line, index) => {
      line.addEventListener("click", () => {
        const oldIndex = Array.from(lines).findIndex((line) =>
          line.classList.contains("act")
        );
        if (oldIndex == index ) {
          return;
        }
        // 获取已经存在act类的元素索引值
        const father = document.querySelector(".line") as Element;
        //@ts-ignore
        father.style.display = "none";
        if (oldIndex == 1) {
          this.rushDone2();
        }
        if (oldIndex == 2) {
          this.rushDone3();
        }
        if (this.currentIndex !== null) {
          lines.forEach((e, index) => {
            lines[index].classList.remove("act");
          });
        }
        line.classList.add("act");
        // 根据索引设置不同的目标位置
        let targetPosition;
        switch (index) {
          case 0:
            this.VisibilityTitle1(true);
            targetPosition = { x: 0.23, y: 2.85, z: -11.5 };
            this.moveCameraToPosition(targetPosition, () => {
                               //@ts-ignore
            father.style.display = "flex";
            });
            break;
          case 1:
            this.VisibilityTitle1(false);
            targetPosition = { x: -23.4, y: 15.05, z: -0.04 };
            this.moveCameraToPosition(targetPosition, this.rush2());
            break;
          case 2:
            this.VisibilityTitle1(false);
            targetPosition = { x: -49.54, y: 41.86, z: 3.49 };
            this.moveCameraToPosition(targetPosition, this.rush3());
            break;
          // 添加其他 case 以处理其他索引的目标位置
          default:
            break;
        }

        this.currentIndex = index;
      });
    });
  }
  rushDone3() {
    this.city.removeAllModelsAndAnimations();
    this.VisibilityTitle3(false);
    this.startRoom.toggleModelVisibility(true);
    this.container.remove(this.ambientLight);
    this.VisibilityTitle2(false);

    this.base.params.disableInteract = true;
    this.clearAllTweens();
    const floorColor = new THREE.Color();
    const whiteColor = new THREE.Color("#ffffff");
    const camera = this.base.camera as THREE.PerspectiveCamera;

    const furinaColor = new THREE.Color();
    const furinaOriginalColor = new THREE.Color("#ffffff");

    this.furina?.pause();

    this.t4.to(this.base.params, {
      speed: 0,
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        this.base.params.isRushing = false;
        this.base.params.disableInteract = false;
      },
    });
    this.t5.to(this.base.params, {
      lightOpacity: 1,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.startRoom.lightMat.opacity = this.base.params.lightOpacity;
      },
    });
    this.t6.fromTo(
      this.base.params,
      { floorLerpColor: 0, furinaLerpColor: 0 },
      {
        floorLerpColor: 1,
        furinaLerpColor: 1,
        duration: 4,
        ease: "none",
        onUpdate: () => {
          floorColor.lerp(whiteColor, this.base.params.floorLerpColor);
          this.startRoom.customFloorMat.uniforms.uColor.value.set(floorColor);

          furinaColor.lerp(
            furinaOriginalColor,
            this.base.params.furinaLerpColor
          );
          this.furina?.setColor(furinaColor);
        },
      }
    );
    this.t7.to(this.base.params, {
      envIntensity: 1,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.dynamicEnv.setIntensity(this.base.params.envIntensity);
      },
    });
    this.t8.to(this.base.params, {
      speedUpOpacity: 0,
      cameraFov: 33.4,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        this.speedup.material.uniforms.uOpacity.value =
          this.base.params.speedUpOpacity;

        camera.fov = this.base.params.cameraFov;
        camera.updateProjectionMatrix();
      },
    });
    this.t9.to(this.base.params, {
      carBodyEnvIntensity: 1,
      cameraShakeIntensity: 0,
      bloomLuminanceSmoothing: 1.6,
      bloomIntensity: 1,
      duration: 4,
      ease: "power2.out",
      onUpdate: () => {
        this.car.setBodyEnvmapIntensity(this.base.params.carBodyEnvIntensity);
        this.cameraShake.setIntensity(this.base.params.cameraShakeIntensity);
        this.base.post.setLuminanceSmoothing(
          this.base.params.bloomLuminanceSmoothing
        );
        this.base.post.setIntensity(this.base.params.bloomIntensity);
      },
    });
    this.base.scene.environment = this.dynamicEnv.envmap;
    setTimeout(() => {
      this.isWheels = false;
    }, 8000);
  }
  VisibilityMenu(show: boolean) {
    const menu = document.querySelector(".line") as HTMLElement;
    if (!show) {
      menu.style.opacity = "0";
    } else {
      menu.style.opacity = "1";
    }
  }
  VisibilityTitle1(show: boolean) {
    const title1 = document.querySelector(".title1") as HTMLElement;
    if (!show) {
      title1.style.opacity = "0";
    } else {
      title1.style.opacity = "1";
    }
  }
  VisibilityTitle2(show: boolean) {
    const title1 = document.querySelector(".safety") as HTMLElement;
    if (!show) {
      title1.style.opacity = "0";
    } else {
      title1.style.opacity = "1";
    }
  }
  VisibilityTitle3(show: boolean) {
    const title1 = document.querySelector(".fsd") as HTMLElement;
    if (!show) {
      title1.style.opacity = "0";
    } else {
      title1.style.opacity = "1";
    }
  }
  async rush2() {
    this.isWheels = true;
    this.wheels();
    this.base.params.disableInteract = true;
    this.clearAllTweens();
    setTimeout(() => {
      this.VisibilityMenu(true);
    }, 10000);
    // this.base.controls.controls.setPosition(6.4, 1, -3);
    const floorColor = new THREE.Color();
    const blackColor = new THREE.Color("#000000");
    const camera = this.base.camera as THREE.PerspectiveCamera;
    camera.near = 0.1; // 将近剪切面调近
    camera.far = 100; // 根据场景实际情况调整远剪切面
    camera.updateProjectionMatrix();

    const furinaColor = new THREE.Color();
    const furinaFadeColor = new THREE.Color("#666666");

    this.furina?.drive();
    const ambientLight = new THREE.AmbientLight("0xffffff", 0.5); // 第一个参数是颜色，第二个参数是光强度 // 第一个参数是颜色，第二个参数是光强度
    ambientLight.position.y = ambientLight.position.y + 2; // 设置灯光的位置
    this.ambientLight = ambientLight;
    this.container.add(this.ambientLight);
    this.t4
      .to(this.base.params, {
        speed: 4,
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
          this.base.params.isRushing = true;
          this.base.params.disableInteract = false;
        },
      })
      .to(this.base.params, {
        speed: 10,
        duration: 4,
        ease: "power2.out",
      });
    this.t5.to(this.base.params, {
      lightOpacity: 0,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        //隐藏灯光板
        this.startRoom.lightMat.opacity = this.base.params.lightOpacity;
      },
    });
    this.t6.fromTo(
      this.base.params,
      {
        floorLerpColor: 0,
        furinaLerpColor: 0,
      },
      {
        floorLerpColor: 1,
        furinaLerpColor: 1,
        duration: 4,
        ease: "none",
        onUpdate: () => {
          floorColor.lerp(blackColor, this.base.params.floorLerpColor);
          this.startRoom.customFloorMat.uniforms.uColor.value.set(floorColor);

          furinaColor.lerp(furinaFadeColor, this.base.params.furinaLerpColor);
          // this.furina?.setColor(furinaColor);
        },
      }
    );

    // ----
    this.startRoom.toggleModelVisibility(false);
    this.road.addExisting();
    this.VisibilityTitle2(true);
    // ----
    this.t7.to(this.base.params, {
      envIntensity: 0.01,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.dynamicEnv.setIntensity(this.base.params.envIntensity);
      },
    });
  }
  rushDone2() {
    this.road.removeAllModelsAndAnimations();
    this.startRoom.toggleModelVisibility(true);
    this.container.remove(this.ambientLight);
    this.VisibilityTitle2(false);

    this.base.params.disableInteract = true;
    this.clearAllTweens();
    const floorColor = new THREE.Color();
    const whiteColor = new THREE.Color("#ffffff");
    const camera = this.base.camera as THREE.PerspectiveCamera;

    const furinaColor = new THREE.Color();
    const furinaOriginalColor = new THREE.Color("#ffffff");

    this.furina?.pause();

    this.t4.to(this.base.params, {
      speed: 0,
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        this.base.params.isRushing = false;
        this.base.params.disableInteract = false;
      },
    });
    this.t5.to(this.base.params, {
      lightOpacity: 1,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.startRoom.lightMat.opacity = this.base.params.lightOpacity;
      },
    });
    this.t6.fromTo(
      this.base.params,
      { floorLerpColor: 0, furinaLerpColor: 0 },
      {
        floorLerpColor: 1,
        furinaLerpColor: 1,
        duration: 4,
        ease: "none",
        onUpdate: () => {
          floorColor.lerp(whiteColor, this.base.params.floorLerpColor);
          this.startRoom.customFloorMat.uniforms.uColor.value.set(floorColor);

          furinaColor.lerp(
            furinaOriginalColor,
            this.base.params.furinaLerpColor
          );
          this.furina?.setColor(furinaColor);
        },
      }
    );
    this.t7.to(this.base.params, {
      envIntensity: 1,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.dynamicEnv.setIntensity(this.base.params.envIntensity);
      },
    });
    this.t8.to(this.base.params, {
      speedUpOpacity: 0,
      cameraFov: 33.4,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        this.speedup.material.uniforms.uOpacity.value =
          this.base.params.speedUpOpacity;

        camera.fov = this.base.params.cameraFov;
        camera.updateProjectionMatrix();
      },
    });
    this.t9.to(this.base.params, {
      carBodyEnvIntensity: 1,
      cameraShakeIntensity: 0,
      bloomLuminanceSmoothing: 1.6,
      bloomIntensity: 1,
      duration: 4,
      ease: "power2.out",
      onUpdate: () => {
        this.car.setBodyEnvmapIntensity(this.base.params.carBodyEnvIntensity);
        this.cameraShake.setIntensity(this.base.params.cameraShakeIntensity);
        this.base.post.setLuminanceSmoothing(
          this.base.params.bloomLuminanceSmoothing
        );
        this.base.post.setIntensity(this.base.params.bloomIntensity);
      },
    });
    this.base.scene.environment = this.dynamicEnv.envmap;
    setTimeout(() => {
      this.isWheels = false;
    }, 1500);
  }
  moveCameraToPosition(
    targetPosition: any,
    onCompleteCallback?: any,
    duration = 2,
    ease = "power2.inOut"
  ) {
    // 获取当前控制器的位置
    const currentPosition = this.base.controls.controls.getPosition(
      new THREE.Vector3()
    );

    // 使用 gsap 平滑移动到目标位置
    gsap.to(currentPosition, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: duration, // 动画持续时间
      ease: ease,
      onUpdate: () => {
        // 更新控制器位置
        this.base.controls.controls.setPosition(
          currentPosition.x,
          currentPosition.y,
          currentPosition.z
        );
        // 更新渲染
        this.base.renderer.render(this.base.scene, this.base.camera);
      },
      onComplete: () => {
        this.base.params.isCameraMoving = false;
        if (onCompleteCallback) {
          console.log(onCompleteCallback);

          onCompleteCallback();
        }
      },
    });

    this.base.params.isCameraMoving = true;
  }
}
