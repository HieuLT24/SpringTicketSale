/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.repositories.impl;

import com.pdh.pojo.User;
import com.pdh.repositories.UserRepository;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author duchi
 */
@Repository
@Transactional
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public User getUserByUsername(String username) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("User.findByUsername", User.class);
        q.setParameter("username", username);

        return (User) q.getSingleResult();

    }

    @Override
    public List<User> getListUsers() {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("User.findAll", User.class);
        return q.getResultList();
    }

    @Override
    public User createUser(User user) {
        Session s = this.factory.getObject().getCurrentSession();
        if (user.getId() != null) {
            s.merge(user);
        } else {
            s.persist(user);
        }
        return user;
    }

    @Override
    public void updateUser(User user) {
        Session s = this.factory.getObject().getCurrentSession();
        s.merge(user);
    }

    @Override
    public void deleteUserById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        User u = s.get(User.class, id);
        s.remove(u);
    }

    @Override
    public boolean authenticate(String username, String password) {
        User u = this.getUserByUsername(username);
        
        if (u == null) {
            return false;
        }

        return this.passwordEncoder.matches(password, u.getPassword());
    }

}
