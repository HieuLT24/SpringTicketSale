package com.pdh.dto;

public class YearlyRevenueDTO {
    private String year; // "2024", "2023", etc.
    private String yearName; // "Năm 2024", "Năm 2023", etc.
    private Double revenue;
    private Long ticketsSold;
    private Integer totalEvents;

    public YearlyRevenueDTO() {}

    public YearlyRevenueDTO(String year, String yearName, Double revenue, 
                           Long ticketsSold, Integer totalEvents) {
        this.year = year;
        this.yearName = yearName;
        this.revenue = revenue;
        this.ticketsSold = ticketsSold;
        this.totalEvents = totalEvents;
    }

    // Getters and Setters
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getYearName() { return yearName; }
    public void setYearName(String yearName) { this.yearName = yearName; }

    public Double getRevenue() { return revenue; }
    public void setRevenue(Double revenue) { this.revenue = revenue; }

    public Long getTicketsSold() { return ticketsSold; }
    public void setTicketsSold(Long ticketsSold) { this.ticketsSold = ticketsSold; }

    public Integer getTotalEvents() { return totalEvents; }
    public void setTotalEvents(Integer totalEvents) { this.totalEvents = totalEvents; }
}
