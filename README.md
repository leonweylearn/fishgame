# 大鱼吃小鱼

一个基于 HTML5 Canvas 的网页小游戏。控制你的鱼吃掉比自己小的鱼来成长，同时躲避比自己大的鱼。

## 游戏玩法

- 吃掉比自己小的鱼 → 得分并变大
- 被比自己大 15% 以上的鱼碰到 → 游戏结束
- 鱼越大移动越慢，难度逐渐提升

**操作方式：** 方向键 或 `WASD`

## 运行方式

由于使用了 ES6 模块，需要通过 HTTP 服务器启动（浏览器禁止 `file://` 协议加载模块）。

```bash
# Node.js
npx serve .

# Python
python -m http.server 8080
```

然后打开 `http://localhost:3000`（或终端显示的端口）。

也可以使用 VS Code Live Server 插件：右键 `index.html` → Open with Live Server。

## 技术栈

纯 HTML5 Canvas + 原生 JS（ES6 模块）。无构建步骤，无外部依赖。

音乐由 Web Audio API 实时合成（C 五声音阶旋律 + 低音线），无需音频文件。

## 文件结构

```
fishgame/
├── index.html          # 入口页面
├── style.css           # 全屏 Canvas 样式
└── src/
    ├── main.js         # Canvas 初始化，游戏循环入口
    ├── game.js         # 状态机（start / running / gameover）
    ├── gameLoop.js     # requestAnimationFrame 循环，delta time 上限 100ms
    ├── input.js        # 键盘状态管理（isKeyDown）
    ├── playerFish.js   # 玩家实体：移动、成长
    ├── smallFish.js    # AI 鱼：游荡、碰墙反弹、边缘刷新
    ├── collision.js    # 圆形碰撞检测（circlesOverlap）
    ├── renderer.js     # Canvas 绘制：鱼形状、UI、覆盖层
    └── audio.js        # Web Audio API 背景音乐合成
```
