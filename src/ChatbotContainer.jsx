import React, { useEffect, useRef, useState } from 'react';
import Chatbot from './Chatbot';
import './chatbotContainer.css';

const ChatbotContainer = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [expend, setExpend] = useState(false);
  const containerRef = useRef(null);

  // 🔁 One-time auto popup after 9s
  useEffect(() => {
    const isLarge = containerRef.current?.offsetWidth >= 400;
    const hasShown = sessionStorage.getItem('chatbotAutoPopupShown');

    if (isLarge && !hasShown) {
      const timer = setTimeout(() => {
        setChatVisible(true);
        sessionStorage.setItem('chatbotAutoPopupShown', 'true');
      }, 9000);
      return () => clearTimeout(timer);
    }
  }, []);

  // 📤 Send chatbotVisible to parent for resizing
  useEffect(() => {
    window.parent.postMessage({ chatbotVisible: chatVisible }, '*');
    console.log('[Chatbot] postMessage sent:', chatVisible);
  }, [chatVisible]);

  // 👇 Toggle manually
  const handleToggleClick = () => {
    setChatVisible((prev) => !prev);
  };

  return (
    <div ref={containerRef}>
      {/* ✅ Always render to keep iframe interaction alive */}
      <div id="chat-widget" style={{ display: 'block' }}>
        <Chatbot
          setExpend={setExpend}
          expend={expend}
          botVisible={chatVisible}
          setBotVisible={setChatVisible}
        />
      </div>

      {/* 💬 Floating toggle button */}
      <div
        id="chat-toggle"
        className={chatVisible ? 'tooltip-hidden' : ''}
        onClick={handleToggleClick}
        style={{ cursor: 'pointer', position: 'fixed', bottom: '20px', right: '20px', zIndex: 10000 }}
      >
        <div className="tooltip">Chat with Sarah</div>
        <img
          src="https://storage.googleapis.com/msgsndr/anzT2So2oHAxu8AgUsf9/media/685552f41a74cd7572683608.png"
          alt="logo-chatbot"
          style={{ width: '60px', height: '60px' }}
        />
      </div>
    </div>
  );
};

export default ChatbotContainer;
