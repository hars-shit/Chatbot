// ChatbotContainer.jsx
import React, { useEffect, useState } from 'react';
import Chatbot from './Chatbot';
import './chatbotContainer.css';

const ChatbotContainer = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [expend, setExpend] = useState(false);

  const isMobile = window.innerWidth <= 480;

  useEffect(() => {
    const handleMessage = (event) => {
      const { chatbotClosed, expend } = event.data || {};
      if (chatbotClosed) setChatVisible(false);
      if (typeof expend === 'boolean') setExpend(expend);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => setChatVisible(true), 9000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  const handleToggleClick = () => setChatVisible((prev) => !prev);

  return (
    <>
      {chatVisible && (
        <div
          id="chat-widget"
          className="chat-visible"
          style={{ width: expend ? '100vw' : '400px' }}
        >
          <Chatbot setExpend={setExpend} setBotVisible={setChatVisible} />
        </div>
      )}

      <div id="chat-toggle" className={chatVisible ? 'tooltip-hidden' : ''} onClick={handleToggleClick}>
        <div className="tooltip">Chat with Sarah</div>
        <img
          src="https://storage.googleapis.com/msgsndr/anzT2So2oHAxu8AgUsf9/media/685552f41a74cd7572683608.png"
          alt="logo-chatbot"
        />
      </div>
    </>
  );
};

export default ChatbotContainer;

