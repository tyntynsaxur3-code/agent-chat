import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input, time: 'только что' };
        setMessages([...messages, userMsg]);
        setInput('');
        setLoading(true);

        // Имитация ответа
        setTimeout(() => {
            const agentMsg = {
                role: 'agent',
                content: 'Это тестовый ответ. Подключи агента через бэкенд.',
                time: 'только что'
            };
            setMessages(prev => [...prev, agentMsg]);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="app">
            {/* ===== SIDEBAR ===== */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>💬 Диалоги</h2>
                    <button className="new-chat-btn">Новый чат</button>
                </div>
                <div className="chat-list">
                    <div className="chat-item active">
                        <div className="chat-avatar">🤖</div>
                        <div className="chat-info">
                            <div className="chat-name">Текущий диалог</div>
                            <div className="chat-preview">
                                {messages.length > 0
                                    ? messages[messages.length - 1].content.slice(0, 30) + '...'
                                    : 'Пусто'}
                            </div>
                        </div>
                        <div className="chat-time">сейчас</div>
                    </div>
                    <div className="chat-item">
                        <div className="chat-avatar">📌</div>
                        <div className="chat-info">
                            <div className="chat-name">Сохранённые</div>
                            <div className="chat-preview">Нет сообщений</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== MAIN CHAT ===== */}
            <div className="main">
                <div className="chat-header">
                    <h3>Чат с агентом</h3>
                    <span className="status">онлайн</span>
                </div>

                <div className="messages">
                    {messages.length === 0 && (
                        <div className="empty">
                            <div className="empty-icon">💬</div>
                            <p>Напишите сообщение</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`msg ${msg.role}`}>
                            <div className="avatar">{msg.role === 'user' ? '👤' : '🤖'}</div>
                            <div className="bubble">
                                <div className="text">{msg.content}</div>
                                <div className="time">{msg.time}</div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="msg agent">
                            <div className="avatar">🤖</div>
                            <div className="bubble">
                                <div className="typing">● ● ●</div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="input-area">
                    <input
                        type="text"
                        placeholder="Сообщение..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage}>➤</button>
                </div>
            </div>
        </div>
    );
}

export default App;