/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.services;

import com.pdh.pojo.EventShow;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 *
 * @author duchi
 */
public interface EventShowService {
    public List<EventShow> getAllEvent(Map<String, String> params);
    public EventShow getEventById(int id);
    public List<EventShow> getEventsByCateId(int id);

}
