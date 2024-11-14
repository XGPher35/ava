import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      });
 
      const data = await response.json();
 
      if (response.ok) {
        // Use the primary response from the bot
        const botMessage = { 
          text: data.response,
          sender: 'bot',
          // Optionally store all responses if you want to use them later
          allResponses: data.all_responses 
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        setMessages(prev => [...prev, { 
          text: "Sorry, I couldn't process your request.", 
          sender: 'bot' 
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I couldn't reach the server.", 
        sender: 'bot' 
      }]);
    }
    
    setInput('');
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const renderMessageText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part.startsWith('http') ? part : `http://${part}`}
          target="_blank"
          rel="noopener noreferrer"
          className="neon-link"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };
 
  return (
    <div className="App">
      <h1>Mental Health Chatbot</h1>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <p>{renderMessageText(message.text)}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-btn">Send</button>
      </form>
    </div>
  );
}

export default App;

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);