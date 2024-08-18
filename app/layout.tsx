import '@openassistantgpt/ui/dist/index.css';

import localFont from 'next/font/local'
 
// Font files can be colocated inside of `app`
const myFont = localFont({
  src: './TX-Law-Advisor-Regular.ttf',
  display: 'swap',
})

export const metadata = {
  title: 'George D. Reyes',
  description: 'Chatbot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  );
}
