import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import { FaPaperPlane, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';
import './App.css';

// Replace with your actual API key
const OPENAI_API_KEY = "your-api-key-here";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend to protect your API key
});

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [...messages, userMessage],
        temperature: 0.7,
      });

      const assistantMessage = response.choices[0].message;
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error calling OpenAI API:', err);
      setError('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Hannah's ChatGPT</h1>
        <p>Ask me anything!</p>
      </header>

      <main className="chat-container">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-icon">
                <FaRobot />
              </div>
              <h2>Welcome to Hannah's ChatGPT!</h2>
              <p>Start a conversation by typing a message below.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-icon">
                  {message.role === 'user' ? <FaUser /> : <FaRobot />}
                </div>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message assistant-message loading">
              <div className="message-icon">
                <FaRobot />
              </div>
              <div className="message-content">
                <FaSpinner className="spinner" />
              </div>
            </div>
          )}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            <FaPaperPlane />
          </button>
        </form>
      </main>

      <footer className="app-footer">
        <p>Created with ❤️ for Hannah</p>
      </footer>
    </div>
  );
}

export default App;
