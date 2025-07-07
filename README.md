<!-- FINAL EMBADED CODE JULY 7 -->

<!-- <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>Chatbot Widget</title>

  <style>
    html, body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }

    #chat-widge {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      overflow: hidden;
    }

    /* Initial: hidden/minimized */
    #chat-widge.minimized {
      width: 150px;
      height: 120px;
    }

    /* Normal (chat open) */
    #chat-widge.normal {
      width: 400px;
      height: 100%;
      max-height: 95vh;
    }

    /* Expanded fullscreen (desktop) */
    #chat-widge.expanded {
      width: 30vw;
      height: 100dvh;
    }

    /* Mobile overrides */
    @media (max-width: 480px) {
      #chat-widge.normal {
        width: 90vw;
        height: 100dvh;
      }

      #chat-widge.expanded {
        width: 90vw;
        height: 88dvh;
      }

      #chat-widge.minimized {
        width: 150px;
        height: 120px;
        right: 10px;
        bottom: 0;
      }
    }

    #chat-widge iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
  </style>
</head>
<body>

  <!-- Chatbot container -->
  <div id="chat-widge" class="minimized">
    <iframe
      src="https://staging.d26589d0nqbvmg.amplifyapp.com/"
      frameborder="0"
      allow="clipboard-write"
    ></iframe>
  </div>

  <!-- Listener to toggle chatbot size -->
  <script>
    window.addEventListener('message', (event) => {
      const data = event.data;
      const chatWidge = document.getElementById('chat-widge');

      if (typeof data === 'object' && 'chatbotVisible' in data) {
        chatWidge.classList.remove('minimized', 'normal', 'expanded');

        if (data.chatbotVisible) {
          const isMobile = window.innerWidth <= 480;
          if (data.chatbotExpend) {
            chatWidge.classList.add('expanded');
          } else {
            chatWidge.classList.add('normal');
          }
        } else {
          chatWidge.classList.add('minimized');
        }
      }
    });
  </script>

</body>
</html> -->
