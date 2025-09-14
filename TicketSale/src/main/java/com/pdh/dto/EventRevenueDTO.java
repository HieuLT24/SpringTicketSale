package com.pdh.dto;

import java.util.Date;

public class EventRevenueDTO {
    private Integer eventId;
    private String eventName;
    private Date eventDate;
    private Double revenue;
    private Long ticketsSold;
    private Integer capacity;
    private Double ticketPrice;

    public EventRevenueDTO() {}

    public EventRevenueDTO(Integer eventId, String eventName, Date eventDate, 
                          Double revenue, Long ticketsSold, Integer capacity, Double ticketPrice) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.eventDate = eventDate;
        this.revenue = revenue;
        this.ticketsSold = ticketsSold;
        this.capacity = capacity;
        this.ticketPrice = ticketPrice;
    }

    // Getters and Setters
    public Integer getEventId() { return eventId; }
    public void setEventId(Integer eventId) { this.eventId = eventId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public Date getEventDate() { return eventDate; }
    public void setEventDate(Date eventDate) { this.eventDate = eventDate; }

    public Double getRevenue() { return revenue; }
    public void setRevenue(Double revenue) { this.revenue = revenue; }

    public Long getTicketsSold() { return ticketsSold; }
    public void setTicketsSold(Long ticketsSold) { this.ticketsSold = ticketsSold; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Double getTicketPrice() { return ticketPrice; }
    public void setTicketPrice(Double ticketPrice) { this.ticketPrice = ticketPrice; }
}
