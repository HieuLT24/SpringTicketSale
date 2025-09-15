/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.repositories;

import com.pdh.pojo.User;
import java.util.List;

/**
 *
 * @author duchi
 */
public interface UserRepository {
    User getUserByUsername (String username);
    User getUserById(Integer id);
    List<User> getListUsers();
    List<User> getUsers();
    User createUser(User user);
    boolean authenticate(String username, String password);
    void updateUser(User user);
    void deleteUserById(int id);
    User getUserByEmail(String email);
    
}
