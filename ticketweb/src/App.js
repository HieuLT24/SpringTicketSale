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
            <Route path="/secure/profile" element={<UserProfile />} />
            <Route path="/secure/payments" element={<PaymentsPage />} />
            <Route path="/secure/tickets" element={<MyTicketsPage />} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </MyUserContext.Provider>
  );
}

export default App;
