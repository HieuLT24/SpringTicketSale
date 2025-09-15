import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { MyUserContext } from '../../configs/MyContexts';
import { subscribeToMessages, sendMessage } from '../../services/chatService';

const ChatWindow = () => {
  const { chatId } = useParams();
  const [user] = useContext(MyUserContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToMessages(chatId, (items) => {
      setMessages(items);
      setLoading(false);
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
        }
      });
    });
    return () => unsub && unsub();
  }, [chatId, user]);

  const handleSend = async () => {
    if (!text.trim() || !user) return;
    const parts = chatId.split('_');
    const me = (String(user.id) || '').toLowerCase();
    const receiver = parts.find((p) => p !== me) || '';
    await sendMessage({ senderId: me, senderName: user.name || user.username || user.fullname || me, receiverId: receiver, receiverName: '', text: text.trim() });
    setText('');
  };

  if (!user) {
    return (
      <Alert variant="warning" className="m-3">
        Vui lòng đăng nhập để nhắn tin.
      </Alert>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <div className="d-flex align-items-center mb-3">
        <Button variant="light" className="me-2" onClick={() => navigate('/secure/messages')}>←</Button>
        <h5 className="mb-0">Cuộc trò chuyện</h5>
      </div>

      <div ref={containerRef} className="border rounded p-3 mb-3" style={{ height: 480, overflowY: 'auto', background: '#f9fafb' }}>
        {loading ? (
          <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>
        ) : (
          messages.map((m) => {
            const myId = (String(user.id) || '').toLowerCase();
            const mine = (m.senderId || '').toLowerCase() === myId;
            return (
              <div key={m.id} className={`d-flex mb-2 ${mine ? 'justify-content-end' : 'justify-content-start'}`}>
                <div className={`p-2 rounded ${mine ? 'bg-primary text-white' : 'bg-light'}`} style={{ maxWidth: '75%' }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                  <div className="small text-muted mt-1" style={{ opacity: 0.8 }}>
                    {m.timestamp?.toDate ? new Date(m.timestamp.toDate()).toLocaleString('vi-VN') : ''}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <InputGroup>
        <Form.Control
          placeholder="Nhập tin nhắn..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <Button onClick={handleSend} disabled={!text.trim()}>Gửi</Button>
      </InputGroup>
    </div>
  );
};

export default ChatWindow;


