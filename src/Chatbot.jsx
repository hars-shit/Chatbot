import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import { FaMinus } from 'react-icons/fa';
import { MdDone } from 'react-icons/md';
import Loader from './Loader';
import { CgExpand } from 'react-icons/cg';


const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const Chatbot = () => {
  const bodyRef = useRef(null);

  const scrollToBottom = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  };

  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      type: 'bot',
      text: "Hi, I’m Sarah, the Chippewa Valley assistant. I can help with immediate needs, planning ahead, finding obituaries, or answering general questions.",
      time: getTime(),
    },
    {
      id: Date.now(),
      type: 'bot',
      text: "",
      options: [
        "A loved one just passed",
        "I’m planning for the future",
        "Find an obituary",
        "I have a general question"
      ],
      time: getTime(),
    }
  ]);

  const [input, setInput] = useState('');
  const [expend,setExpend]=useState(false);
  
  const [botVisible, setBotVisible] = useState(true);

  const [contactId, setContactId] = useState(null);

  

  const get_unique_key = () => {
    return Math.random().toString(36).substring(2, 8)
  }
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.openChatbot) {
        setBotVisible(true);
      }
    };
  
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("hii")
      window.parent.postMessage({ expend }, "*");
    
  }, [expend]);

  const sendMessage = async (buttonText) => {
    const userMessage = (buttonText ?? input).trim();
    if (!userMessage) return;
    const userTime = getTime();
    const userId = Date.now();
    const loaderId = "loader-" + Date.now();

    // setMessages(prev => [
    //   ...prev,
    //   { id: userId, type: 'user', text: userMessage, time: userTime }
    // ]);
    setMessages(prev => [
      ...prev,
      { id: userId, type: 'user', text: userMessage, time: userTime },
      { id: loaderId, type: 'bot', loading: true, text: '', time: getTime() }
    ]);
    setInput('');

    // const ip = await getIPAddress();
    const unique_key = get_unique_key()
    const basePayload = {
      // payload data
      tags: "ai response,immediate need - entry",
      country: "US",
      message: {
        body: userMessage,
        type: 29,
      },
      location: {
        id: "anzT2So2oHAxu8AgUsf9",
        city: "Altoona",
        name: "Mortem AI ",
        state: "WI",
        address: "3023 N. 52nd Avenue East1717 Devney Dr, Altoona, ",
        country: "US",
        postalCode: "54720",
        fullAddress: "3023 N. 52nd Avenue East1717 Devney Dr, Altoona, , Altoona WI 54720",
      },
      workflow: {
        id: "b4e65058-83bd-460b-8a2c-255068af687c",
        name: "Customer Replied > Set Channel > Send Webhook",
      },
      full_name: "Guest Visitor qxdxg",
      last_name: `Visitor_${unique_key}`,
      customData: {},
      first_name: "Guest",
      triggerData: {},
      contact_type: "lead",
      date_created: new Date().toISOString(),
      full_address: "",
      Inbound_Reply: userMessage,
      Message_Reply: "",
      Reply_Channel: "Live_Chat",
      PreNeed_Location: "",
      Conversation_History: "",
      Immediate_Need_Location: ""
    };
    // first time we dont have cotact_id 
    const payload = contactId ? { ...basePayload, contact_id: contactId } : basePayload

    try {
      const res = await fetch('https://app.chippewavalleycremation.com/api/inbound/?bot=asst_zkMH7Fjxv166GWoqlYj20C1t', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let botReply;
      let returnedId;
      console.log("text", JSON.parse(text))

      try {
        const data = JSON.parse(text);
        botReply = data['reply'] || 'Sorry, something went wrong.';
        returnedId = data?.contact_id;

        // if(! contactId &&  returnedId){
        //   setContactId(returnedId)
        //   localStorage.setItem('mortem_contact_id',returnedId)
        // }
        if (!contactId && returnedId) {
          setContactId(returnedId);
        }
      } catch (parseErr) {
        console.warn('Non-JSON response:', text);
        botReply = text;
      }

      // setMessages(prev => [
      //   ...prev,
      //   { id: Date.now(), type: 'bot', text: botReply, time: getTime() }
      // ]);
      setMessages(prev => prev.map(msg =>
        msg.id === loaderId
          ? { ...msg, loading: false, text: botReply }
          : msg
      ));

    } catch (err) {
      console.error('Error:', err);
      // setMessages(prev => [
      //   ...prev,
      //   { id: Date.now(), type: 'bot', text: 'Failed to reach server.', time: getTime() }
      // ]);
      setMessages(prev => prev.map(msg =>
        msg.id === loaderId
          ? { ...msg, loading: false, text: 'Failed to reach server.' }
          : msg
      ));
    }
  };

  const handleClose = () => {
    setBotVisible(pre => !pre);
    window.parent.postMessage({ chatbotClosed: true }, "*")
  }

  const formatBotText = (text) => {
    if (!text) return "";

    const linkedText = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (match, text, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });

    return linkedText.replace(/\n/g, '<br>');
  }


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    botVisible &&
    <div className='main-container'>
      <div className='chatbot-main-container' style={expend ? {
          width: `${windowSize.width}px`,
          height: `${windowSize.height}px`,
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999
        } : {}}>

        <div className="chatbot-wrapper">
          <div className="chatbot-header">
          <div className='chatbot-header-1' onClick={()=>setExpend(pre=>!pre)}>
          <CgExpand style={{color:"white",fontSize:"22px"}} />
          </div>
          <div className='chatbot-header-2'>
            <div className='section-1'>
              <div style={{ alignSelf: "center" }}>
                <img src="./sarah.png" alt="Sarah" style={{ objectFit:"cover",objectPosition:"50% 15%",width: "40px", height: "40px", borderRadius: "50%" }} />
              </div>
              <div>
                <h3 style={{ fontSize: "24px", margin: 0 }}>Sarah</h3>
                <span className="chatbot-status">● AI Assistant</span>
              </div>
            </div>


            <div className='section-1'  >


              <div className="circle-toggle" onClick={() => handleClose()}>
                <FaMinus fontSize="10px" />
              </div>

            </div>
            </div>
          </div>

          <div className="chatbot-body" ref={bodyRef}>
            {messages?.map((msg, id) => (
              <div className={`${msg.type}`} key={id}>
                {msg?.type === 'bot' ? (
                  <>
                    <div className={`talk-bubble tri-right round btm-left`} style={expend ? {width:"75%"} : { width: "100%",maxWidth: "300px"}}>
                      <div className="talktext">{msg?.loading ? <Loader /> : <span dangerouslySetInnerHTML={{ __html: formatBotText(msg?.text) }} />}</div>

                      {
                        msg?.options && !msg?.loading && (
                          <div className='talk-options'>
                            {msg?.options.map((opt, idx) => (
                              <button key={idx}
                                onClick={() => sendMessage(opt)}
                              >
                                {idx + 1}. &nbsp;{opt}
                              </button>
                            ))}
                          </div>
                        )
                      }


                    </div>
                    <div className="message-container">
                      <div className="avatar">
                        <img src="./sarah.png" alt="bot" style={{ objectFit:"cover",objectPosition:"50% 15%", width: "40px", height: "40px", borderRadius: "50%" }} />
                      </div>
                      <div className="message-time-avatar">{msg.time}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="talk-bubble-user tri-right btm-right" style={expend ? {width:"75%"} : { width: "100%",maxWidth: "300px"}}>
                      <div className="talktext talk-user" style={{ color: "rgba(68, 68, 68, 1)" }}>
                        {msg.text}
                      </div>
                    </div>
                    <div className="message-container-user">
                      <div className="message-time-user">
                        {msg.time}&nbsp;<MdDone />

                      </div>

                      <div>
                        <img src="./user.png" alt="user" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            {/* <div ref={messageRef} /> */}
          </div>

          <div className="chatbot-input">
            <div className='inside-bot'>
              <input
                style={{ fontSize: "18px" }}
                type="text"
                placeholder="Type your message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="send-button" onClick={() => sendMessage()}>➤</button>
            </div>
          </div>
        </div>



      </div>
     
    </div>


  );
};

export default Chatbot;

