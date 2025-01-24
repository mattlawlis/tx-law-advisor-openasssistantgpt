'use client';

import { ChatbotConfig, Message, OpenAssistantGPTChat } from 'openassistantgpt';
import { useEffect, useState } from 'react';
import { SupportInquiry } from './components/inquiry';
import { Button } from './components/ui/button';

export default function ChatPage() {
  const [count, setMessagesCount] = useState(0);
  const [defaultMessage, setDefaultMessage] = useState('');

  const chatbot: ChatbotConfig = {
    id: '12345',
    name: 'OpenAssistantGPT',

    chatTitle: '',
    welcomeMessage:
      "Hello! I'm your dedicated assistant for Texas State Law. Whether you need guidance on specific statutes, help drafting legal documents, or insights into local ordinances, I'm here to provide accurate and detailed assistance. How may I help you?",
    chatMessagePlaceHolder: 'Type a message...',

    rightToLeftLanguage: false,

    bubbleColor: 'linear-gradient(to top left, #003366, #336699)',
    bubbleTextColor: '#FFFFFF',

    chatHeaderBackgroundColor: '#c01d33',
    chatHeaderTextColor: '#ffffff',

    chatbotReplyBackgroundColor: '#e4e4e7',
    chatbotReplyTextColor: '#000000',

    userReplyBackgroundColor: '#002868',
    userReplyTextColor: '#ffffff',

    chatbotLogoURL:
      'favicon.ico',
    chatInputStyle: 'default',

    chatHistoryEnabled: true,
    chatFileAttachementEnabled: true,

    displayFooterText: false,
    footerLink: 'https://www.openassistantgpt.io',
    footerTextName: 'OpenAssistantGPT',

    
    fontSize: '14px',

    messageSourceText: '',
    withChatMessageIcon: true,
  };

  useEffect(() => {
    console.log('Messages count:', count);
  }, [count]);

  function handleMessagesChange(messages: Message[]) {
    setMessagesCount(messages.length);
  }

  return (
    <OpenAssistantGPTChat
      chatbot={chatbot}
      path="/api/chat/assistant"
      defaultMessage={defaultMessage}
      withExitX={false}
      onMessagesChange={handleMessagesChange}
      extensions={[
        count == 0 && (
          <Button
            key="1"
            className="w-full bg-white"
            variant="outline"
            onClick={() =>
              setDefaultMessage('Will you assist me with drafting a Motion for Summary Judgment?')
            }
          >
            Will you assist me with drafting a Motion for Summary Judgment?
          </Button>
        ),
        count == 0 && (
          <Button
            key="2"
            className="w-full bg-white"
            variant="outline"
            onClick={() => setDefaultMessage('How do I write an employment contract for my Chief Financial Officer?')}
          >
            How do I write an employment contract for my Chief Financial Officer?
          </Button>
        ),
        count == 0 && (
          <Button
            key="3"
            className="w-full bg-white"
            variant="outline"
            onClick={() =>
              setDefaultMessage('Please explain homestead laws in Texas.')
            }
          >
            Please explain homestead laws in Texas.
          </Button>
        ),
        count == 0 && (
          <Button
            key="4"
            className="w-full bg-white"
            variant="outline"
            onClick={() => setDefaultMessage('What crimes do not have a statute of limitation in Texas?')}
          >
            What crimes do not have a statute of limitation in Texas?
          </Button>
        ),
        
      ]}
    />
  );
}
