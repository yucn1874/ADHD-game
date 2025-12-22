# 🧠 Focus Flow ADHD 训练游戏
#  ADHD Focus Training Game

一个基于以太坊的专注力训练小游戏（舒尔特方格），前端使用 Next.js + RainbowKit + wagmi，合约使用 Hardhat/Igni­tion 部署。玩家每次完成训练都会把成绩上链，形成不可篡改的「专注勋章」。

一个为 ADHD / 注意力障碍用户 设计的 专注力训练 Web 游戏。  
通过节奏反馈、即时奖励与低干扰 UI，帮助用户在短时间内进入专注状态，并逐步延长有效注意力时长。

---

## ✨ 项目特点（Features）

- 🎯 专注力训练机制
  - 基于视觉搜索与反应时间的训练模型
  - 强调「短时专注 → 即时反馈 → 正向强化」

- 🔊 多感官即时反馈
  - 正确 / 错误 / 胜利音效反馈
  - 减少不确定性带来的注意力漂移

- 🧩 为 ADHD 友好设计
  - 极简界面，避免多余视觉干扰
  - 明确的目标、进度和完成感
  - 快速开始、低心理负担

- ⚡ 现代前端技术栈
  - 高性能、响应迅速
  - 适合长期功能迭代与实验


## 主要特性
- 舒尔特方格训练：动态难度（3~6 级网格），连击反馈、音效、心流体验。
- 链上记录：调用 `submitGameResult` 把完成时间写入合约，并更新个人最佳成绩。
- 即时反馈：连击飘字、烟花动画、平均反应时间/失误统计。
- 钱包集成：RainbowKit 一键连接（默认本地 Hardhat 链）。

## 目录结构
```
contracts/           智能合约（FocusGame.sol）
ignition/modules/    部署脚本（Hardhat Ignition）
frontend/            Next.js 前端
├─ app/              App Router 页面与组件（SchulteGame.tsx）
├─ constants.ts      前端使用的合约地址与 ABI
├─ providers.tsx     RainbowKit/wagmi 配置（默认 Hardhat 本地链）
artifacts/ cache/    Hardhat 构建缓存与产物
typechain-types/     自动生成的 TypeChain 类型
hardhat.config.ts    Hardhat 配置
```

## 快速开始
前置：Node.js 18+，推荐安装 pnpm 或 npm。

### 1) 安装依赖
```bash
# 根目录：合约/Hardhat
npm install

# 前端
cd frontend
npm install
```

### 2) 本地链与合约
```bash
# 启动本地 Hardhat 节点
npx hardhat node

# 新开终端，编译与部署（Igni­tion）
npx hardhat compile
npx hardhat ignition deploy ./ignition/modules/FocusGame.ts --network localhost
```
部署后记下输出的 `FocusGame` 地址，并更新 `frontend/constants.ts` 中的 `CONTRACT_ADDRESS`。

### 3) 运行前端
```bash
cd frontend
npm run dev
# 浏览器打开 http://localhost:3000
```
使用 RainbowKit 连接钱包（默认指向本地 Hardhat 链），开始训练并上链成绩。

## 合约接口概览
- `submitGameResult(uint256 score)`: 提交完成时间（秒）。内部会累计完成次数并在更优时更新 `bestScore`，同时触发 `GameFinished` 事件。
- `bestScore(address) -> uint256`: 查询指定地址的最佳成绩（秒，越低越好，0 表示未记录）。

## 前端提示
- 游戏逻辑位于 `frontend/app/components/SchulteGame.tsx`。
- 链接配置在 `frontend/providers.tsx`（当前链为 Hardhat）。若切换到测试网/主网，请更新链配置与 `CONTRACT_ADDRESS`。

## 常用命令速查
- `npx hardhat test`：运行合约测试。
- `npx hardhat node`：启动本地链。
- `npx hardhat ignition deploy ./ignition/modules/FocusGame.ts --network localhost`：部署合约。
- `npm run dev`（frontend）：启动前端开发服务器。



🧪 设计理念（Design Philosophy）

不是“玩得久”，而是“专注得深”
拒绝刷分、排行等容易引发焦虑的机制
用「完成感」代替「成瘾性」
将 ADHD 视为 注意力调度问题，而非能力问题

🧩 适用人群

ADHD / 注意力障碍用户
容易分心、难以进入状态的人
希望进行 短时专注训练 的学生或开发者
对认知训练、HCI、神经多样性感兴趣的开发者

📌 未来计划（Roadmap）
⏱ 可配置训练时长与难度
📊 专注力变化可视化
🌙 夜间 / 低刺激模式
🧠 不同认知训练模块（切换注意 / 抑制干扰等）
☁️ 用户本地/云端记录（可选）

🙌 致谢
本项目灵感来自：
ADHD 用户真实体验
认知科学与专注力训练研究
Human-Centered Design 理念
如果你对这个项目有建议或想法，欢迎交流。Email：yucangnan@gmail.com
