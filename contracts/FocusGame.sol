// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FocusGame {
    // 记录每个玩家完成了多少次训练
    mapping(address => uint256) public gamesCompleted;
    // 记录每个玩家的最高分（秒数，越低越好）
    // 0 表示还没玩过
    mapping(address => uint256) public bestScore;

    // 定义一个事件：当有人完成游戏时，通知前端放烟花
    event GameFinished(address indexed player, uint256 score, uint256 newBest);

    // 玩家完成游戏后调用这个函数，把分数传上来
    function submitGameResult(uint256 score) external {
        require(score > 0, "Score must be valid");

        // 1. 增加完成次数
        gamesCompleted[msg.sender] += 1;
        
        // 2. 更新最高分逻辑
        uint256 currentBest = bestScore[msg.sender];
        if (currentBest == 0 || score < currentBest) {
            bestScore[msg.sender] = score;
            currentBest = score;
        }

        // 3. 发出事件
        emit GameFinished(msg.sender, score, currentBest);
    }
}
