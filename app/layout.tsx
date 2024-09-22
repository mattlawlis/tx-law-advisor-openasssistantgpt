import '@openassistantgpt/ui/dist/index.css';

import localFont from 'next/font/local'
import { Html, Head, Main, NextScript } from 'next/document';
 
// Font files can be colocated inside of `app`
const myFont = localFont({
  src: './TX-Law-Advisor-Regular.ttf',
  display: 'swap',
})

export const metadata = {
  title: 'TX Law Advisor',
  description: 'Chatbot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Html lang="en" className={myFont.className}>
      <Head>
        <script>
          {`
            function sendHeight() {
              var height = document.documentElement.scrollHeight;
              parent.postMessage({ iframeHeight: height }, '*');
            }
            window.addEventListener('load', sendHeight);
            window.addEventListener('resize', sendHeight);
          `}
        </script>
      </Head>
      <body>
        <Main />
        <NextScript />
        {children}
      </body>
    </Html>
  );
}
