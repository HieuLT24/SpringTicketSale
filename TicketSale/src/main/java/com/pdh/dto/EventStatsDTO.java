/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.dto;

import com.pdh.pojo.EventShow;
import java.io.Serializable;

/**
 *
 * @author duchi
 */
public class EventStatsDTO implements Serializable {
    
    private EventShow event;
    private long soldTickets;
    private double revenue;
    
    public EventStatsDTO() {
    }
    
    public EventStatsDTO(EventShow event, long soldTickets, double revenue) {
        this.event = event;
        this.soldTickets = soldTickets;
        this.revenue = revenue;
    }
    
    public EventShow getEvent() {
        return event;
    }
    
    public void setEvent(EventShow event) {
        this.event = event;
    }
    
    public long getSoldTickets() {
        return soldTickets;
    }
    
    public void setSoldTickets(long soldTickets) {
        this.soldTickets = soldTickets;
    }
    
    public double getRevenue() {
        return revenue;
    }
    
    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }
}
