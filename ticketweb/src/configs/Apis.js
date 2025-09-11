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
    'changePassword': 'secure/password'
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