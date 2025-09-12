/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.pojo.UpdateRequest;
import com.pdh.pojo.User;
import com.pdh.services.UserService;
import com.pdh.services.UpdateRequestService;
import com.pdh.utils.JwtUtils;
import java.security.Principal;
import java.time.LocalDateTime;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author duchi
 */
@RestController
@CrossOrigin
@RequestMapping("/api")
public class ApiUserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UpdateRequestService updateRequestService;
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping(path = "/register",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> create(@RequestParam Map<String, String> params, @RequestParam(value = "avatar") MultipartFile avatar) {
        return new ResponseEntity<>(this.userService.createUser(params, avatar), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User u) {

        if (this.userService.authenticate(u.getUsername(), u.getPassword())) {
            try {
                String token = jwtUtils.generateToken(u.getUsername());
                return ResponseEntity.ok().body(Collections.singletonMap("token", token));
            } catch (Exception e) {
                System.out.println("Error generating JWT: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(500).body("Lỗi khi tạo JWT: " + e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai thông tin đăng nhập");
    }

    @GetMapping("/secure/profile")
    @ResponseBody
    @CrossOrigin
    public ResponseEntity<?> getProfile(Principal principal, HttpServletRequest request) {
        String username = null;
        if (principal != null) {
            username = principal.getName();

        } else if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
            
        } else if (request.getAttribute("username") != null) {
            username = String.valueOf(request.getAttribute("username"));
        }

        if (username == null || username.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa xác thực");
        }

        return new ResponseEntity<>(this.userService.getUserByUsername(username), HttpStatus.OK);
    }

    @PostMapping(path = "/secure/profile",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateProfile(Principal principal,
            HttpServletRequest request,
            @RequestParam(name = "fullname", required = false) String fullname,
            @RequestParam(name = "email", required = false) String email,
            @RequestParam(name = "avatar", required = false) MultipartFile avatar) {
        String username = null;
        if (principal != null) {
            username = principal.getName();
        } else if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        } else if (request.getAttribute("username") != null) {
            username = String.valueOf(request.getAttribute("username"));
        }

        if (username == null || username.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa xác thực");
        }
        this.userService.updateUser(username, fullname, email, avatar);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "/secure/password")
    public ResponseEntity<?> changePassword(Principal principal, HttpServletRequest request, @RequestBody Map<String, String> body) {

        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");

        String username = null;
        if (principal != null) {
            username = principal.getName();
        } else if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        } else if (request.getAttribute("username") != null) {
            username = String.valueOf(request.getAttribute("username"));
        }
        boolean ok = this.userService.changePassword(username, oldPassword, newPassword);
        if (!ok) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mật khẩu hiện tại không đúng");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/secure/organizer-request")
    public ResponseEntity<?> requestOrganizerRole(Principal principal, HttpServletRequest request, @RequestBody Map<String, String> body) {
        String username = null;
        if (principal != null) {
            username = principal.getName();
        } else if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        } else if (request.getAttribute("username") != null) {
            username = String.valueOf(request.getAttribute("username"));
        }

        User user = this.userService.getUserByUsername(username);

        if ("ORGANIZER".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bạn đã là nhà tổ chức");
        }

        List<UpdateRequest> existingRequests = this.updateRequestService.getUpdateRequestsByUser(user);
        if (!existingRequests.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bạn đã gửi yêu cầu đăng ký làm nhà tổ chức rồi");
        }

        UpdateRequest newUpdateRequest = new UpdateRequest();
        newUpdateRequest.setUserId(user);
        newUpdateRequest.setStatus("PENDING");
        newUpdateRequest.setRequestDate(LocalDateTime.now());
        boolean success = this.updateRequestService.addUpdateRequest(newUpdateRequest);

        if (success) {
            return ResponseEntity.ok().body(Collections.singletonMap("message", "Yêu cầu đăng ký làm nhà tổ chức đã được gửi thành công"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra khi gửi yêu cầu");
        }
    }

    @GetMapping("/secure/organizer-request-status")
    public ResponseEntity<?> getOrganizerRequestStatus(Principal principal, HttpServletRequest request) {
        String username = null;
        if (principal != null) {
            username = principal.getName();
        } else if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        } else if (request.getAttribute("username") != null) {
            username = String.valueOf(request.getAttribute("username"));
        }

        User user = this.userService.getUserByUsername(username);
        List<UpdateRequest> existingRequests = this.updateRequestService.getUpdateRequestsByUser(user);
        
        if (existingRequests.isEmpty()) {
            return ResponseEntity.ok().body(Collections.singletonMap("hasRequest", false));
        } else {
            return ResponseEntity.ok().body(Collections.singletonMap("hasRequest", true));
        }
    }
}
