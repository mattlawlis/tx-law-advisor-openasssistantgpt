import '@openassistantgpt/ui/dist/index.css';

import { Ubuntu } from 'next/font/google';

const inter = Ubuntu({ subsets: ['latin'] });

export const metadata = {
  title: 'Texas Law Advisor',
  description: 'Texas Law Advisor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
