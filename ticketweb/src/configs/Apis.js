import axios from "axios";
import cookie from 'react-cookies'

const BASE_URL = "http://localhost:8080/TicketSale/api/";

export const endpoints = {
    'events': 'events',
    'eventsByCateId': (cateId) => `categories/${cateId}`,
    'categories': 'categories',
    'eventDetail': (eventId) => `events/${eventId}`,
    'login': 'login',
    'register': 'register',
    'profile': 'secure/profile',
    'updateProfile': 'secure/profile',
    'changePassword': 'secure/password',
    'paymentProcess': 'secure/payment/process',
    'availableTickets': (eventId) => `${eventId}/tickets`,
    'paymentDetail': (paymentId) => `secure/payment/${paymentId}`,
    'myPayments': 'secure/payment/my',
    'myTickets': 'secure/payment/my/tickets',
    'organizerRequest': 'secure/organizer-request',
    'organizerRequestStatus': 'secure/organizer-request-status',
    'myEvents': 'secure/myEvents',
    'createEvent': 'secure/myEvents',
    'updateEvent': (eventId) => `secure/myEvents/${eventId}`,
    'deleteEvent': (eventId) => `secure/myEvents/${eventId}`,
    'eventSoldTickets': (eventId) => `secure/events/${eventId}/sold-tickets`,
    'eventRevenue': (eventId) => `secure/events/${eventId}/revenue`,
    'revenueEvents': 'secure/revenue/events',
    'revenueMonthly': 'secure/revenue/monthly',
    'revenueQuarterly': 'secure/revenue/quarterly',
    'revenueYearly': 'secure/revenue/yearly',
    'revenueOverall': 'secure/revenue/overall',
    'forgotPassword': 'forgot-password',
    'resetPassword': 'reset-password',
    'loginGoogle': 'login/google',
    'googleClientId': 'public/google-client-id'
}

export const authApis = () => {
    const token = cookie.load('token');
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
})