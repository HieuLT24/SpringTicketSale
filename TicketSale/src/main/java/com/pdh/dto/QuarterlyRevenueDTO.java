package com.pdh.dto;

public class QuarterlyRevenueDTO {
    private String quarter; // "2024-Q1", "2024-Q2", etc.
    private String quarterName; // "Quý 1/2024", "Quý 2/2024", etc.
    private Double revenue;
    private Long ticketsSold;
    private Integer totalEvents;

    public QuarterlyRevenueDTO() {}

    public QuarterlyRevenueDTO(String quarter, String quarterName, Double revenue, 
                              Long ticketsSold, Integer totalEvents) {
        this.quarter = quarter;
        this.quarterName = quarterName;
        this.revenue = revenue;
        this.ticketsSold = ticketsSold;
        this.totalEvents = totalEvents;
    }

    // Getters and Setters
    public String getQuarter() { return quarter; }
    public void setQuarter(String quarter) { this.quarter = quarter; }

    public String getQuarterName() { return quarterName; }
    public void setQuarterName(String quarterName) { this.quarterName = quarterName; }

    public Double getRevenue() { return revenue; }
    public void setRevenue(Double revenue) { this.revenue = revenue; }

    public Long getTicketsSold() { return ticketsSold; }
    public void setTicketsSold(Long ticketsSold) { this.ticketsSold = ticketsSold; }

    public Integer getTotalEvents() { return totalEvents; }
    public void setTotalEvents(Integer totalEvents) { this.totalEvents = totalEvents; }
}
