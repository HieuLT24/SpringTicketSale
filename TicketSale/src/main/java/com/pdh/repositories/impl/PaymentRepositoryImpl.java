/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.repositories.impl;

import com.pdh.pojo.Payment;
import com.pdh.repositories.PaymentRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

import java.util.List;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author duchi
 */
@Repository
@Transactional
public class PaymentRepositoryImpl implements PaymentRepository{

    @Autowired
    private LocalSessionFactoryBean factory;
    
    @Override
    public Payment createPayment(Payment payment) {
        Session session = this.factory.getObject().getCurrentSession();
        session.persist(payment);
        return payment;
    }

    @Override
    public Payment updatePayment(Payment payment) {
        Session session = this.factory.getObject().getCurrentSession();
        session.merge(payment);
        return payment;
    }

    @Override
    public Payment getPaymentById(int id) {
        Session session = this.factory.getObject().getCurrentSession();
        return session.get(Payment.class, id);
    }

    @Override
    public List<Payment> getPaymentsByStatus(String status) {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Payment> q = b.createQuery(Payment.class);
        Root<Payment> root = q.from(Payment.class);
        q.select(root);
        q.where(b.equal(root.get("status"), status));
        return session.createQuery(q).getResultList();
    }

    @Override
    public Payment getPaymentByTransactionCode(String transactionCode) {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Payment> q = b.createQuery(Payment.class);
        Root<Payment> root = q.from(Payment.class);
        q.select(root);
        q.where(b.equal(root.get("transactionCode"), transactionCode));
        return session.createQuery(q).uniqueResult();
    }

    @Override
    public List<Payment> getPaymentsByUserId(int userId) {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Payment> q = b.createQuery(Payment.class);
        Root<Payment> root = q.from(Payment.class);
        q.select(root);
        q.where(b.equal(root.get("user").get("id"), userId));
        q.orderBy(b.desc(root.get("createdAt")));
        return session.createQuery(q).getResultList();
    }
    
}
