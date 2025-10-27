import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

// Configure transport with better error handling
const transport = http('https://sepolia.base.org');

export const config = getDefaultConfig({
    appName: 'Simple DEX',
    projectId: '3227153babed58a3476df3966a694e12',
    chains: [baseSepolia],
    transports: {
        [baseSepolia.id]: transport,
    },
    ssr: true,
});