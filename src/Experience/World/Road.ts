import * as kokomi from "kokomi.js";
import * as STDLIB from "three-stdlib";
// @ts-ignore
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import gsap from "gsap";
import { Mesh, MeshStandardMaterial } from "three";
import { Howl } from "howler";
import type Experience from "../Experience";
import * as THREE from "three";

export default class Road extends kokomi.Component {
  declare base: Experience;
  model: any;
  isRun!: boolean;
  carShield: Mesh | null = null;
  lineMesh: Mesh | null = null;
  controlPoints!: Array<THREE.Vector3>;
  tube: any;
  animationLoop: any;
  newCar: any;
  AnimationFrame: any;

  constructor(base: Experience) {
    super(base);
  }

  addExisting() {
    this.isRun = true;
    const model = this.base.am.items["road"] as STDLIB.GLTF;
    this.model = model;
    this.model.scene.position.z = -2.5;
    this.model.scene.scale.set(3, 3, 3);
    this.container.add(this.model.scene);
    this.run();
  }

  run() {
    this.carRun();
    const animate = () => {
      if (!this.isRun) {
        return; // 如果标志为false，停止动画
      }
      requestAnimationFrame(animate);

      // 模型移动速度
      const moveSpeed = 0.1;

      this.model.scene.position.x -= moveSpeed;
    };

    // 初始调用animate，启动递归动画循环
    animate();
  }

  carRun() {
    // 确保每次都是新的克隆对象
    const model = this.base.am.items["sm_car"] as STDLIB.GLTF;
    this.newCar = clone(model.scene);
    console.log(model)

    // 创建一个新的标准材质，支持光照和反射
    const newMaterial = new MeshStandardMaterial({
      color: "#8a8886",
      metalness: 0.8,
      roughness: 0.8,
    }); // 这里设置你想要的颜色和材质属性

    // 遍历模型并替换所有材质
    this.newCar.traverse(
      (child: { isMesh: any; material: MeshStandardMaterial }) => {
        if (child.isMesh) {
          child.material = newMaterial;
        }
      }
    );

    this.createShield();

    this.container.add(this.newCar);

    // 动画参数
    const initialX = -1;
    const initialZ = 5;
    const forwardDistance = 3; // 向前移动的距离
    const sideDistance = 5; // 超车时横向移动的距离
    const duration = 5000; // 动画持续时间（毫秒）
    const pauseDuration = 1500; // 停顿时间（毫秒）

    let startTime: number | null = null;

    // 动画函数
    const animateCar = (time: number) => {
      if (!startTime) startTime = time;
      const elapsedTime = time - startTime;

      if (elapsedTime < duration / 2) {
        // 前半段，向前移动
        const progress = elapsedTime / (duration / 2);
        this.newCar.position.x = initialX + progress * forwardDistance;
        this.newCar.position.z = initialZ;
      } else if (elapsedTime < duration) {
        // 后半段，向斜前方移动
        const progress = (elapsedTime - duration / 2) / (duration / 2);
        this.newCar.position.x =
          initialX + forwardDistance + progress * sideDistance;
        this.newCar.position.z = initialZ - progress * sideDistance;
      } else if (elapsedTime < duration + pauseDuration) {
        // 停顿时间
        // 不进行任何操作，保持车辆静止
      } else {
        // 加速向前移动
        const progress = (elapsedTime - duration - pauseDuration) / 2000; // 加速时间为2秒
        this.newCar.position.x =
          initialX + forwardDistance + sideDistance + progress * 10; // 加速移动的距离为10
        this.newCar.position.z = initialZ - sideDistance;
        if (this.newCar.position.x > 20) {
          // 超出场景范围，移除车辆
          this.container.remove(this.newCar);
          const father = document.querySelector(".line") as Element;
          //@ts-ignore
          father.style.display = "flex"; // 设置元素 display 为 none
          cancelAnimationFrame(this.AnimationFrame); // 结束动画
        }
      }

      this.AnimationFrame = requestAnimationFrame(animateCar);
    };

    // 启动动画
    requestAnimationFrame(animateCar);
  }

  createShield() {
    const controlPoints = [
      new THREE.Vector3(3, 1, 1),
      new THREE.Vector3(2.96, 1, 1.5),
      new THREE.Vector3(3, 1, 1.7),
      new THREE.Vector3(2.65, 1, 2.7),
      new THREE.Vector3(2, 1, 2.65),
      new THREE.Vector3(1, 1, 2.7),
      new THREE.Vector3(0.5, 1, 2.8),
    ];
    this.controlPoints = controlPoints;
    // Create a Catmull-Rom spline curve
    const curve = new THREE.CatmullRomCurve3(this.controlPoints);

    // Create TubeGeometry from the curve
    const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.025, 32, false);

    // 创建画布
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 1;

    // 获取画布上下文
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    // 创建线性渐变
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#ffA500"); // 橙色
    gradient.addColorStop(1, "#ff0000"); // 红色

    // 填充画布
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 创建渐变纹理
    const gradientTexture = new THREE.CanvasTexture(canvas);

    // 创建材质
    const tubeMaterial = new THREE.MeshBasicMaterial({
      map: gradientTexture,
      side: THREE.DoubleSide, // 如果需要双面渲染，可以添加这一行
    });
    // 设置初始透明度为 0
    tubeMaterial.opacity = 0;
    tubeMaterial.transparent = true;
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    // Position the tube
    tube.position.z = -1.2;
    tube.position.y = -0.5;
    this.tube = tube;
    this.container.add(this.tube);

