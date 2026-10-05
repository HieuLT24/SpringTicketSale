/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.pojo.UpdateRequest;
import com.pdh.pojo.User;
import com.pdh.pojo.EventShow;
import com.pdh.dto.EventStatsDTO;
import com.pdh.services.UpdateRequestService;
import com.pdh.services.UserService;
import com.pdh.services.EventShowService;
import com.pdh.services.TicketService;
import com.pdh.services.PaymentService;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author duchi
 */
@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private UpdateRequestService updateRequestService;

    @Autowired
    private EventShowService eventShowService;

    @Autowired
    private TicketService ticketService;

    @Autowired
    private PaymentService paymentService;


    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model,
            @RequestParam(value = "page", defaultValue = "1") int page) {

        long totalUsers = userService.getUsers().size();
        long totalEvents = eventShowService.getTotalEvents();
        long totalSoldTickets = ticketService.getTotalSoldTickets();
        double totalRevenue = paymentService.getTotalRevenue();

        int pageSize = 9;
        int totalEventsCount = (int) totalEvents;
        int totalPages = (int) Math.ceil((double) totalEventsCount / pageSize);

        Map<String, String> params = new HashMap<>();
        params.put("page", String.valueOf(page));

        List<EventShow> events = eventShowService.getAllEvent(params);
        List<EventStatsDTO> eventStats = new ArrayList<>();

        for (EventShow event : events) {
            long soldTickets = ticketService.getSoldTicketsByEventId(event.getId());
            double eventRevenue = soldTickets * event.getTicketPrice();
            eventStats.add(new EventStatsDTO(event, soldTickets, eventRevenue));
        }

        model.addAttribute("totalUsers", totalUsers);
        model.addAttribute("totalEvents", totalEvents);
        model.addAttribute("totalSoldTickets", totalSoldTickets);
        model.addAttribute("totalRevenue", totalRevenue);
        model.addAttribute("eventStats", eventStats);

        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("hasNextPage", page < totalPages);
        model.addAttribute("hasPrevPage", page > 1);
        model.addAttribute("nextPage", page + 1);
        model.addAttribute("prevPage", page - 1);

        return "admin/dashboard";
    }

    @GetMapping("/organizer-requests")
    public String organizerRequests(HttpSession session, Model model) {

        List<UpdateRequest> requests = updateRequestService.getUpdateRequests();
        model.addAttribute("requests", requests);

        long pendingCount = requests.stream().filter(r -> "PENDING".equals(r.getStatus())).count();
        long approvedCount = requests.stream().filter(r -> "APPROVED".equals(r.getStatus())).count();
        long rejectedCount = requests.stream().filter(r -> "REJECTED".equals(r.getStatus())).count();

        model.addAttribute("pendingCount", pendingCount);
        model.addAttribute("approvedCount", approvedCount);
        model.addAttribute("rejectedCount", rejectedCount);

        return "admin/organizer-requests";
    }

    @PostMapping("/organizer-requests")
    public String approveOrganizerRequest(@RequestParam("requestId") Integer requestId,
            @RequestParam("userId") Integer userId, @RequestParam("status") String status) {
        User user = userService.getUserById(userId);
        if (user != null && "APPROVED".equals(status)) {
            user.setRole("ORGANIZER");
            userService.updateUser(user);
        }

        UpdateRequest request = updateRequestService.getUpdateRequestById(requestId);
        if (request != null) {
            if ("APPROVED".equals(status)) {
                request.setStatus("APPROVED");
                updateRequestService.updateUpdateRequest(request);
                System.out.println("Approved request ID: " + requestId);
            } else if ("REJECTED".equals(status)) {
                request.setStatus("REJECTED");
                updateRequestService.updateUpdateRequest(request);
                System.out.println("Rejected request ID: " + requestId);
            }
        }

        return "redirect:/admin/organizer-requests";
    }

    @GetMapping("/users")
    public String users(Model model) {

        List<User> users = userService.getUsers();
        model.addAttribute("users", users);

        return "admin/users";
    }

    @GetMapping("/events")
    public String events(Model model) {

        return "admin/events";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "admin/login";
    }

}
