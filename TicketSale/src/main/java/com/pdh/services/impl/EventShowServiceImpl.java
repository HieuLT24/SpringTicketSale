/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.services.impl;

import com.pdh.pojo.EventShow;
import com.pdh.repositories.EventShowRepository;
import com.pdh.services.EventShowService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author duchi
 */
@Service
public class EventShowServiceImpl implements EventShowService{

    @Autowired
    private EventShowRepository eventRepo;
    
    @Override
    public List<EventShow> getAllEvent(Map<String, String> params) {
        return this.eventRepo.getAllEvent(params);
    }

    @Override
    public EventShow getEventById(int id) {
        return this.eventRepo.getEventById(id);
    }
    
    @Override
    public List<EventShow> getEventsByCateId(int id) {
        return this.eventRepo.getEventsByCateId(id);
    }

}