    // 定义动画持续时间
    const duration = 2; // 5 秒

    setTimeout(() => {
      let count = 0;
      const intervalId = setInterval(() => {
        // 执行的任务
        console.log("任务执行");
        this.playAuto();
        // 增加计数器
        count++;

        // 如果计数器达到3次，则清除定时器
        if (count === 2) {
          clearInterval(intervalId); // 清除定时器
        }
      }, 1000); // 每秒执行一次
    }, 500);

    gsap.to(tubeMaterial, {
      duration: 0.5,
      opacity: 1, // 设置目标透明度为 1，即完全不透明
      delay: 2.6, // 延迟 1 秒后开始播放动画
      ease: "power1.inOut", // 缓动函数，可以根据需要进行调整
      onComplete: () => {
        // 启动动画函数
        animateControlPoints();

        // 创建一个新的标准材质，支持光照和反射
        const newMaterial = new MeshStandardMaterial({
          color: "#b00000",
          metalness: 0.8,
          roughness: 0.8,
        }); // 这里设置你想要的颜色和材质属性

        // 遍历模型并替换所有材质
        this.newCar.traverse(
          (child: { isMesh: any; material: MeshStandardMaterial }) => {
            if (child.isMesh) {
              child.material = newMaterial;
            }
          }
        );

        let countA = 0;
        const intervalIdA = setInterval(() => {
          // 执行的任务
          console.log("任务执行2");
          this.playAuto();
          // 增加计数器
          countA++;

          // 如果计数器达到3次，则清除定时器
          if (countA === 5) {
            clearInterval(intervalIdA);
          }
        }, 500); // 每秒执行一次

        gsap.to(this.tube.position, {
          duration: 1,
          x: 0.2, // 设置 x 轴的目标位置
          z: -1, // 设置 z 轴的目标位置
          ease: "power1.inOut", // 缓动函数，可以根据需要进行调整
          delay: 3.1, // 延迟 1 秒后开始播放动画
          onComplete: () => {
            // 在动画完成后执行的操作

            // 创建一个新的标准材质，支持光照和反射
            const newMaterial = new MeshStandardMaterial({
              color: "#8a8886",
              metalness: 0.8,
              roughness: 0.8,
            }); // 这里设置你想要的颜色和材质属性

            // 遍历模型并替换所有材质
            this.newCar.traverse(
              (child: { isMesh: any; material: MeshStandardMaterial }) => {
                if (child.isMesh) {
                  child.material = newMaterial;
                }
              }
            );
            console.log("Animation completed!");
            gsap.to(tubeMaterial, {
              duration: 0.6,
              opacity: 0, //
              ease: "power1.inOut", // 缓动函数，可以根据需要进行调整
            });
            cancelAnimationFrame(this.animationLoop);
          },
        });
      },
    });

    // 动画函数
    const animateControlPoints = () => {
      this.updateControlPoint(3, 2.85, 0.007, 2, 0.007);
      this.updateControlPoint(4, null, null, 2.45, 0.0055); //(2, 1, 2.65),
      this.updateControlPoint(5, 1.2, 0.003, 2.45, 0.003);

      // new THREE.Vector3(0.5, 1, 2.8),
      this.updateControlPoint(6, 1, 0.003, 2.45, 0.0035);
      // 更新曲线和几何体
      curve.points = this.controlPoints;
      tube.geometry.dispose();
      tube.geometry = new THREE.TubeGeometry(curve, 100, 0.025, 32, false);

      this.animationLoop = requestAnimationFrame(animateControlPoints);
    };
  }

  updateControlPoint(
    index: number,
    xValue: number | null = null,
    xStep: number | null = 0,
    zValue: number | null = null,
    zStep: number | null = 0
  ): void {
    const point = this.controlPoints[index].clone();

    if (xValue !== null && xStep !== null) {
      if (point.x < xValue) {
        point.setX(point.x + xStep); // 递增操作
      } else if (point.x > xValue) {
        point.setX(point.x - xStep); // 递减操作
      }
    }

    if (zValue !== null && zStep !== null) {
      if (point.z >= zValue) {
        point.setZ(point.z - zStep); // 递减操作
      } else if (point.z < zValue) {
        point.setZ(point.z + zStep); // 递增操作
      }
    }

    this.controlPoints[index] = point;
  }

  removeAllModelsAndAnimations() {
    this.isRun = false;

    // 移除道路模型
    if (this.model) {
        this.container.remove(this.model.scene);
        this.model = null;
    }

    // 移除 tube 对象
    if (this.tube) {
        this.container.remove(this.tube);
        this.tube.geometry.dispose();
        this.tube.material.dispose();
        this.tube = null;
    }

    // 移除汽车模型
    if (this.newCar) {
        this.container.remove(this.newCar);
        this.newCar = null;
    }

    // 停止所有动画循环
    if (this.AnimationFrame) {
        cancelAnimationFrame(this.AnimationFrame);
        this.AnimationFrame = null;
    }
    if (this.animationLoop) {
        cancelAnimationFrame(this.animationLoop);
        this.animationLoop = null;
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
