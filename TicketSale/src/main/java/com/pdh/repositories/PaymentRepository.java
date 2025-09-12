/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.repositories;

import com.pdh.pojo.Payment;
import java.util.List;

/**
 *
 * @author duchi
 */
public interface PaymentRepository {

    Payment createPayment(Payment payment);

    Payment updatePayment(Payment payment);

    Payment getPaymentById(int id);

    List<Payment> getPaymentsByStatus(String status);

    Payment getPaymentByTransactionCode(String transactionCode);

    List<Payment> getPaymentsByUserId(int userId);
    
    double getTotalRevenue();
    long getTotalPayments();

}
