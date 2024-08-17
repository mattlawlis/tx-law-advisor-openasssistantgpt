import '@openassistantgpt/ui/dist/index.css';

import { Archivo } from 'next/font/google';

const inter = Archivo({ subsets: ['latin'] });

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
