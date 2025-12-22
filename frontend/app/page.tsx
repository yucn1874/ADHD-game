import SchulteGame from './components/SchulteGame';
import { Brain, Zap, Target } from 'lucide-react';

export default function Home() {
  return (
    
    <main className="min-h-screen bg-[#070f19] flex flex-col">
      
      {/* 游戏主区域 */}
      <SchulteGame />

      {/* --- ADHD 知识科普区 --- */}
      <div className="w-full max-w-md mx-auto px-6 pb-12 text-slate-400 text-sm space-y-8">
        
        {/* 分隔线 */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"></div>

        <div className="space-y-6">
           <div className="flex gap-4 items-start">
              <div className="bg-slate-800 p-2 rounded-lg shrink-0">
                 <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                 <h3 className="text-slate-200 font-bold mb-1">为什么玩这个?</h3>
                 <p className="leading-relaxed text-slate-500">
                   舒尔特方格 (Schulte Grid) 是全球公认的专注力训练法。
                   通过快速搜寻数字，能够有效激活大脑的前额叶皮层，改善 ADHD 患者的<span className="text-blue-400">视觉广度</span>和<span className="text-blue-400">注意力稳定性</span>。
                 </p>
              </div>
           </div>

           <div className="flex gap-4 items-start">
              <div className="bg-slate-800 p-2 rounded-lg shrink-0">
                 <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                 <h3 className="text-slate-200 font-bold mb-1">心流体验</h3>
                 <p className="leading-relaxed text-slate-500">
                   我们引入了连击 (Combo) 和即时反馈机制，帮助你快速进入<span className="text-yellow-400">心流状态 (Flow)</span>。
                   对于 ADHD 大脑来说，这种高频的即时奖励是保持专注的最佳燃料。
                 </p>
              </div>
           </div>

           <div className="flex gap-4 items-start">
              <div className="bg-slate-800 p-2 rounded-lg shrink-0">
                 <Target className="w-5 h-5 text-green-400" />
              </div>
              <div>
                 <h3 className="text-slate-200 font-bold mb-1">链上成就</h3>
                 <p className="leading-relaxed text-slate-500">
                   你的每一次训练成绩都会被永久记录在 Arbitrum 区块链上。
                   这不是简单的数字，而是你每一次<span className="text-green-400">战胜分心</span>的不可篡改的勋章。
                 </p>
              </div>
           </div>
        </div>

        {/* 底部版权 */}
        <div className="text-center pt-8 text-slate-600 text-xs">
           <p>© 2025 Focus Flow Hackathon Project</p>
           <p className="mt-1">Built with Next.js & yucn1874</p>
        </div>

      </div>
    </main>
  );
}
