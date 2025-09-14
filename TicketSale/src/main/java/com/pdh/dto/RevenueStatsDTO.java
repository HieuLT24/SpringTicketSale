package com.pdh.dto;

import java.util.List;

public class RevenueStatsDTO {
    private String period;
    private String periodValue;
    private Double totalRevenue;
    private Long totalTicketsSold;
    private Integer totalEvents;
    private List<EventRevenueDTO> eventRevenues;
    private List<MonthlyRevenueDTO> monthlyRevenues;
    private List<QuarterlyRevenueDTO> quarterlyRevenues;
    private List<YearlyRevenueDTO> yearlyRevenues;

    public RevenueStatsDTO() {}

    public RevenueStatsDTO(String period, String periodValue, Double totalRevenue, 
                          Long totalTicketsSold, Integer totalEvents) {
        this.period = period;
        this.periodValue = periodValue;
        this.totalRevenue = totalRevenue;
        this.totalTicketsSold = totalTicketsSold;
        this.totalEvents = totalEvents;
    }

    // Getters and Setters
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public String getPeriodValue() { return periodValue; }
    public void setPeriodValue(String periodValue) { this.periodValue = periodValue; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getTotalTicketsSold() { return totalTicketsSold; }
    public void setTotalTicketsSold(Long totalTicketsSold) { this.totalTicketsSold = totalTicketsSold; }

    public Integer getTotalEvents() { return totalEvents; }
    public void setTotalEvents(Integer totalEvents) { this.totalEvents = totalEvents; }

    public List<EventRevenueDTO> getEventRevenues() { return eventRevenues; }
    public void setEventRevenues(List<EventRevenueDTO> eventRevenues) { this.eventRevenues = eventRevenues; }

    public List<MonthlyRevenueDTO> getMonthlyRevenues() { return monthlyRevenues; }
    public void setMonthlyRevenues(List<MonthlyRevenueDTO> monthlyRevenues) { this.monthlyRevenues = monthlyRevenues; }

    public List<QuarterlyRevenueDTO> getQuarterlyRevenues() { return quarterlyRevenues; }
    public void setQuarterlyRevenues(List<QuarterlyRevenueDTO> quarterlyRevenues) { this.quarterlyRevenues = quarterlyRevenues; }

    public List<YearlyRevenueDTO> getYearlyRevenues() { return yearlyRevenues; }
    public void setYearlyRevenues(List<YearlyRevenueDTO> yearlyRevenues) { this.yearlyRevenues = yearlyRevenues; }
}
