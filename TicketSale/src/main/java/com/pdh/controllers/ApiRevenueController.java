package com.pdh.controllers;

import com.pdh.dto.RevenueStatsDTO;
import com.pdh.services.RevenueService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/secure/revenue")
@CrossOrigin
public class ApiRevenueController {

    @Autowired
    private RevenueService revenueService;

    @GetMapping("/events")
    public ResponseEntity<?> getEventRevenueStats(HttpServletRequest request) {
        String username = getCurrentUsername();
        RevenueStatsDTO stats = revenueService.getEventRevenueStats(username);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/monthly")
    public ResponseEntity<?> getMonthlyRevenueStats(
            @RequestParam Map<String, String> params,
            HttpServletRequest request) {
        String username = getCurrentUsername();
        RevenueStatsDTO stats = revenueService.getMonthlyRevenueStats(username, params);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/quarterly")
    public ResponseEntity<?> getQuarterlyRevenueStats(
            @RequestParam Map<String, String> params,
            HttpServletRequest request) {
        String username = getCurrentUsername();
        RevenueStatsDTO stats = revenueService.getQuarterlyRevenueStats(username, params);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/yearly")
    public ResponseEntity<?> getYearlyRevenueStats(
            @RequestParam Map<String, String> params,
            HttpServletRequest request) {
        String username = getCurrentUsername();
        RevenueStatsDTO stats = revenueService.getYearlyRevenueStats(username, params);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/overall")
    public ResponseEntity<?> getOverallStats(HttpServletRequest request) {
        String username = getCurrentUsername();
        System.out.println("username: " + username);
        RevenueStatsDTO stats = revenueService.getOverallStats(username);
        return ResponseEntity.ok(stats);
    }

    private String getCurrentUsername() {
        System.out.println("getCurrentUsername: " + SecurityContextHolder.getContext().getAuthentication().getName());
        if (SecurityContextHolder.getContext() != null && 
            SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return null;
    }
}
