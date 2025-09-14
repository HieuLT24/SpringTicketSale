/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.pojo.Payment;
import com.pdh.pojo.PaymentTicket;
import com.pdh.pojo.Ticket;
import com.pdh.pojo.User;
import com.pdh.services.PaymentService;
import com.pdh.services.PaymentTicketService;
import com.pdh.services.TicketService;
import com.pdh.services.UserService;
import static com.pdh.utils.HmacUtil.hmacSHA512;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author duchi
 */
@RestController
@RequestMapping("/api/secure/payment")
@CrossOrigin
public class ApiPaymentController {
    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    // @Autowired
    // private EventShowService eventService;

    @Autowired
    private TicketService ticketService;

    @Autowired
    private PaymentTicketService paymentTicketService;

    @Value("${vnpay.hashSecret}")
    private String vnpayHashSecret;
    @Value("${frontend.baseUrl}")
    private String frontendBaseUrl;

    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> paymentRequest, HttpServletRequest request) {

        String username = null;
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }

        try {
            

            User user = userService.getUserByUsername(username);
            
            List<Integer> ticketIds = (List<Integer>) paymentRequest.get("ticketIds");
            String paymentMethod = (String) paymentRequest.get("paymentMethod");
            Number totalAmountNum = (Number) paymentRequest.get("totalAmount");
            Double totalAmount = totalAmountNum != null ? totalAmountNum.doubleValue() : null;



            if (ticketIds == null || ticketIds.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Vui lòng chọn ít nhất một vé"));
            }

            if (totalAmount == null || totalAmount <= 0) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Số tiền thanh toán không hợp lệ"));
            }

            Payment payment = new Payment();
            payment.setMethod(paymentMethod);
            payment.setTotalAmount(totalAmount);
            payment.setStatus("PENDING");
            payment.setCreatedAt(new Date());
            payment.setUser(user);
            Payment savedPayment = paymentService.createPayment(payment);

            List<Ticket> tickets = ticketService.getTicketsByIds(ticketIds);
            for (Ticket ticket : tickets) {
                PaymentTicket paymentTicket = new PaymentTicket();
                paymentTicket.setPaymentId(savedPayment);
                paymentTicket.setTicketId(ticket);
                paymentTicketService.addPaymentTicket(paymentTicket);
            }

            String paymentUrl = null;
            if ("MOMO".equalsIgnoreCase(paymentMethod)) {
                paymentUrl = paymentService.createMoMoPaymentUrl(savedPayment.getId(), totalAmount);
            } else if ("VNPAY".equalsIgnoreCase(paymentMethod)) {
                paymentUrl = paymentService.createVNPayPaymentUrl(savedPayment.getId(), totalAmount);
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Phương thức thanh toán không hợp lệ"));
            }

            String successUrl = frontendBaseUrl + "/payment/result?success=true&method=" + paymentMethod +
                    "&orderId=" + savedPayment.getId()
                    + (totalAmount != null ? "&amount=" + totalAmount : "");

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "success", true,
                    "message", "Tạo thanh toán thành công",
                    "paymentUrl", paymentUrl,
                    "paymentId", savedPayment.getId(),
                    "successUrl", successUrl));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @PostMapping("/callback/momo/ipn")
    @Transactional
    public ResponseEntity<?> momoCallback(@RequestBody Map<String, String> callbackData) {
        System.out.println("Momo IPN data: " + callbackData);
        try {
            String orderId = callbackData.get("orderId");
            String resultCode = callbackData.get("resultCode");
            String transId = callbackData.get("transId");

            int paymentId = Integer.parseInt(orderId.split("_")[0]);
            Payment payment = paymentService.getPaymentById(paymentId);

            if (payment != null) {
                payment.setTransactionCode(transId);
                if ("0".equals(resultCode)) {
                    payment.setStatus("SUCCESS");

                    if (payment.getPaymentTicketCollection() != null) {
                        for (PaymentTicket paymentTicket : payment.getPaymentTicketCollection()) {
                            Ticket ticket = paymentTicket.getTicketId();
                            if (ticket != null) {
                                ticket.setStatus("SOLD");
                                ticket.setUserId(payment.getUser());
                                ticketService.updateTicket(ticket);
                            }
                        }
                    }
                } else {
                    payment.setStatus("FAILED");
                }
                paymentService.updatePayment(payment);
            }

            return ResponseEntity.ok("IPN received");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("ERROR");
        }
    }

    @GetMapping("/callback/momo/redirect")
    public ResponseEntity<?> momoCallbackGet(@RequestParam Map<String, String> callbackData) {
        boolean success = "0".equals(callbackData.get("resultCode"));
        String orderId = callbackData.get("orderId");
        Integer paymentId = null;
        if (orderId != null && orderId.contains("_")) {
            try {
                paymentId = Integer.parseInt(orderId.split("_")[0]);
            } catch (Exception ignore) {
            }
        }
        String redirectUrl = frontendBaseUrl + "/payment/result?success=" + success
                + "&method=MOMO" + (paymentId != null ? ("&orderId=" + paymentId) : "");
        return ResponseEntity.status(HttpStatus.FOUND).header("Location", redirectUrl).build();
    }
    
    @RequestMapping(value = "/callback/vnpay", method = {RequestMethod.GET, RequestMethod.POST})
    @Transactional
    public ResponseEntity<?> vnpayCallback(@RequestParam Map<String, String> callbackData, HttpServletRequest request) {
        try {
            if (!verifyVNPaySignature(callbackData)) {
                return ResponseEntity.badRequest().body("INVALID_SIGNATURE");
            }

            String vnp_TxnRef = callbackData.get("vnp_TxnRef");
            String vnp_ResponseCode = callbackData.get("vnp_ResponseCode");
            boolean success = "00".equals(vnp_ResponseCode);

            int paymentId = -1;
            if (vnp_TxnRef != null && vnp_TxnRef.contains("_")) {
                paymentId = Integer.parseInt(vnp_TxnRef.split("_")[0]);
            }

            Payment payment = paymentService.getPaymentById(paymentId);
            
            if (payment != null) {
                String vnpTransNo = callbackData.get("vnp_TransactionNo");
                payment.setTransactionCode(vnpTransNo);

                if (success) {
                    payment.setStatus("SUCCESS");
                    if (payment.getPaymentTicketCollection() != null) {
                        for (PaymentTicket paymentTicket : payment.getPaymentTicketCollection()) {
                            Ticket ticket = paymentTicket.getTicketId();
                            if (ticket != null) {
                                ticket.setStatus("SOLD");
                                ticket.setUserId(payment.getUser());
                                ticketService.updateTicket(ticket);
                            }
                        }
                    }
                } else {
                    payment.setStatus("FAILED");
                }
                paymentService.updatePayment(payment);
            }

            if ("GET".equalsIgnoreCase(request.getMethod())) {
                String redirectUrl = frontendBaseUrl + "/payment/result?success=" + success
                        + "&method=VNPAY" + (payment != null ? ("&orderId=" + payment.getId()) : "");
                return ResponseEntity.status(HttpStatus.FOUND).header("Location", redirectUrl).build();
            }
            return ResponseEntity.ok("IPN received");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("ERROR");
        }
    }


    private boolean verifyVNPaySignature(Map<String, String> callbackData) {
        try {
            String vnp_SecureHash = callbackData.get("vnp_SecureHash");
            if (vnp_SecureHash == null) return false;

            Map<String, String> fields = new HashMap<>(callbackData);
            fields.remove("vnp_SecureHash");
            fields.remove("vnp_SecureHashType");

            List<String> fieldNames = new ArrayList<>(fields.keySet());
            Collections.sort(fieldNames);

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < fieldNames.size(); i++) {
                String key = fieldNames.get(i);
                String value = fields.get(key);
                if (value != null && !value.isEmpty()) {
                    sb.append(key).append("=")
                      .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                    if (i < fieldNames.size() - 1) {
                        sb.append("&");
                    }
                }
            }

            String signValue = hmacSHA512(sb.toString(), vnpayHashSecret);
            return signValue.equalsIgnoreCase(vnp_SecureHash);

        } catch (Exception e) {
            return false;
        }
    }
    
    
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentDetail(@PathVariable("id") int id, Authentication authentication) {
        try {
            Payment p = paymentService.getPaymentById(id);

            Map<String, Object> dto = new HashMap<>();
            dto.put("id", p.getId());
            dto.put("method", p.getMethod());
            dto.put("transactionCode", p.getTransactionCode());
            dto.put("totalAmount", p.getTotalAmount());
            dto.put("status", p.getStatus());
            dto.put("createdAt", p.getCreatedAt());
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyPayments(Authentication authentication, HttpServletRequest request) {
        try {
            String username = (authentication != null && authentication.isAuthenticated()
                    && !"anonymousUser".equals(authentication.getName())) ? authentication.getName() : null;
            if (username == null) {
                Object attrUsername = request.getAttribute("username");
                if (attrUsername instanceof String) {
                    username = (String) attrUsername;
                }
            }

            User user = userService.getUserByUsername(username);


            List<Payment> payments = paymentService.getPaymentsByUserId(user.getId());
            List<Map<String, Object>> result = new ArrayList<>();
            for (Payment p : payments) {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", p.getId());
                dto.put("method", p.getMethod());
                dto.put("transactionCode", p.getTransactionCode());
                dto.put("totalAmount", p.getTotalAmount());
                dto.put("status", p.getStatus());
                dto.put("createdAt", p.getCreatedAt());
                result.add(dto);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @GetMapping("/my/tickets")
    public ResponseEntity<?> getMyTickets(Authentication authentication, HttpServletRequest request) {
        try {
            String username = (authentication != null && authentication.isAuthenticated()
                    && !"anonymousUser".equals(authentication.getName())) ? authentication.getName() : null;
            if (username == null) {
                Object attrUsername = request.getAttribute("username");
                if (attrUsername instanceof String) {
                    username = (String) attrUsername;
                }
            }

            User user = userService.getUserByUsername(username);
 

            java.util.List<Ticket> tickets = ticketService.getTicketsByUserId(user.getId());
            java.util.List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
            for (Ticket t : tickets) {
                java.util.Map<String, Object> dto = new java.util.HashMap<>();
                dto.put("id", t.getId());
                dto.put("seatNumber", t.getSeatNumber());
                dto.put("price", t.getPrice());
                dto.put("status", t.getStatus());
                dto.put("eventShowId", t.getEventShowId() != null ? t.getEventShowId().getId() : null);
                dto.put("eventShowName", t.getEventShowId() != null ? t.getEventShowId().getName() : null);
                result.add(dto);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/tickets")
    public ResponseEntity<?> getTicketsByPayment(@PathVariable("id") int id) {
        try {
            Payment p = paymentService.getPaymentById(id);
            if (p == null || p.getPaymentTicketCollection() == null) {
                return ResponseEntity.ok(java.util.List.of());
            }
            java.util.List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
            for (PaymentTicket pt : p.getPaymentTicketCollection()) {
                Ticket t = pt.getTicketId();
                if (t == null) continue;
                java.util.Map<String, Object> dto = new java.util.HashMap<>();
                dto.put("id", t.getId());
                dto.put("seatNumber", t.getSeatNumber());
                dto.put("price", t.getPrice());
                dto.put("status", t.getStatus());
                dto.put("eventShowId", t.getEventShowId() != null ? t.getEventShowId().getId() : null);
                dto.put("eventShowName", t.getEventShowId() != null ? t.getEventShowId().getName() : null);
                result.add(dto);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

}
