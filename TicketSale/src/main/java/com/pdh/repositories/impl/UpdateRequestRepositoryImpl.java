/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.repositories.impl;

import com.pdh.pojo.UpdateRequest;
import com.pdh.pojo.User;
import com.pdh.repositories.UpdateRequestRepository;
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
public class UpdateRequestRepositoryImpl implements UpdateRequestRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<UpdateRequest> getUpdateRequests() {
        Session s = this.factory.getObject().getCurrentSession();
        return s.createNamedQuery("UpdateRequest.findAll", UpdateRequest.class).getResultList();
    }

    @Override
    public UpdateRequest getUpdateRequestById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.find(UpdateRequest.class, id);
    }

    @Override
    public List<UpdateRequest> getUpdateRequestsByUser(User user) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.createNamedQuery("UpdateRequest.findByUserId", UpdateRequest.class)
                .setParameter("userId", user)
                .getResultList();
    }

    @Override
    public List<UpdateRequest> getUpdateRequestsByStatus(String status) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.createNamedQuery("UpdateRequest.findByStatus", UpdateRequest.class)
                .setParameter("status", status)
                .getResultList();
    }

    @Override
    public boolean addUpdateRequest(UpdateRequest updateRequest) {
        Session s = this.factory.getObject().getCurrentSession();
            s.persist(updateRequest);
            return true;
    }

    @Override
    public boolean updateUpdateRequest(UpdateRequest updateRequest) {
        Session s = this.factory.getObject().getCurrentSession();
            s.merge(updateRequest);
            return true;
    }

    @Override
    public boolean deleteUpdateRequest(int id) {
        Session s = this.factory.getObject().getCurrentSession();
            UpdateRequest updateRequest = s.find(UpdateRequest.class, id);
            if (updateRequest != null) {
                s.remove(updateRequest);
            }
            return true;
    }
}
