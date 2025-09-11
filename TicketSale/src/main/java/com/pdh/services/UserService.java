/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.services;

import com.pdh.pojo.User;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author duchi
 */
public interface UserService extends UserDetailsService{

    User createUser(Map<String, String> params, MultipartFile avatar);
    List<User> getListUsers();
    User getUserByUsername(String username);
    void updateUser(User user);
    void deleteUserById(int id);
    boolean authenticate(String username, String password);
}
