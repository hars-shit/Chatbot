import React, { useEffect, useRef, useState } from 'react';
import Chatbot from './Chatbot';
import './chatbotContainer.css';

const ChatbotContainer = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [expend, setExpend] = useState(false);
  const containerRef = useRef(null);
  const [contactId, setContactId] = useState(null);
  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      type: 'bot',
      text: "I'm here to attend to any need or situation you might have and provide you with guidance.",
      time: getTime(),
    },
    {
      id: Date.now(),
      type: 'bot',
      text: "",
      options: [
        "A loved one just passed",
        "Learn about pre-planning",
        "Find an obituary",
        "I have a general question"
      ],
      time: getTime(),
    }
  ]);
  // Auto popup after 9s
  useEffect(() => {
    const hasPopupShown = sessionStorage.getItem('chatbotAutoPopupShown');
    console.log('[Chatbot] Auto-popup logic running. Already shown:', hasPopupShown);

    if (!hasPopupShown) {
      const timer = setTimeout(() => {
        console.log('[Chatbot] Triggering auto-popup after 9s');
        setChatVisible(true);
        sessionStorage.setItem('chatbotAutoPopupShown', 'true');
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, []);

  
  useEffect(() => {
    window.parent.postMessage(
      { chatbotVisible: chatVisible, chatbotExpend: expend },
      '*'
    );
  }, [chatVisible, expend]);

  const handleToggleClick = () => {
    setChatVisible((prev) => !prev);
  };

  return (
    <div ref={containerRef}>
      {chatVisible && (
        <div id="chat-widget" className="chat-visible">
          <Chatbot
          messages={messages}
          setMessages={setMessages}
          contactId={contactId}
          setContactId={setContactId}
            setExpend={setExpend}
            expend={expend}
            botVisible={chatVisible}
            setBotVisible={setChatVisible}
          />
        </div>
      )}

      <div
        id="chat-toggle"
        className={chatVisible ? 'tooltip-hidden' : ''}
        onClick={handleToggleClick}
      >
        <div className="tooltip">Chat with Sarah</div>
        <img
          src="https://storage.googleapis.com/msgsndr/anzT2So2oHAxu8AgUsf9/media/685552f41a74cd7572683608.png"
          alt="logo-chatbot"
        />
      </div>
    </div>
  );
};

export default ChatbotContainer;
