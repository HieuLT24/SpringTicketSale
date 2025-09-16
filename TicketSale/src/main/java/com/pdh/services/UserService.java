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
    List<User> getUsers();
    User getUserByUsername(String username);
    User getUserById(Integer id);
    void updateUser(String username, String fullname, String email, MultipartFile avatar);
    void updateUser(User user);
    void deleteUserById(int id);
    boolean authenticate(String username, String password);
    boolean changePassword(String username, String oldPassword, String newPassword);
    User getUserByEmail(String email);
    User createUserFromGoogle(String email, String fullname, String avatarUrl);
}
