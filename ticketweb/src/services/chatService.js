import { db } from '../configs/Firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';

const CHATS_COLLECTION = 'chats';

export const normalizeUserId = (raw) => {
  if (!raw) return '';
  return String(raw).trim().toLowerCase();
};

export const getChatIdForUsers = (userA, userB) => {
  const a = normalizeUserId(userA);
  const b = normalizeUserId(userB);
  return [a, b].sort().join('_');
};

export const ensureChatDocument = async (userA, userB, userAName, userBName) => {
  const chatId = getChatIdForUsers(userA, userB);
  const chatRef = doc(db, CHATS_COLLECTION, chatId);
  const snap = await getDoc(chatRef);
  if (!snap.exists()) {
    await setDoc(chatRef, {
      participants: [normalizeUserId(userA), normalizeUserId(userB)],
      participantProfiles: {
        [normalizeUserId(userA)]: { name: userAName || normalizeUserId(userA) },
        [normalizeUserId(userB)]: { name: userBName || normalizeUserId(userB) },
      },
      createdAt: serverTimestamp(),
      lastMessage: '',
      lastMessageTimestamp: serverTimestamp(),
    });
  } else {
    const data = snap.data() || {};
    const profiles = data.participantProfiles || {};
    const a = normalizeUserId(userA);
    const b = normalizeUserId(userB);
    const needUpdate = !profiles[a]?.name || !profiles[b]?.name;
    if (needUpdate) {
      await updateDoc(chatRef, {
        participantProfiles: {
          ...profiles,
          [a]: { name: userAName || profiles[a]?.name || a },
          [b]: { name: userBName || profiles[b]?.name || b },
        },
      });
    }
  }
  return chatId;
};

export const sendMessage = async ({ senderId, senderName, receiverId, receiverName, text }) => {
  const chatId = await ensureChatDocument(senderId, receiverId, senderName, receiverName);
  const messagesCol = collection(db, CHATS_COLLECTION, chatId, 'messages');
  await addDoc(messagesCol, {
    senderId: normalizeUserId(senderId),
    receiverId: normalizeUserId(receiverId),
    text,
    timestamp: serverTimestamp(),
  });
  const chatRef = doc(db, CHATS_COLLECTION, chatId);
  await updateDoc(chatRef, {
    lastMessage: text,
    lastMessageTimestamp: serverTimestamp(),
  });
  return chatId;
};

export const subscribeToMessages = (chatId, callback) => {
  const q = query(
    collection(db, CHATS_COLLECTION, chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
};

export const subscribeToUserChats = (userId, callback) => {
  const uid = normalizeUserId(userId);
  const q = query(
    collection(db, CHATS_COLLECTION),
    where('participants', 'array-contains', uid)
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
};

export const subscribeToUserChatsMany = (userIds, callback) => {
  const ids = Array.from(new Set((userIds || []).map(normalizeUserId).filter(Boolean)));
  const unsubs = ids.map((id) =>
    subscribeToUserChats(id, (items) => {
      callback(items.map((it) => ({ ...it })));
    })
  );
  return () => unsubs.forEach((u) => u && u());
};

export const fetchUserChatsOnce = async (userId) => {
  const uid = normalizeUserId(userId);
  const q = query(
    collection(db, CHATS_COLLECTION),
    where('participants', 'array-contains', uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};


