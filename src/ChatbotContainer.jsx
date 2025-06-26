import React, { useEffect, useRef, useState } from 'react';
import Chatbot from './Chatbot';
import './chatbotContainer.css';

const ChatbotContainer = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [expend, setExpend] = useState(false);
  const containerRef = useRef(null);

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

  // Communicate visibility and expansion to parent
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
