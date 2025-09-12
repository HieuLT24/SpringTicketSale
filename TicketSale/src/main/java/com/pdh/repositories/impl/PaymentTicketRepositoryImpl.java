package com.pdh.repositories.impl;

import com.pdh.repositories.PaymentTicketRepository;
import com.pdh.pojo.PaymentTicket;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class PaymentTicketRepositoryImpl implements PaymentTicketRepository {
    @Autowired
    private LocalSessionFactoryBean factory;
    @Override
    public void addPaymentTicket(PaymentTicket paymentTicket) {
        Session session = this.factory.getObject().getCurrentSession();
        session.persist(paymentTicket);
    }
    
}
