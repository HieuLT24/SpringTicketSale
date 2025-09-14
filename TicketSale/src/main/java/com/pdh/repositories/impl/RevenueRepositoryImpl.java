package com.pdh.repositories.impl;

import com.pdh.pojo.EventShow;
import com.pdh.pojo.Payment;
import com.pdh.pojo.PaymentTicket;
import com.pdh.pojo.Ticket;
import com.pdh.repositories.RevenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;

import java.util.List;

@Repository
@Transactional
public class RevenueRepositoryImpl implements RevenueRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Object[]> getMonthlyRevenueStats(String username, String year) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);
        
        Root<Payment> paymentRoot = q.from(Payment.class);
        Join<Payment, PaymentTicket> paymentTicketJoin = paymentRoot.join("paymentTicketCollection");
        Join<PaymentTicket, Ticket> ticketJoin = paymentTicketJoin.join("ticketId");
        Join<Ticket, EventShow> eventJoin = ticketJoin.join("eventShowId");
        
        q.multiselect(
            b.function("YEAR", Integer.class, paymentRoot.get("createdAt")),
            b.function("MONTH", Integer.class, paymentRoot.get("createdAt")),
            b.sum(paymentRoot.get("totalAmount")),
            b.sum(b.literal(1L))
        );
        
        q.where(b.and(
            b.equal(paymentRoot.get("status"), "SUCCESS"),
            b.equal(eventJoin.get("organizer").get("username"), username),
            b.equal(b.function("YEAR", Integer.class, paymentRoot.get("createdAt")), Integer.parseInt(year))
        ));
        
        q.groupBy(
            b.function("YEAR", Integer.class, paymentRoot.get("createdAt")),
            b.function("MONTH", Integer.class, paymentRoot.get("createdAt"))
        );
        
        q.orderBy(b.asc(b.function("MONTH", Integer.class, paymentRoot.get("createdAt"))));
        
        return session.createQuery(q).getResultList();
    }

    @Override
    public List<Object[]> getQuarterlyRevenueStats(String username, String year) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);
        
        Root<Payment> paymentRoot = q.from(Payment.class);
        Join<Payment, PaymentTicket> paymentTicketJoin = paymentRoot.join("paymentTicketCollection");
        Join<PaymentTicket, Ticket> ticketJoin = paymentTicketJoin.join("ticketId");
        Join<Ticket, EventShow> eventJoin = ticketJoin.join("eventShowId");
        
        q.multiselect(
            b.function("YEAR", Integer.class, paymentRoot.get("createdAt")),
            b.function("QUARTER", Integer.class, paymentRoot.get("createdAt")),
            b.sum(paymentRoot.get("totalAmount")),
            b.sum(b.literal(1L))
        );
        
        q.where(b.and(
            b.equal(paymentRoot.get("status"), "SUCCESS"),
            b.equal(eventJoin.get("organizer").get("username"), username),
            b.equal(b.function("YEAR", Integer.class, paymentRoot.get("createdAt")), Integer.parseInt(year))
        ));
        
        q.groupBy(
            b.function("YEAR", Integer.class, paymentRoot.get("createdAt")),
            b.function("QUARTER", Integer.class, paymentRoot.get("createdAt"))
        );
        
        q.orderBy(b.asc(b.function("QUARTER", Integer.class, paymentRoot.get("createdAt"))));
        
        return session.createQuery(q).getResultList();
    }

    @Override
    public List<Object[]> getYearlyRevenueStats(String username) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);
        
        Root<Payment> paymentRoot = q.from(Payment.class);
        Join<Payment, PaymentTicket> paymentTicketJoin = paymentRoot.join("paymentTicketCollection");
        Join<PaymentTicket, Ticket> ticketJoin = paymentTicketJoin.join("ticketId");
        Join<Ticket, EventShow> eventJoin = ticketJoin.join("eventShowId");
        
        q.multiselect(
            b.function("YEAR", Integer.class, paymentRoot.get("createdAt")),
            b.sum(paymentRoot.get("totalAmount")),
            b.sum(b.literal(1L))
        );
        
        q.where(b.and(
            b.equal(paymentRoot.get("status"), "SUCCESS"),
            b.equal(eventJoin.get("organizer").get("username"), username)
        ));
        
        q.groupBy(b.function("YEAR", Integer.class, paymentRoot.get("createdAt")));
        q.orderBy(b.desc(b.function("YEAR", Integer.class, paymentRoot.get("createdAt"))));
        
        return session.createQuery(q).getResultList();
    }

    @Override
    public Double getTotalRevenueByOrganizer(String username) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Double> q = b.createQuery(Double.class);
        
        Root<Payment> paymentRoot = q.from(Payment.class);
        Join<Payment, PaymentTicket> paymentTicketJoin = paymentRoot.join("paymentTicketCollection");
        Join<PaymentTicket, Ticket> ticketJoin = paymentTicketJoin.join("ticketId");
        Join<Ticket, EventShow> eventJoin = ticketJoin.join("eventShowId");
        
        q.select(b.sum(paymentRoot.get("totalAmount")));
        
        q.where(b.and(
            b.equal(paymentRoot.get("status"), "SUCCESS"),
            b.equal(eventJoin.get("organizer").get("username"), username)
        ));
        
        Double result = session.createQuery(q).getSingleResult();
        return result != null ? result : 0.0;
    }

    @Override
    public Long getTotalTicketsSoldByOrganizer(String username) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Long> q = b.createQuery(Long.class);
        
        Root<Ticket> ticketRoot = q.from(Ticket.class);
        Join<Ticket, EventShow> eventJoin = ticketRoot.join("eventShowId");
        
        q.select(b.count(ticketRoot));
        
        q.where(b.and(
            b.equal(ticketRoot.get("status"), "SOLD"),
            b.equal(eventJoin.get("organizer").get("username"), username)
        ));
        
        Long result = session.createQuery(q).getSingleResult();
        return result != null ? result : 0L;
    }

    @Override
    public Integer getTotalEventsByOrganizer(String username) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Long> q = b.createQuery(Long.class);
        
        Root<EventShow> eventRoot = q.from(EventShow.class);
        
        q.select(b.count(eventRoot));
        
        q.where(b.equal(eventRoot.get("organizer").get("username"), username));
        
        Long result = session.createQuery(q).getSingleResult();
        return result != null ? result.intValue() : 0;
    }
}
