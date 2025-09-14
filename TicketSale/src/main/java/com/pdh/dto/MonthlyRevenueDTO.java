package com.pdh.dto;

public class MonthlyRevenueDTO {
    private String month; // "2024-01", "2024-02", etc.
    private String monthName; // "Tháng 1/2024", "Tháng 2/2024", etc.
    private Double revenue;
    private Long ticketsSold;
    private Integer totalEvents;

    public MonthlyRevenueDTO() {}

    public MonthlyRevenueDTO(String month, String monthName, Double revenue, 
                            Long ticketsSold, Integer totalEvents) {
        this.month = month;
        this.monthName = monthName;
        this.revenue = revenue;
        this.ticketsSold = ticketsSold;
        this.totalEvents = totalEvents;
    }

    // Getters and Setters
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public String getMonthName() { return monthName; }
    public void setMonthName(String monthName) { this.monthName = monthName; }

    public Double getRevenue() { return revenue; }
    public void setRevenue(Double revenue) { this.revenue = revenue; }

    public Long getTicketsSold() { return ticketsSold; }
    public void setTicketsSold(Long ticketsSold) { this.ticketsSold = ticketsSold; }

    public Integer getTotalEvents() { return totalEvents; }
    public void setTotalEvents(Integer totalEvents) { this.totalEvents = totalEvents; }
}
