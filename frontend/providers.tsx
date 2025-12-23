/*'use client';

import * as React from 'react';
import { RainbowKitProvider, getDefaultWallets, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { TrustWallet, LedgerWallet } from '@rainbow-me/rainbowkit/wallets';
import { http, WagmiProvider } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'Focus Flow',
  projectId: '019d803c2ecde40813a5d1bf5a3d5e44', // 随便填个字符串先
  chains: [hardhat], // 这里只连接本地 hardhat 链
  transports: {
    [hardhat.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}*/

'use client';

import * as React from 'react';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains'; // <--- 关键修改：引入 Arbitrum 测试网
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'Focus Flow',
  // 这里填你之前申请的 WalletConnect Project ID
  projectId: '019d803c2ecde40813a5d1bf5a3d5e44', 
  chains: [arbitrumSepolia], // <--- 关键修改：只允许连接 Arbitrum Sepolia
  transports: {
    [arbitrumSepolia.id]: http(), // 使用默认的公共 RPC 节点
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

