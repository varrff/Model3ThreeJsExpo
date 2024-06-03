import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as STDLIB from "three-stdlib";
import { createNoise2D } from "simplex-noise";

import type Experience from "../Experience";

// 创建一个 2D simplex 噪声对象
const noise2d = createNoise2D();

// Fractal Brownian Motion（分形布朗运动）函数
const fbm = ({
  octave = 3, // 八度数
  frequency = 2, // 频率
  amplitude = 0.5, // 振幅
  lacunarity = 2, // 空隙度
  persistance = 0.5, // 持续度
} = {}) => {
  let value = 0;
  for (let i = 0; i < octave; i++) {
    // 根据参数计算噪声值
    const noiseValue = noise2d(frequency, frequency);
    value += noiseValue * amplitude;
    frequency *= lacunarity;
    amplitude *= persistance;
  }
  return value;
};

// 相机震动配置接口
export interface CameraShakeConfig {
  intensity: number; // 震动强度
}

// 相机震动类
export default class CameraShake extends kokomi.Component {
  declare base: Experience;
  tweenedPosOffset: THREE.Vector3; // 缓动的位置偏移向量
  intensity: number; // 震动强度
  constructor(base: Experience, config: Partial<CameraShakeConfig> = {}) {
    super(base);

    // 解构配置参数，设置默认值
    const { intensity = 1 } = config;
    this.intensity = intensity;

    // 创建缓动的位置偏移向量
    const tweenedPosOffset = new THREE.Vector3(0, 0, 0);
    this.tweenedPosOffset = tweenedPosOffset;
  }

  // 更新函数
  update(): void {
    const t = this.base.clock.elapsedTime; // 获取当前时间
    // 计算随机位置偏移
    const posOffset = new THREE.Vector3(
      fbm({
        frequency: t * 0.5 + THREE.MathUtils.randFloat(-10000, 0), // 在 x 方向上的噪声
        amplitude: 2, // 振幅
      }),
      fbm({
        frequency: t * 0.5 + THREE.MathUtils.randFloat(-10000, 0), // 在 y 方向上的噪声
        amplitude: 2, // 振幅
      }),
      fbm({
        frequency: t * 0.5 + THREE.MathUtils.randFloat(-10000, 0), // 在 z 方向上的噪声
        amplitude: 2, // 振幅
      })
    );
    posOffset.multiplyScalar(0.1 * this.intensity); // 乘以震动强度
    // 使用 GSAP 库创建动画，平滑过渡相机位置
    gsap.to(this.tweenedPosOffset, {
      x: posOffset.x,
      y: posOffset.y,
      z: posOffset.z,
      duration: 1.2, // 动画持续时间
    });

    // 将震动位置偏移应用到相机位置
    this.base.camera.position.add(this.tweenedPosOffset);
  }

  // 设置震动强度
  setIntensity(value: number) {
    this.intensity = value;
  }
 
}
