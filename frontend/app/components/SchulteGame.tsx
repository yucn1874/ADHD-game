'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Trophy, RefreshCw, BrainCircuit, Loader2, Play, Zap, Activity, Target } from 'lucide-react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import confetti from 'canvas-confetti';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../constants';

// 生成 grid 辅助函数 (支持不同尺寸)
const generateGrid = (size: number) => {
  const total = size * size;
  const array = Array.from({ length: total }, (_, i) => i + 1);
  // Fisher-Yates Shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function SchulteGame() {
  const { address, isConnected } = useAccount();
  
  // --- 游戏核心状态 ---
  const [gridSize, setGridSize] = useState(5); // 默认 5x5
  const [grid, setGrid] = useState<number[]>([]);
  const [nextNum, setNextNum] = useState(1);
  
  // --- 计时与状态 ---
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'playing' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [startTime, setStartTime] = useState<number>(0);
  const [time, setTime] = useState(0);
  
  // --- 统计数据 ---
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [avgReaction, setAvgReaction] = useState(0); // 平均反应时间
  
  // --- UI 反馈 ---
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 链上交互
  const { data: bestScore } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'bestScore',
    args: address ? [address] : undefined,
  });
  const { data: hash, writeContract, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // 音效
  const playSound = (type: 'pop' | 'error' | 'win' | 'tick') => {
    try {
      const audio = new Audio(`/${type}.mp3`);
      if (type === 'pop') audio.volume = 0.4;
      if (type === 'error') audio.volume = 0.5;
      if (type === 'win') audio.volume = 0.6;
      if (type === 'tick') audio.volume = 0.3; // 倒计时声音
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  // 启动流程：点击开始 -> 倒计时 -> 游戏开始
  const startSequence = () => {
    setGameState('countdown');
    setCountdown(3);
    playSound('tick');
    
    const interval = setInterval(() => {
        setCountdown(prev => {
            if (prev === 1) {
                clearInterval(interval);
                startGameReal();
                return 0;
            }
            playSound('tick');
            return prev - 1;
        });
    }, 800);
  };

  const startGameReal = () => {
    setGrid(generateGrid(gridSize));
    setNextNum(1);
    setTime(0);
    setCombo(0);
    setMaxCombo(0);
    setMistakes(0);
    setGameState('playing');
    setStartTime(Date.now());
    setLastClickTime(Date.now());
    playSound('pop'); // Go!

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTime((Date.now() - Date.now()) / 1000); // 这里只是占位，实际更新在 useEffect
    }, 50);
  };

  const handleTap = (num: number, id: string) => {
    if (gameState !== 'playing') return;

    const btn = document.getElementById(id);
    const now = Date.now();

    if (num === nextNum) {
      // --- 点对了 ---
      playSound('pop');
      
      // 计算连击
      if (now - lastClickTime < 1500) { // 1.5秒内算连击
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > maxCombo) setMaxCombo(newCombo);
        
        // 连击飘字
        if (newCombo > 1) {
            setFeedbackText(`${newCombo} COMBO! 🔥`);
            setTimeout(() => setFeedbackText(null), 500);
        }
      } else {
        setCombo(1);
      }
      setLastClickTime(now);

      // 检查通关
      const totalTarget = gridSize * gridSize;
      if (num === totalTarget) {
        endGame();
      } else {
        setNextNum(prev => prev + 1);
      }
    } else {
      // --- 点错了 ---
      playSound('error');
      setCombo(0);
      setMistakes(prev => prev + 1);
      setFeedbackText("MISS! ❌");
      setTimeout(() => setFeedbackText(null), 500);
      
      if (btn) {
        btn.classList.add('animate-shake');
        setTimeout(() => btn.classList.remove('animate-shake'), 300);
      }
    }
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    const totalTargets = gridSize * gridSize;
    const avg = totalTime / totalTargets; // 计算平均反应时间
    
    setAvgReaction(avg);
    setTime(totalTime);
    setGameState('finished');
    playSound('win');
    
    // 难度调节逻辑
    if (totalTime < 20 && gridSize < 6) setGridSize(prev => prev + 1); // 太快了，加难
    else if (totalTime > 40 && gridSize > 3) setGridSize(prev => prev - 1); // 太慢了，减易

    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#60a5fa', '#3b82f6', '#facc15', '#ffffff']
    });

    if (isConnected) {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'submitGameResult',
            args: [BigInt(Math.floor(totalTime))],
        });
    }
  };

  // 计时器同步
  useEffect(() => {
    if (gameState === 'playing' && startTime) {
        timerRef.current = setInterval(() => {
            setTime((Date.now() - startTime) / 1000);
        }, 50);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, startTime]);

  // 根据网格大小计算 grid-cols 类名
  const getGridCols = () => {
      if (gridSize === 4) return 'grid-cols-4';
      if (gridSize === 6) return 'grid-cols-6';
      return 'grid-cols-5'; // default
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 pt-10 font-sans overflow-hidden selection:bg-blue-500/30 relative">
      
      {/* 背景光晕 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[100px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[100px] rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Combo 反馈 */}
      <AnimatePresence>
        {feedbackText && (
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1.2 }}
                exit={{ opacity: 0, y: -50 }}
                className="absolute top-1/3 z-50 pointer-events-none"
            >
                <span className={`text-4xl font-black italic drop-shadow-lg ${feedbackText.includes('❌') ? 'text-red-500' : 'text-yellow-400'}`}>
                    {feedbackText}
                </span>
            </motion.div>
        )}
      </AnimatePresence>

      {/* 顶部导航 */}
      <div className="w-full max-w-md flex justify-between items-center mb-8 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
             <h1 className="text-xl font-bold leading-none">Focus Flow</h1>
             <p className="text-[10px] text-slate-400 uppercase tracking-widest">Lv.{gridSize - 2} Training</p>
          </div>
        </div>
        <div className="scale-90 origin-right">
          <ConnectButton showBalance={false} accountStatus="avatar" chainStatus="none" />
        </div>
      </div>

      {/* 游戏主容器 */}
      <div className="w-full max-w-[380px] relative z-10">
        
        {/* 仪表盘 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
           <div className="col-span-1 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex flex-col items-center justify-center backdrop-blur-sm">
              <span className="text-slate-400 text-[10px] uppercase">Time</span>
              <span className="text-xl font-mono font-bold text-white">{time.toFixed(1)}s</span>
           </div>
           
           <div className="col-span-1 bg-blue-600 p-3 rounded-2xl border border-blue-400 flex flex-col items-center justify-center shadow-lg shadow-blue-600/20 transform scale-110 z-20">
              <span className="text-blue-100 text-[10px] uppercase">Target</span>
              <span className="text-3xl font-black text-white flex items-center gap-2">
                 {gameState === 'finished' ? <Trophy size={24}/> : nextNum}
              </span>
           </div>

           <div className="col-span-1 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex flex-col items-center justify-center backdrop-blur-sm">
              <span className="text-slate-400 text-[10px] uppercase">Combo</span>
              <motion.span 
                key={combo} 
                initial={{ scale: 1 }}
                animate={{ scale: combo > 1 ? [1, 1.2, 1] : 1 }}
                className={`text-xl font-bold ${combo > 2 ? 'text-yellow-400' : 'text-slate-500'}`}
              >
                x{combo}
              </motion.span>
           </div>
        </div>

        {/* 游戏区域 */}
        <div className="relative w-full aspect-square bg-slate-800/50 rounded-3xl border border-slate-700/50 p-3 shadow-2xl overflow-hidden">
          
          {/* 1. 开始界面 */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 z-30 bg-slate-900/80 backdrop-blur-sm rounded-3xl p-6 flex flex-col justify-center items-center text-center">
               <motion.div 
                 animate={{ scale: [1, 1.05, 1] }} 
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-600/40"
               >
                  <Play className="w-10 h-10 text-white ml-1" fill="white" />
               </motion.div>
               <h2 className="text-2xl font-bold text-white mb-3">Level {gridSize - 2}</h2>
               <p className="text-slate-400 text-sm mb-8 w-full leading-relaxed">
                 按顺序点击 <span className="text-white font-bold border-b border-blue-500">1 - {gridSize * gridSize}</span>
               </p>
               <button 
                 onClick={startSequence}
                 className="w-full max-w-[200px] py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-gray-100 active:scale-95 shadow-xl"
               >
                 开始挑战
               </button>
            </div>
          )}

          {/* 2. 倒计时动画 */}
          {gameState === 'countdown' && (
            <div className="absolute inset-0 z-40 bg-slate-900/90 backdrop-blur-md flex items-center justify-center rounded-3xl">
                <motion.span 
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    className="text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                >
                    {countdown}
                </motion.span>
            </div>
          )}

          {/* 3. 结算报告卡 */}
          {gameState === 'finished' && (
            <div className="absolute inset-0 z-30 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl p-6 text-center">
               <div className="w-full flex flex-col items-center">
                   <Trophy className="w-12 h-12 text-yellow-400 mb-2 drop-shadow-md" />
                   <h2 className="text-2xl font-bold text-white mb-4">训练完成!</h2>

                   {/* 详细数据面板 */}
                   <div className="grid grid-cols-2 gap-2 w-full mb-6">
                        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-[10px] uppercase mb-1">反应速度</p>
                            <p className="text-xl font-mono font-bold text-white">{avgReaction.toFixed(2)}s</p>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-[10px] uppercase mb-1">最大连击</p>
                            <p className="text-xl font-mono font-bold text-yellow-400">{maxCombo}</p>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-[10px] uppercase mb-1">失误</p>
                            <p className={`text-xl font-mono font-bold ${mistakes > 0 ? 'text-red-400' : 'text-green-400'}`}>{mistakes}</p>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-[10px] uppercase mb-1">最终耗时</p>
                            <p className="text-xl font-mono font-bold text-blue-400">{time.toFixed(2)}s</p>
                        </div>
                   </div>

                   <div className="mb-4 h-6 w-full flex items-center justify-center">
                      {!isConnected ? (
                          <span className="text-xs text-slate-500">链接钱包保存数据</span>
                      ) : isWritePending ? (
                          <span className="text-xs text-blue-400 flex items-center gap-2"><Loader2 className="animate-spin w-3 h-3"/> 请签名...</span>
                      ) : isConfirmed ? (
                          <span className="text-xs text-green-400 font-bold flex items-center gap-1">✅ 数据已上链</span>
                      ) : (
                          <span className="text-xs text-slate-500">等待提交...</span>
                      )}
                   </div>

                   <button 
                     onClick={startSequence}
                     className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl active:scale-95 shadow-lg"
                   >
                     <RefreshCw className="w-4 h-4" /> 继续训练 (Lv.{gridSize - 2})
                   </button>
               </div>
            </div>
          )}

          {/* 4. 网格主体 */}
          <div className={`grid ${getGridCols()} gap-2 w-full h-full`}>
            <AnimatePresence>
              {grid.map((num) => {
                const isClicked = num < nextNum;
                const isNext = num === nextNum;
                const btnId = `btn-${num}`;

                return (
                  <motion.button
                    id={btnId}
                    key={num}
                    layout
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ 
                        scale: isClicked ? 0.8 : 1, 
                        opacity: isClicked ? 0 : 1,
                        backgroundColor: isClicked ? '#1e293b' : '#334155'
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleTap(num, btnId)}
                    className={`
                      relative rounded-xl flex items-center justify-center font-bold select-none transition-all duration-200
                      ${gridSize === 6 ? 'text-lg' : 'text-xl sm:text-2xl'} 
                      ${isClicked 
                          ? 'pointer-events-none'
                          : 'cursor-pointer text-white shadow-[0_4px_0_0_rgba(15,23,42,0.5)] hover:brightness-110 border-t border-white/10 bg-slate-700'
                      }
                      ${isNext && gameState === 'playing' ? 'ring-2 ring-blue-500/50 z-10' : ''} 
                    `}
                  >
                    {num}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
