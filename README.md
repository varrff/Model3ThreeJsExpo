# [Model3ThreeJsExpo](https://github.com/varrff/Model3ThreeJsExpo)

通过Three.js创建一个互动的在线展示平台，可视化特斯拉Model 3的的部分技术。网站利用Three.js提供的API，实现了Model 3的三维模型展示、动画效果以及与用户交互的功能。

预览地址：http://model3.newhao2021.top/

github地址：

# 使用

安装依赖

```sh
pnpm i
```

本地调试

```sh
pnpm run dev
```

构建

```sh
pnpm run build
```

预览

```sh
pnpm run preview
```



# 关键概念

### Catmull-Rom样条曲线

Catmull-Rom样条曲线是一种平滑的插值曲线，可以用于创建自然的路径和轨迹。在Three.js中，`THREE.CatmullRomCurve3`类用于生成三维空间中的Catmull-Rom样条曲线。该曲线通过一组控制点进行插值，生成光滑的曲线，常用于动画路径、相机路径等。

这里使用了样条曲线创建了Autopilot部分的距离预警线

### 管道几何体（Tube Geometry）

管道几何体（Tube Geometry）是Three.js中用于创建沿着一条路径生成的管状三维几何体的类。这种几何体在表示道路、轨迹、隧道等需要具有实际厚度的三维结构时非常有用。下面我们将详细介绍管道几何体的概念、创建方法及其应用。

这里使用了样条曲线创建了FSD部分的行驶预测路线

# 代码部分

## src文件结构

```sh
- src
  - **global.d.ts**: TypeScript 声明文件，定义全局类型。
  - **main.ts**: 项目入口文件，初始化并启动 Three.js 场景。
  - **style.css**: 样式表，定义项目的基础样式。
  - **vite-env.d.ts**: 用于 Vite 构建工具的环境声明文件。

- Experience
  - **Debug.ts**: 调试工具文件，用于在开发过程中输出和检查调试信息。
  - **Experience.ts**: 核心文件，管理整个体验的初始化和更新逻辑。
  - **Postprocessing.ts**: 后处理文件，处理场景渲染后的效果，如色调映射和模糊等。
  - **resources.ts**: 资源管理文件，加载和管理所有外部资源，如纹理和模型。
  - Shaders
    - DynamicEnv
      - **frag.glsl**: 片元着色器，用于动态环境光照效果。
      - **vert.glsl**: 顶点着色器，用于动态环境光照效果的顶点处理。
    - ReflecFloor
      - **frag.glsl**: 片元着色器，实现反射地板效果。
      - **vert.glsl**: 顶点着色器，配合反射地板效果的顶点处理。
    - Speedup
      - **frag.glsl**: 片元着色器，用于加速效果的实现。
      - **vert.glsl**: 顶点着色器，用于加速效果的顶点处理。
    - TestObject
      - **frag.glsl**: 测试对象的片元着色器。
      - **vert.glsl**: 测试对象的顶点着色器。
  - Utils
    - **meshReflectorMaterial.ts**: 材质工具类，实现网格反射材质，用于模拟反射效果。
  - World
    - **CameraShake.ts**: 摄像机抖动效果文件。
    - **Car.ts**: 汽车部分。
    - **City.ts**: Autopilot部分文件。
    - **DynamicEnv.ts**: 动态环境文件，管理和更新动态环境光照。
    - **Furina.ts**: Furina 对象文件，定义特定模型及其行为。
    - **Road.ts**: FSD部分文件。
    - **Speedup.ts**: 加速效果文件。
    - **StartRoom.ts**: 起始房间对象文件。
    - **TestObject.ts**: 测试对象文件。
    - **World.ts**: 世界管理文件，负责加载和管理整个场景中的所有对象和效果。

```

## 首页部分

首页的加速流光效果以及相机抖动部分推荐alphardex大佬的文章：https://juejin.cn/post/7352762271003017252，也非常感谢大佬热心帮助我解决了部分问题。

## Autopilot部分（road.ts）

### `addExisting` 方法

这个方法用于将现有的模型添加到场景中，并启动动画。

- **加载模型**: 从`base.am.items`中获取已经加载的GLTF模型。
- **设置模型位置和缩放**: 调整模型的位置和缩放比例，使其适应场景。
- **添加模型到容器**: 将模型添加到当前组件的容器中。

### `run` 方法

负责启动模型的动画循环。

- **启动汽车运行**: 调用`carRun`方法开始汽车动画。
- **递归动画**: 使用`requestAnimationFrame`进行递归动画，每帧更新模型的位置。

### `carRun` 方法

用于处理汽车模型的动画效果。

- **克隆模型**: 使用`SkeletonUtils.clone`确保每次都是新的克隆对象。
- **设置材质**: 创建并应用新的材质，使汽车模型支持光照和反射。
- **创建护盾**: 调用`createShield`方法生成护盾效果。
- **添加汽车到容器**: 将新的汽车模型添加到容器中。
- **定义动画参数和函数**: 定义汽车动画的参数和递归动画函数`animateCar`。

### `createShield` 方法

用于创建护盾效果。

- **定义控制点**: 使用`THREE.Vector3`定义护盾的路径控制点。
- **创建曲线和几何体**: 用`THREE.CatmullRomCurve3`创建样条曲线，并生成对应的管道几何体。
- **创建材质和纹理**: 用Canvas创建线性渐变纹理，并应用到管道材质上。
- **设置动画**: 使用`gsap`实现护盾渐变动画和控制点的动态更新。

### `updateControlPoint` 方法

更新控制点的位置，使护盾效果更加动态。

- **递增或递减操作**: 根据目标值和步长更新控制点的x和z坐标。
- **更新曲线和几何体**: 更新样条曲线的控制点，并重新生成管道几何体。

### `removeAllModelsAndAnimations` 方法

用于移除所有模型并停止所有动画。

- **移除模型和对象**: 从容器中移除道路模型、管道和汽车模型，并释放相关资源。
- **停止动画循环**: 取消所有动画帧请求，停止动画。

### `playAuto` 方法

用于播放背景音乐。

- **加载和播放音乐**: 使用Howl.js库加载并播放背景音乐。



## FSD部分（city.ts）

### `setCar` 方法

用于设置汽车模型，目前只是加载了汽车模型数据。

### `createRoad` 方法

用于创建道路。

- **定义控制点**: 使用`THREE.Vector3`定义道路的路径控制点。
- **更新道路几何体**: 调用`updateRoadGeometry`方法，根据控制点创建道路几何体。
- **设置材质和动画**: 创建材质并使用GSAP动画库实现过渡动画。

### `updateRoadGeometry` 方法

更新道路几何体。

- **检查控制点**: 确认控制点存在。
- **创建曲线和几何体**: 用`THREE.CatmullRomCurve3`创建样条曲线，并生成管道几何体。
- **调整顶点位置**: 调整几何体顶点的y坐标。
- **创建材质和纹理**: 用Canvas创建线性渐变纹理，并应用到管道材质上。
- **更新或创建道路对象**: 更新现有道路对象的几何体或创建新的道路对象并添加到场景中。

### `updateControlPoint` 方法

更新控制点的位置，使道路效果更加动态。

- **递增或递减操作**: 根据目标值和步长更新控制点的x和z坐标。
- **更新道路几何体**: 调用`updateRoadGeometry`方法更新几何体。

### `runRoad` 方法

负责启动道路的动画。

- **定义多个动画步骤**: 使用GSAP库定义一系列动画，平滑地移动和旋转模型。
- **启动控制点动画**: 定义和启动控制点更新动画，使道路效果动态变化。

