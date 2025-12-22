'use client';

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
}
