package com.pdh.repositories.impl;

import java.util.List;

import com.pdh.pojo.Ticket;
import com.pdh.repositories.TicketRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class TicketRepositoryImpl implements TicketRepository {
    @Autowired
    private LocalSessionFactoryBean factory;
    @Override
    public List<Ticket> getTicketsAvailableByEventShowId(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Ticket> q = b.createQuery(Ticket.class);
        Root<Ticket> root = q.from(Ticket.class);
        q.select(root);
        q.where(b.and(
            b.equal(root.get("status"), "available"),
            b.equal(root.get("eventShowId").get("id"), id)
        ));
        return s.createQuery(q).getResultList();
    }
    @Override
    public List<Ticket> getTicketsByIds(List<Integer> ids) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Ticket> q = b.createQuery(Ticket.class);
        Root<Ticket> root = q.from(Ticket.class);
        q.select(root);
        q.where(root.get("id").in(ids));
        return s.createQuery(q).getResultList();
    }
    
    @Override
    public Ticket getTicketById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.get(Ticket.class, id);
    }
    
    @Override
    public void updateTicket(Ticket ticket) {
        Session s = this.factory.getObject().getCurrentSession();
        s.merge(ticket);
    }
    @Override
    public List<Ticket> getTicketsByUserId(int userId) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Ticket> q = b.createQuery(Ticket.class);
        Root<Ticket> root = q.from(Ticket.class);
        q.select(root);
        q.where(b.equal(root.get("userId").get("id"), userId));
        return s.createQuery(q).getResultList();
    }

    @Override
    public long getTotalSoldTickets() {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Long> q = b.createQuery(Long.class);
        Root<Ticket> root = q.from(Ticket.class);
        q.select(b.count(root));
        q.where(b.equal(root.get("status"), "SOLD"));
        return s.createQuery(q).getSingleResult();
    }

    @Override
    public long getSoldTicketsByEventId(int eventId) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Long> q = b.createQuery(Long.class);
        Root<Ticket> root = q.from(Ticket.class);
        q.select(b.count(root));
        q.where(b.and(
            b.equal(root.get("status"), "SOLD"),
            b.equal(root.get("eventShowId").get("id"), eventId)
        ));
        return s.createQuery(q).getSingleResult();
    }


    
}
