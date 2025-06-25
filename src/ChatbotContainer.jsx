// ChatbotContainer.jsx
import React, { useEffect, useState } from 'react';
import Chatbot from './Chatbot';
import './chatbotContainer.css';

const ChatbotContainer = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [expend, setExpend] = useState(false);
  const [shouldAutoPopup, setShouldAutoPopup] = useState(false);

  // Check parent window width (if not cross-origin restricted)
  useEffect(() => {
    const checkParentIsDesktop = () => {
      try {
        const parentWidth = window.top.innerWidth;
        setShouldAutoPopup(parentWidth > 480);
      } catch (e) {
        // Fallback to iframe size if cross-origin
        setShouldAutoPopup(window.innerWidth > 480);
      }
    };

    checkParentIsDesktop();
    window.addEventListener("resize", checkParentIsDesktop);
    return () => window.removeEventListener("resize", checkParentIsDesktop);
  }, []);

  // 9 second auto-popup if allowed
  useEffect(() => {
    if (shouldAutoPopup) {
      const timer = setTimeout(() => setChatVisible(true), 9000);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoPopup]);

  // Handle postMessage from iframe if any
  useEffect(() => {
    const handleMessage = (event) => {
      const { chatbotClosed, expend, triggerPopup } = event.data || {};
      if (chatbotClosed) setChatVisible(false);
      if (typeof expend === 'boolean') setExpend(expend);
      if (triggerPopup) setChatVisible(true);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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
    </>
  );
};

export default ChatbotContainer;
