package com.pdh.controllers;

import com.pdh.dto.TicketDTO;
import com.pdh.pojo.Ticket;
import com.pdh.services.TicketService;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ApiTicketController {
    @Autowired
    private TicketService ticketService;

    @GetMapping("/{eventId}/tickets")
    public ResponseEntity<?> getAvailableTickets(@PathVariable(name = "eventId") int eventId, HttpServletRequest request) {
        try {
            List<Ticket> tickets = ticketService.getTicketsAvailableByEventShowId(eventId);
            List<TicketDTO> result = tickets.stream().map(t -> new TicketDTO(
                    t.getId(),
                    t.getPrice(),
                    t.getSeatNumber(),
                    t.getStatus(),
                    t.getEventShowId() != null ? t.getEventShowId().getId() : null,
                    t.getUserId() != null ? t.getUserId().getId() : null
            )).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
