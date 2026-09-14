import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import api from "../../services/api";
import "./AIChat.css";

function AIChat() {

  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);


  const sendMessage = async (e) => {

    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    const currentMessage = message;

    setMessage("");
    setLoading(true);


    try {

      const response =
        await api.post(
          "/ai/ask",
          {
            message: currentMessage
          }
        );


      const newChat = {
        message: currentMessage,
        response: response.data.answer
      };


      setChats((previousChats) => [
        ...previousChats,
        newChat
      ]);


    } catch (error) {

      console.error(
        "AI ERROR:",
        error.response?.data ||
        error.message
      );


      const errorMessage =
        error.response?.data?.message ||
        "AI service is currently unavailable.";


      const newChat = {
        message: currentMessage,
        response: errorMessage
      };


      setChats((previousChats) => [
        ...previousChats,
        newChat
      ]);


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="ai-chat-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="ai-chat-header">

        <div className="ai-header-icon">
          🤖
        </div>

        <div>

          <h1>
            AI Study Assistant
          </h1>

          <p>
            Ask StudyNest AI anything about your studies.
          </p>

        </div>

        <div className="ai-status">
          <span></span>
          AI Online
        </div>

      </div>


      {/* ========================================
          CHAT CONTAINER
      ======================================== */}

      <div className="ai-chat-container">

        {chats.length === 0 && (

          <div className="ai-empty-chat">

            <div className="ai-welcome-icon">
              ✨
            </div>

            <h3>
              Welcome to StudyNest AI
            </h3>

            <p>
              Your personal learning assistant is ready.
            </p>


            <div className="ai-suggestions">

              <div className="ai-suggestion">
                <span>🐍</span>
                Explain Python inheritance
              </div>

              <div className="ai-suggestion">
                <span>⚡</span>
                Define JavaScript
              </div>

              <div className="ai-suggestion">
                <span>🧠</span>
                Give me 5 JavaScript MCQs
              </div>

              <div className="ai-suggestion">
                <span>⚛️</span>
                Explain React useState()
              </div>

              <div className="ai-suggestion">
                <span>📅</span>
                Create a 7-day Python study plan
              </div>

            </div>

          </div>

        )}


        {/* ========================================
            CHAT HISTORY
        ======================================== */}

        {chats.map((chat, index) => (

          <div
            className="ai-chat-message"
            key={index}
          >

            {/* USER */}

            <div className="ai-user-message">

              <div className="ai-message-avatar">
                👤
              </div>

              <div className="ai-message-content">

                <span className="ai-message-name">
                  You
                </span>

                <p>
                  {chat.message}
                </p>

              </div>

            </div>


            {/* AI */}

            <div className="ai-response-message">

              <div className="ai-message-avatar ai-avatar">
                🤖
              </div>

              <div className="ai-message-content">

                <span className="ai-message-name">
                  StudyNest AI
                </span>

                <div className="ai-markdown">

                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                  >
                    {chat.response}
                  </ReactMarkdown>

                </div>

              </div>

            </div>

          </div>

        ))}


        {/* ========================================
            LOADING
        ======================================== */}

        {loading && (

          <div className="ai-response-message">

            <div className="ai-message-avatar ai-avatar">
              🤖
            </div>

            <div className="ai-thinking">

              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>

        )}

      </div>


      {/* ========================================
          INPUT
      ======================================== */}

      <form
        onSubmit={sendMessage}
        className="ai-input-form"
      >

        <div className="ai-input-wrapper">

          <span className="ai-input-icon">
            ✨
          </span>

          <input
            type="text"
            placeholder="Ask StudyNest AI something..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            disabled={loading}
          />

        </div>


        <button
          type="submit"
          disabled={
            loading ||
            !message.trim()
          }
          className="ai-send-button"
        >

          {loading ? (
            "Thinking..."
          ) : (
            <>
              Ask AI
              <span>→</span>
            </>
          )}

        </button>

      </form>

    </div>

  );
}

export default AIChat;

// npm install react-markdown remark-gfm