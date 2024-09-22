import '@openassistantgpt/ui/dist/index.css';

import localFont from 'next/font/local'
 
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
    <html lang="en" className={myFont.className}>
      <script>
        function sendHeight() {
          var height = document.documentElement.scrollHeight;
          parent.postMessage({ iframeHeight: height }, '*');
        }
        window.addEventListener('load', sendHeight);
        window.addEventListener('resize', sendHeight);
      </script>
      <body>{children}</body>
    </html>
  );
}
