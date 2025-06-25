import React, { useEffect, useRef, useState } from 'react';
import Chatbot from './Chatbot';
import './chatbotContainer.css';

const ChatbotContainer = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [expend, setExpend] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const isDesktopSizedIframe = () => {
      const width = containerRef.current?.offsetWidth || 0;
      return width >= 400;
    };

    const hasPopupShown = localStorage.getItem('chatbotAutoPopupShown');

    if (isDesktopSizedIframe() && !hasPopupShown) {
      const timer = setTimeout(() => {
        setChatVisible(true);
        localStorage.setItem('chatbotAutoPopupShown', 'true');
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Message handling from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      const { chatbotClosed, expend, triggerPopup } = event.data || {};
      if (chatbotClosed) setChatVisible(false);
      if (typeof expend === 'boolean') setExpend(expend);
      if (triggerPopup) setChatVisible(true);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleToggleClick = () => setChatVisible((prev) => !prev);

  return (
    <div ref={containerRef}>
      {chatVisible && (
        <div
          id="chat-widget"
          className="chat-visible"
          style={{ width: expend ? '100vw' : '' }}
        >
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
