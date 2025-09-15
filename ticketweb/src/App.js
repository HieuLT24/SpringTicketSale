import React, { useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/layout/Header';
import Home from './components/Home';
import EventDetail from './components/EventDetail';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserProfile from './components/UserProfile';
import PaymentResult from './components/PaymentResult';
import PaymentsPage from './components/PaymentsPage';
import MyTicketsPage from './components/MyTicketsPage';
import Footer from './components/layout/Footer';
import { MyUserContext } from './configs/MyContexts';
import { MyUserReducer } from './reducers/MyUserReducer';
import cookie from 'react-cookies';
import { authApis, endpoints } from './configs/Apis';
import MyEvents from './components/MyEvents';
import EventDetailForOrganizer from './components/EventDetailForOrganizer';
import RevenueStatistics from './components/RevenueStatistics';
import ChatList from './components/chat/ChatList';
import ChatWindow from './components/chat/ChatWindow';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = cookie.load('token');
        if (!token) return;
        const res = await authApis().get(endpoints.profile);
        dispatch({ type: 'login', payload: res.data });
      } catch {
        dispatch({ type: 'logout' });
      }
    };
    bootstrapAuth();
  }, []);



  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <Router>
        <div className="App">
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/payment/result" element={<PaymentResult />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/secure/profile" element={<UserProfile />} />
            <Route path="/secure/payments" element={<PaymentsPage />} />
            <Route path="/secure/tickets" element={<MyTicketsPage />} />
            <Route path="/secure/events" element={<MyEvents />} />
            <Route path="/secure/events/:eventId" element={<EventDetailForOrganizer />} />
            <Route path="/secure/revenue" element={<RevenueStatistics />} />
            <Route path="/secure/messages" element={<ChatList />} />
            <Route path="/secure/messages/:chatId" element={<ChatWindow />} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </MyUserContext.Provider>
  );
}

export default App;
