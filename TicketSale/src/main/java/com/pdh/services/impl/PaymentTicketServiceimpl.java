package com.pdh.services.impl;

import com.pdh.repositories.PaymentTicketRepository;
import com.pdh.pojo.PaymentTicket;
import com.pdh.services.PaymentTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class PaymentTicketServiceimpl implements PaymentTicketService {
    @Autowired
    private PaymentTicketRepository paymentTicketRepository;
    @Override
    public void addPaymentTicket(PaymentTicket paymentTicket) {
        paymentTicketRepository.addPaymentTicket(paymentTicket);
    }
}

    
