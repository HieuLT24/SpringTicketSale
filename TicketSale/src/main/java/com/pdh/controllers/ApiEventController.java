/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.services.EventShowService;
import com.pdh.pojo.EventShow;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author duchi
 */
@RestController
@CrossOrigin
@RequestMapping("/api")
public class ApiEventController {

    @Autowired
    private EventShowService eventService;
    
    @GetMapping("/events")
    public ResponseEntity<?> getAllEvent(@RequestParam Map<String, String> params, HttpServletRequest request) {
        return ResponseEntity.ok(eventService.getAllEventAsDTO(params));
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<?> getEventById(@PathVariable(name = "eventId") int eventId, HttpServletRequest request) {
        return ResponseEntity.ok(this.eventService.getEventByIdAsDTO(eventId));
    }


    @GetMapping("/secure/myEvents")
    public ResponseEntity<?> getMyEvents(HttpServletRequest request) {
        String username = null;
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return ResponseEntity.ok(eventService.getMyEvents(username));
    }

    @PostMapping(path = "/secure/myEvents",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createEvent(
            HttpServletRequest request, 
            @RequestParam Map<String, String> params,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        String username = null;
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return ResponseEntity.ok(eventService.createEvent(username, params, image));
    }

    @PutMapping(path = "/secure/myEvents/{eventId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateEvent(
            HttpServletRequest request, 
            @PathVariable(name = "eventId") int eventId, 
            @RequestParam Map<String, String> params,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        String username = null;
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return ResponseEntity.ok(eventService.updateEvent(username, eventId, params, image));
    }

    @DeleteMapping("/secure/myEvents/{eventId}")
    public ResponseEntity<?> deleteEvent(HttpServletRequest request, @PathVariable(name = "eventId") int eventId) {
        String username = null;
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        boolean success = eventService.deleteEvent(username, eventId);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Xóa event thành công"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Không thể xóa event"));
        }
    }
    
    @GetMapping("/secure/events/{eventId}/sold-tickets")
    public ResponseEntity<?> getSoldTicketsByEventId(@PathVariable(name = "eventId") int eventId, HttpServletRequest request) {
        String username = null;
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        
        EventShow event = eventService.getEventById(eventId);
        if (event == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!event.getOrganizer().getUsername().equals(username)) {
            return ResponseEntity.status(403).body(Map.of("message", "Bạn không có quyền truy cập thông tin này"));
        }
        
        long soldTickets = eventService.getSoldTicketsByEventId(eventId);
        return ResponseEntity.ok(Map.of("eventId", eventId, "soldTickets", soldTickets));
    }
    
    @GetMapping("/secure/events/{eventId}/revenue")
    public ResponseEntity<?> getRevenueByEventId(@PathVariable(name = "eventId") int eventId, HttpServletRequest request) {
        String username = null;
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        
        EventShow event = eventService.getEventById(eventId);
        if (event == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!event.getOrganizer().getUsername().equals(username)) {
            return ResponseEntity.status(403).body(Map.of("message", "Bạn không có quyền truy cập thông tin này"));
        }
        
        double revenue = eventService.getRevenueByEventId(eventId);
        return ResponseEntity.ok(Map.of("eventId", eventId, "revenue", revenue));
    }
}
