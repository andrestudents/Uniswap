// MyButton.tsx
import { extendVariants, Button } from "@heroui/react";

export const MyButton = extendVariants(Button, {
    variants: {
        // 🎨 color variants
        color: {
            olive:
                "bg-[#84cc16] text-black hover:bg-[#65a30d] hover:scale-105 active:scale-95 transition-all duration-200",
            orange:
                "bg-[#ff8c00] text-white hover:bg-[#ff7a00] hover:scale-105 active:scale-95 transition-all duration-200",
            violet:
                "bg-[#8b5cf6] text-white hover:bg-[#7c3aed] hover:scale-105 active:scale-95 transition-all duration-200",
            sky: "bg-sky-500 text-white hover:bg-sky-600 hover:scale-105 active:scale-95 transition-all duration-200",
            pink:
                "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200",
            teal:
                "bg-gradient-to-r from-teal-400 to-emerald-500 text-white hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200",
        },

        // 🧱 style variants
        variantStyle: {
            solid: "",
            outline:
                "bg-transparent border border-current hover:bg-black/5 text-current hover:scale-105 active:scale-95 transition-all duration-200",
            ghost:
                "bg-transparent hover:bg-gray-100 text-current hover:scale-105 active:scale-95 transition-all duration-200",
            glow:
                "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-400/30 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all duration-300",
        },

        // 🚫 disabled
        isDisabled: {
            true: "bg-[#eaeaea] text-[#000] opacity-50 cursor-not-allowed pointer-events-none scale-100",
        },

        // 📏 size variants
        size: {
            xs: "px-2 min-w-12 h-6 text-tiny gap-1 rounded-small",
            sm: "px-3 min-w-16 h-8 text-small gap-1.5 rounded-small",
            md: "px-4 min-w-20 h-10 text-small gap-2 rounded-small",
            lg: "px-6 min-w-24 h-12 text-medium gap-3 rounded-medium",
            xl: "px-8 min-w-28 h-14 text-large gap-4 rounded-large",
        },
    },

    // 🧩 default setup
    defaultVariants: {
        color: "teal",
        size: "md",
        variantStyle: "solid",
    },

    // ⚙️ combined states
    compoundVariants: [
        {
            isDisabled: true,
            color: "olive",
            class: "bg-[#84cc16]/80 opacity-100",
        },
        {
            variantStyle: "outline",
            color: "violet",
            class:
                "border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/10 hover:scale-105 active:scale-95 transition-all",
        },
    ],
});
