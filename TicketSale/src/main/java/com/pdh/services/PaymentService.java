/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.services;

import java.util.List;

import com.pdh.pojo.Payment;


/**
 *
 * @author duchi
 */

public interface PaymentService {
    
    Payment processPayment(Payment payment);

    Payment createPayment(Payment payment);

    Payment updatePayment(Payment payment);

    Payment getPaymentById(int id);

    Payment getPaymentByTransactionId(String transactionId);

    boolean verifyPayment(String transactionId);

    String createMoMoPaymentUrl(int paymentId, Double amount);

    String createVNPayPaymentUrl(int paymentId, Double amount);

    List<Payment> getPaymentsByUserId(int userId);
    
    double getTotalRevenue();
    long getTotalPayments();

}
