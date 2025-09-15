/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.pdh.dto.EventDTO;
import com.pdh.pojo.Category;
import com.pdh.pojo.EventShow;
import com.pdh.pojo.User;
import com.pdh.repositories.EventShowRepository;
import com.pdh.repositories.TicketRepository;
import com.pdh.repositories.PaymentRepository;
import com.pdh.services.EventShowService;
import com.pdh.services.UserService;
import com.pdh.services.CategoryService;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author duchi
 */
@Service
public class EventShowServiceImpl implements EventShowService{

    @Autowired
    private EventShowRepository eventRepo;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CategoryService categoryService;
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private Cloudinary cloudinary; 
    
    
    @Override
    public List<EventShow> getAllEvent(Map<String, String> params) {
        return this.eventRepo.getAllEvent(params);
    }
    
    @Override
    public List<EventDTO> getAllEventAsDTO(Map<String, String> params) {
        List<EventShow> events = this.eventRepo.getAllEvent(params);
        return events.stream()
                .map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public EventShow getEventById(int id) {
        return this.eventRepo.getEventById(id);
    }
    
    @Override
    public EventDTO getEventByIdAsDTO(int id) {
        EventShow event = this.eventRepo.getEventById(id);
        if (event == null) {
            return null;
        }
        return convertToDTO(event);
    }
    
    @Override
    public List<EventShow> getEventsByCateId(int id) {
        return this.eventRepo.getEventsByCateId(id);
    }
    
    @Override
    public List<EventDTO> getEventsByCateIdAsDTO(int id) {
        List<EventShow> events = this.eventRepo.getEventsByCateId(id);
        return events.stream()
                .map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public long getTotalEvents() {
        return this.eventRepo.getTotalEvents();
    }

    @Override
    public List<EventDTO> getMyEvents(String username) {
        List<EventShow> events = this.eventRepo.getEventsByOrganizer(username);
        List<EventDTO> eventDTOs = new ArrayList<>();
        
        for (EventShow event : events) {
            EventDTO dto = convertToDTO(event);
            eventDTOs.add(dto);
        }
        
        return eventDTOs;
    }

    @Override
    public EventDTO createEvent(String username, Map<String, String> body, MultipartFile image) {
        try {
            User organizer = this.userService.getUserByUsername(username);
            if (organizer == null) {
                throw new RuntimeException("Không tìm thấy người dùng");
            }
            
            EventShow event = new EventShow();
            event.setName(body.get("name"));
            event.setDescription(body.get("description"));
            event.setAddress(body.get("address"));
            event.setCapacity(Integer.parseInt(body.get("capacity")));
            event.setTicketPrice(Double.parseDouble(body.get("ticketPrice")));
            event.setOrganizer(organizer);
            
            String timeStr = body.get("time");
            if (timeStr != null && !timeStr.isEmpty()) {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
                Date time = sdf.parse(timeStr);
                event.setTime(time);
            }
            
            String categoryIdStr = body.get("categoryId");
            if (categoryIdStr != null && !categoryIdStr.isEmpty()) {
                Category category = this.categoryService.getCateById(Integer.parseInt(categoryIdStr));
                event.setCategory(category);
            }
            
            if (image != null && !image.isEmpty()) {
            try {
                Map<?, ?> res = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.asMap("resource_type", "auto", "folder", "event_banner"));
                event.setImage(res.get("secure_url").toString());
            } catch (IOException ex) {
                System.err.println("Error uploading avatar: " + ex.getMessage());
            }
        }
            EventShow savedEvent = this.eventRepo.addEvent(event);
            return convertToDTO(savedEvent);
            
        } catch (ParseException e) {
            throw new RuntimeException("Định dạng ngày tháng không hợp lệ", e);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Định dạng số không hợp lệ", e);
        }
    }

    @Override
    public EventDTO updateEvent(String username, int eventId, Map<String, String> params, MultipartFile image) {
        try {
            EventShow existingEvent = this.eventRepo.getEventById(eventId);
            if (existingEvent == null) {
                throw new RuntimeException("Không tìm thấy event");
            }
            
            if (!existingEvent.getOrganizer().getUsername().equals(username)) {
                throw new RuntimeException("Bạn không có quyền chỉnh sửa event này");
            }
            
            if (params.get("name") != null) {
                existingEvent.setName(params.get("name"));
            }
            if (params.get("description") != null) {
                existingEvent.setDescription(params.get("description"));
            }
            if (params.get("address") != null) {
                existingEvent.setAddress(params.get("address"));
            }
            if (params.get("capacity") != null) {
                existingEvent.setCapacity(Integer.parseInt(params.get("capacity")));
            }
            if (params.get("ticketPrice") != null) {
                existingEvent.setTicketPrice(Double.parseDouble(params.get("ticketPrice")));
            }
            
            if (image != null && !image.isEmpty()) {
                try {
                    Map<?, ?> res = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.asMap("resource_type", "auto", "folder", "event_banner"));
                    existingEvent.setImage(res.get("secure_url").toString());
                } catch (IOException ex) {
                    System.err.println("Error uploading image: " + ex.getMessage());
                }
            }
            
            String timeStr = params.get("time");
            if (timeStr != null && !timeStr.isEmpty()) {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
                Date time = sdf.parse(timeStr);
                existingEvent.setTime(time);
            }
            
            String categoryIdStr = params.get("categoryId");
            if (categoryIdStr != null && !categoryIdStr.isEmpty()) {
                Category category = this.categoryService.getCateById(Integer.parseInt(categoryIdStr));
                existingEvent.setCategory(category);
            }
            
            EventShow updatedEvent = this.eventRepo.updateEvent(existingEvent);
            return convertToDTO(updatedEvent);
            
        } catch (ParseException e) {
            throw new RuntimeException("Định dạng ngày tháng không hợp lệ", e);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Định dạng số không hợp lệ", e);
        }
    }

    @Override
    public boolean deleteEvent(String username, int eventId) {
        EventShow existingEvent = this.eventRepo.getEventById(eventId);
        if (existingEvent == null) {
            throw new RuntimeException("Không tìm thấy event");
        }
        
        if (!existingEvent.getOrganizer().getUsername().equals(username)) {
            throw new RuntimeException("Bạn không có quyền xóa event này");
        }
        
        return this.eventRepo.deleteEvent(eventId);
    }
    
    private EventDTO convertToDTO(EventShow event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setDescription(event.getDescription());
        dto.setImage(event.getImage());
        dto.setTime(event.getTime());
        dto.setAddress(event.getAddress());
        dto.setCapacity(event.getCapacity());
        dto.setTicketPrice(event.getTicketPrice());
        
        if (event.getCategory() != null) {
            dto.setCategoryId(event.getCategory().getId());
            dto.setCategoryName(event.getCategory().getName());
        }
        
        if (event.getOrganizer() != null) {
            dto.setOrganizerId(event.getOrganizer().getId());
            dto.setOrganizerName(event.getOrganizer().getFullname());
            dto.setOrganizerUsername(event.getOrganizer().getUsername());
        }
        
        return dto;
    }
    
    @Override
    public long getSoldTicketsByEventId(int eventId) {
        return this.ticketRepository.getSoldTicketsByEventId(eventId);
    }
    
    @Override
    public double getRevenueByEventId(int eventId) {
        return this.paymentRepository.getRevenueByEventId(eventId);
    }

}
