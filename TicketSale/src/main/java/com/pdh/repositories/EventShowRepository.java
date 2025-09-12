/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.repositories;

import com.pdh.pojo.EventShow;
import java.util.List;
import java.util.Map;

/**
 *
 * @author duchi
 */
public interface EventShowRepository {
    List<EventShow> getAllEvent(Map<String, String> params); 
    EventShow getEventById(int id);
    List<EventShow> getEventsByCateId(int id);
    long getTotalEvents();

}
