export interface TokenInfo {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
}

export const TOKENS: Record<string, TokenInfo> = {
    TOKEN_A: {
        address: '0x4986FD8AdF774dB53FD17c8b91fF17E78a0e3C25',
        name: 'Token A',
        symbol: 'TKA',
        decimals: 18,
    },
    TOKEN_B: {
        address: '0x0c68B8a31A0a681f0A4B0cC394F029b8D8fd3718',
        name: 'Token B',
        symbol: 'TKB',
        decimals: 18,
    },
};

export const SIMPLE_SWAP_ADDRESS = '0x22af5d693163795E26fFfB4Ae82C12E9b5243212';

