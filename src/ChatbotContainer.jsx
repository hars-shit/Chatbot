import React, { useEffect, useRef, useState } from 'react';
import Chatbot from './Chatbot';
import './chatbotContainer.css';

const ChatbotContainer = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [expend, setExpend] = useState(false);
  const containerRef = useRef(null);

  // One-time auto popup after 9 sec
  useEffect(() => {
    const isDesktopSizedIframe = () => {
      const width = containerRef.current?.offsetWidth || 0;
      return width >= 400;
    };

    const hasPopupShown = sessionStorage.getItem('chatbotAutoPopupShown');

    if (isDesktopSizedIframe() && !hasPopupShown) {
      const timer = setTimeout(() => {
        setChatVisible(true); // This will trigger the postMessage below
        sessionStorage.setItem('chatbotAutoPopupShown', 'true');
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Send message to parent for resizing
  useEffect(() => {
    // Ensure this runs even on initial render
    window.parent.postMessage({ chatbotVisible: chatVisible }, '*');
  }, [chatVisible]);

  const handleToggleClick = () => setChatVisible(prev => !prev);

  return (
    <div ref={containerRef}>
      {/* Always render the widget container so useEffect can run */}
      <div
        id="chat-widget"
        style={{ display: chatVisible ? 'block' : 'none', width: expend ? '100vw' : '' }}
      >
        <Chatbot
          setExpend={setExpend}
          expend={expend}
          botVisible={chatVisible}
          setBotVisible={setChatVisible}
        />
      </div>

      {/* Toggle Button */}
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
