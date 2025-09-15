import React, { useContext, useEffect, useState } from 'react';
import { ListGroup, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MyUserContext } from '../../configs/MyContexts';
import { subscribeToUserChats, subscribeToUserChatsMany, normalizeUserId } from '../../services/chatService';

const ChatList = () => {
  const [user] = useContext(MyUserContext);
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const possibleIds = [user.id].filter(Boolean);
    const unsub = subscribeToUserChatsMany(possibleIds, (items) => {
      setChats((prev) => {
        const byId = new Map();
        [...prev, ...items].forEach((it) => byId.set(it.id, it));
        return Array.from(byId.values()).sort((a, b) => {
          const ta = a.lastMessageTimestamp?.toMillis ? a.lastMessageTimestamp.toMillis() : 0;
          const tb = b.lastMessageTimestamp?.toMillis ? b.lastMessageTimestamp.toMillis() : 0;
          return tb - ta;
        });
      });
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [user]);

  if (!user) {
    return (
      <Alert variant="warning" className="m-3">
        Vui lòng đăng nhập để xem tin nhắn.
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h4 className="mb-3">Tin nhắn</h4>
      {chats.length === 0 ? (
        <Alert>Chưa có đoạn chat nào.</Alert>
      ) : (
        <ListGroup>
          {chats.map((c) => {
            const myIds = [user.id].map((v) => normalizeUserId(v));
            const otherId = (c.participants || []).find((p) => !myIds.includes((p || '').toLowerCase()));
            const displayName = c.participantProfiles?.[otherId]?.name || otherId || 'Người dùng';
            return (
              <ListGroup.Item
                key={c.id}
                action
                onClick={() => navigate(`/secure/messages/${c.id}`)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">{displayName}</div>
                    <div className="text-muted small">{c.lastMessage || 'Bắt đầu cuộc trò chuyện'}</div>
                  </div>
                  <div className="text-nowrap text-muted small">
                    {c.lastMessageTimestamp?.toDate ? new Date(c.lastMessageTimestamp.toDate()).toLocaleString('vi-VN') : ''}
                  </div>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </div>
  );
};

export default ChatList;


