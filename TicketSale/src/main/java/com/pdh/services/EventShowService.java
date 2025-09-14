/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.services;

import com.pdh.dto.EventDTO;
import com.pdh.pojo.EventShow;
import java.util.List;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author duchi
 */
public interface EventShowService {
    List<EventShow> getAllEvent(Map<String, String> params);
    List<EventDTO> getAllEventAsDTO(Map<String, String> params);
    EventShow getEventById(int id);
    EventDTO getEventByIdAsDTO(int id);
    List<EventShow> getEventsByCateId(int id);
    List<EventDTO> getEventsByCateIdAsDTO(int id);
    long getTotalEvents();
    
    List<EventDTO> getMyEvents(String username);
    EventDTO createEvent(String username, Map<String, String> body, MultipartFile image);
    EventDTO updateEvent(String username, int eventId, Map<String, String> params, MultipartFile image);
    boolean deleteEvent(String username, int eventId);
    
    long getSoldTicketsByEventId(int eventId);
    double getRevenueByEventId(int eventId);
}
