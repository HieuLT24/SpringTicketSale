/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.repositories.impl;

import com.pdh.pojo.EventShow;
import com.pdh.repositories.EventShowRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.hibernate.Session;
import org.hibernate.query.Query;
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
public class EventShowRepositoryImpl implements EventShowRepository {

    private static final int PAGE_SIZE = 9;
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<EventShow> getAllEvent(Map<String, String> params) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<EventShow> query = b.createQuery(EventShow.class);
        Root root = query.from(EventShow.class);
        query.select(root);

        if (params != null) {

            List<Predicate> predicates = new ArrayList<>();

            String kw = params.get("kw");
            if (kw != null && !kw.isEmpty()) {
                String pattern = String.format("%%%s%%", kw);
                predicates.add(b.or(
                        b.like(b.lower(root.get("name")), pattern.toLowerCase()),
                        b.like(b.lower(root.get("description")), pattern.toLowerCase())
                ));
            }

            String fromPrice = params.get("fromPrice");
            if (fromPrice != null && !fromPrice.isEmpty()) {
                predicates.add(b.greaterThanOrEqualTo(root.get("ticketPrice"), fromPrice));
            }

            String toPrice = params.get("toPrice");
            if (toPrice != null && !toPrice.isEmpty()) {
                predicates.add(b.lessThanOrEqualTo(root.get("ticketPrice"), toPrice));
            }

            String cateId = params.get("cateId");
            if (cateId != null && !cateId.isEmpty()) {
                predicates.add(b.equal(root.get("category").get("id").as(Integer.class), cateId));
            }

            query.where(predicates);

            String orderBy = params.get("orderBy");
            if (orderBy != null && !orderBy.isEmpty()) {
                query.orderBy(b.desc(root.get(orderBy)));
            }
        }
        jakarta.persistence.Query q = s.createQuery(query);

        if (params != null) {
            String p = params.get("page");
            if (p != null && !p.isEmpty()) {
                int page = Integer.parseInt(p);

                int start = (page - 1) * PAGE_SIZE;

                q.setMaxResults(PAGE_SIZE);
                q.setFirstResult(start);
            }
        }
        return q.getResultList();
    }

    @Override
    public EventShow getEventById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("EventShow.findById", EventShow.class);
        q.setParameter("id", id);
        return (EventShow) q.getSingleResult();
    }

    @Override
    public List<EventShow> getEventsByCateId(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<EventShow> q = b.createQuery(EventShow.class);
        Root root = q.from(EventShow.class);
        q.select(root);
        
        q.where(b.equal(root.get("category").get("id"), id));
        
        return s.createQuery(q).getResultList();
    }

    @Override
    public long getTotalEvents() {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Long> q = s.createQuery("SELECT COUNT(e) FROM EventShow e", Long.class);
        return q.getSingleResult();
    }

    @Override
    public List<EventShow> getEventsByOrganizer(String username) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<EventShow> q = b.createQuery(EventShow.class);
        Root root = q.from(EventShow.class);
        q.select(root);
        
        q.where(b.equal(root.get("organizer").get("username"), username));
        q.orderBy(b.desc(root.get("time")));
        
        return s.createQuery(q).getResultList();
    }

    @Override
    public EventShow addEvent(EventShow event) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(event);
        return event;
    }

    @Override
    public EventShow updateEvent(EventShow event) {
        Session s = this.factory.getObject().getCurrentSession();
        s.merge(event);
        return event;
    }

    @Override
    public boolean deleteEvent(int eventId) {
        Session s = this.factory.getObject().getCurrentSession();
        EventShow event = s.find(EventShow.class, eventId);
        if (event != null) {
            s.remove(event);
            return true;
        }
        return false;
    }

}
