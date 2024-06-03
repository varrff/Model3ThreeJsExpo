import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as STDLIB from "three-stdlib";

import type Experience from "../Experience";

// 定义 Car 类，继承自 kokomi.Component
export default class Car extends kokomi.Component {
  declare base: Experience;
  model: STDLIB.GLTF; // 模型
  modelParts: THREE.Object3D[]; // 模型部件
  bodyMat!: THREE.MeshStandardMaterial; // 车身材质
  wheelModel!: THREE.Group; // 轮胎模型

  // 构造函数，接受一个 Experience 实例作为参数
  constructor(base: Experience) {
    super(base);

    // 从资源管理器中获取汽车模型
    const model = this.base.am.items["sm_car"] as STDLIB.GLTF;
    this.model = model;
    this.model.scene.position.y = 0.75;
    this.model.scene.rotation.y += -(Math.PI / 2); // 90 度用弧度表示为 Math.PI / 2
    // this.model.scene.scale.set(0.01, 0.01, 0.01);
   

    // 扁平化模型，获取模型的所有部件
    const modelParts = kokomi.flatModel(model.scene);
    kokomi.printModel(modelParts);
    this.modelParts = modelParts;

    // // 处理模型
    // this.handleModel();
  }

  // 添加已存在的模型到容器中
  addExisting() {
    this.container.add(this.model.scene);
  }

  // 更新函数
  update(): void {
    // 根据速度旋转车轮模型
    this.wheelModel?.children.forEach((item) => {
      item.rotateZ(-this.base.params.speed * 0.03);
    });
  }

  // 处理模型函数
  handleModel() {
    // 获取车身部件
    const body = this.modelParts[2] as THREE.Mesh;
    // 获取车身材质
    const bodyMat = body.material as THREE.MeshStandardMaterial;
    this.bodyMat = bodyMat;
    // 设置车身颜色
    bodyMat.color = new THREE.Color("#26d6e9");
    // 如果是 Furina 模式，则更改车身材质和贴图
    if (this.base.params.isFurina) {
      bodyMat.color = new THREE.Color("white");
      bodyMat.map = this.base.am.items["decal"];
    }

    // 遍历模型的所有部件
    // @ts-ignore
    this.modelParts.forEach((item: THREE.Mesh) => {
      // 如果部件是网格
      if (item.isMesh) {
        // 设置环境光遮蔽贴图
        const mat = item.material as THREE.MeshStandardMaterial;
        mat.aoMap = this.base.am.items["ut_car_body_ao"];
      }
    });

    // 获取车轮模型
    const Wheel = this.modelParts[35] as THREE.Group;
    this.wheelModel = Wheel;
  }

  // 设置车身环境贴图强度
  setBodyEnvmapIntensity(value: number) {
    if (this.bodyMat) {
      this.bodyMat.envMapIntensity = value;
    }
  }
}
