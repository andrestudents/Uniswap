// import type { Metadata } from 'next';
// import { Providers } from './providers';
// import './globals.css';

// export const metadata: Metadata = {
//   title: 'Simple DEX',
//   description: 'A simplified Uniswap clone',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }


import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Simple DEX',
  description: 'A simplified Uniswap clone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-950 text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}