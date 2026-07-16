import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [agentUrl, setAgentUrl] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || !agentUrl) {
      alert('Введите сообщение и URL агента');
      return;
    }

    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('https://agent-chat-backend.onrender.com/api/chat', {
        message: input,
        agent_url: agentUrl
      });

      setMessages(prev => [...prev, { 
        role: 'agent', 
        content: response.data.reply 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'agent', 
        content: '❌ Ошибка: ' + (error.response?.data?.detail || error.message) 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🧪 Тестирование мультиагентов</h1>
      
      <div className="config">
        <label>🔗 URL агента:</label>
        <input
          type="url"
          placeholder="https://your-agent.com/api/chat"
          value={agentUrl}
          onChange={(e) => setAgentUrl(e.target.value)}
          className="url-input"
        />
        <small>Вставьте сюда ссылку на вашего агента</small>
      </div>

      <div className="chat">
        {messages.length === 0 && (
          <div className="empty-chat">
            💬 Напишите сообщение, чтобы начать тестирование
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? '👤 Вы' : '🤖 Агент'}</strong>
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && <div className="loading">⏳ Агент печатает...</div>}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Введите сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="message-input"
        />
        <button onClick={sendMessage} disabled={loading} className="send-btn">
          Отправить
        </button>
      </div>
    </div>
  );
}

export default App;