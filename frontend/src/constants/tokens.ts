export interface TokenInfo {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
}

export const TOKENS: Record<string, TokenInfo> = {
    TOKEN_A: {
        address: '0x6A81F7012Cc52f5898bcBc09B936d258a750551e',
        name: 'Token A',
        symbol: 'TKA',
        decimals: 18,
    },
    TOKEN_B: {
        address: '0x01a8Fa1E4Dbde494F779fD6663E6Ded89D12313E',
        name: 'Token B',
        symbol: 'TKB',
        decimals: 18,
    },
};

export const SIMPLE_SWAP_ADDRESS = '0xCE01773C507Eef9Ffc3576e6ad97Fa02D3c0cde8';