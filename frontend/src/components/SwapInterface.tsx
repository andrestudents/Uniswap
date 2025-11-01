/**
 * @deprecated This file is kept for backward compatibility.
 * Please use the new modular structure in @/components/swap/SwapInterface
 *
 * The component has been refactored following atomic design principles:
 * - Atoms: Basic UI elements (Card, TokenIcon, Badge, LoadingSpinner)
 * - Molecules: Composite components (TokenDisplay, AmountInput, SwapButton, etc.)
 * - Organisms: Complex sections (SwapCard, PoolInfoCard, ConnectWalletPrompt)
 * - Hooks: Custom logic (useSwap, useTokenBalance, usePoolReserves)
 * - Utils: Helper functions and types
 */

export { SwapInterface } from './swap/SwapInterface';