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
import java.time.LocalDateTime;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;

/**
 *
 * @author duchi
 */
@RestController
@CrossOrigin
@RequestMapping("/api")
@PropertySource("classpath:google-auth.properties")
public class ApiUserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UpdateRequestService updateRequestService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired 
    private JavaMailSender mailSender;

    @Value("${google.client_id}")
    private String GOOGLE_CLIENT_ID;


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

    
    @PostMapping("/login/google")
    public ResponseEntity<?> verifyGoogleToken(@RequestBody Map<String, String> body) {
        String idTokenString = body.get("token");
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idTokenString;
            Map<?, ?> tokenInfo = restTemplate.getForObject(url, Map.class);
            if (tokenInfo != null && GOOGLE_CLIENT_ID.equals(String.valueOf(tokenInfo.get("aud")))) {
                String email = String.valueOf(tokenInfo.get("email"));
                String name = tokenInfo.get("name") != null ? String.valueOf(tokenInfo.get("name")) : email;
                String pictureUrl = tokenInfo.get("picture") != null ? String.valueOf(tokenInfo.get("picture")) : null;

                User user = null;
                try {
                    user = userService.getUserByEmail(email);
                } catch (Exception ex) {
                    user = null;
                }
                if (user == null) {
                    user = userService.createUserFromGoogle(email, name, pictureUrl);
                }

                String token = jwtUtils.generateToken(user.getUsername());

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("email", email);
                response.put("fullname", name);
                response.put("avatar", pictureUrl);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID token.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/public/google-client-id")
    public ResponseEntity<?> getGoogleClientId() {
        Map<String, String> res = new HashMap<>();
        res.put("clientId", GOOGLE_CLIENT_ID);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam("email") String email) {
        try {
            User user = userService.getUserByEmail(email);

            if (user != null) {
                String token = jwtUtils.generateToken(email);
                String resetUrl = "http://localhost:3000/reset-password?token=" + token; 

                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setTo(email);
                mailMessage.setSubject("Đặt lại mật khẩu - TicketWeb");
                mailMessage.setText("Xin chào " + user.getFullname() + ",\n\n" +
                        "Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link sau để đặt lại mật khẩu:\n\n" +
                        resetUrl + "\n\n" +
                        "Link này sẽ hết hạn sau 1 giờ.\n\n" +
                        "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                        "Trân trọng,\n" +
                        "Đội ngũ TicketWeb");

                mailSender.send(mailMessage);

                return ResponseEntity.ok(Map.of("message", "Link khôi phục mật khẩu đã được gửi đến email của bạn!"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Email không tồn tại trong hệ thống!"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau!"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam("token") String token,
            @RequestParam("password") String password,
            @RequestParam("confirmPassword") String confirmPassword) {
        try {
            if (password == null || password.length() < 6) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Mật khẩu phải có ít nhất 6 ký tự!"));
            }
            if (!password.equals(confirmPassword)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Mật khẩu xác nhận không khớp!"));
            }

            String email = jwtUtils.validateToken(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Link khôi phục không hợp lệ hoặc đã hết hạn."));
            }

            User user = userService.getUserByEmail(email);
            if (user != null) {
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                user.setPassword(passwordEncoder.encode(password));
                userService.updateUser(user);

                return ResponseEntity.ok(Map.of("message", "Mật khẩu đã được đặt lại thành công!"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy tài khoản!"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi đặt lại mật khẩu!"));
        }
    }









    @GetMapping("/secure/profile")
    @ResponseBody
    @CrossOrigin
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        String username = null;
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }

        return new ResponseEntity<>(this.userService.getUserByUsername(username), HttpStatus.OK);
    }

    @PostMapping(path = "/secure/profile",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateProfile(
            HttpServletRequest request,
            @RequestParam(name = "fullname", required = false) String fullname,
            @RequestParam(name = "email", required = false) String email,
            @RequestParam(name = "avatar", required = false) MultipartFile avatar) {

        String username = null;
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        
        this.userService.updateUser(username, fullname, email, avatar);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "/secure/password")
    public ResponseEntity<?> changePassword(HttpServletRequest request, @RequestBody Map<String, String> body) {

        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");

        String username = null;
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        boolean ok = this.userService.changePassword(username, oldPassword, newPassword);
        if (!ok) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mật khẩu hiện tại không đúng");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/secure/organizer-request")
    public ResponseEntity<?> requestOrganizerRole(HttpServletRequest request, @RequestBody Map<String, String> body) {
        String username = null;
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
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
    public ResponseEntity<?> getOrganizerRequestStatus(HttpServletRequest request) {
        String username = null;
        
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
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
