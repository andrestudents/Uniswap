export interface Token {
    address: string;
    symbol: string;
    name: string;
}

export type SwapStep = 'idle' | 'approving' | 'swapping';
