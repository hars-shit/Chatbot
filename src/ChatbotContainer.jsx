// ChatbotContainer.jsx
import React, { useEffect, useState } from 'react';
import Chatbot from './Chatbot';
import './chatbotContainer.css';

const ChatbotContainer = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [expend, setExpend] = useState(false);
  const [shouldAutoPopup, setShouldAutoPopup] = useState(false);

  // Detect real screen size using matchMedia
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 481px)');

    const checkIsDesktop = () => {
      setShouldAutoPopup(mediaQuery.matches);
    };

    checkIsDesktop(); // initial run
    mediaQuery.addEventListener('change', checkIsDesktop);

    return () => {
      mediaQuery.removeEventListener('change', checkIsDesktop);
    };
  }, []);

  // 9-second popup only if desktop
  useEffect(() => {
    if (shouldAutoPopup) {
      const timer = setTimeout(() => setChatVisible(true), 9000);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoPopup]);

  // Listen for postMessage events
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
