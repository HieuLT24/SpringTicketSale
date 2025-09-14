package com.pdh.repositories;

import java.util.List;

public interface RevenueRepository {
    List<Object[]> getMonthlyRevenueStats(String username, String year);
    List<Object[]> getQuarterlyRevenueStats(String username, String year);
    List<Object[]> getYearlyRevenueStats(String username);
    Double getTotalRevenueByOrganizer(String username);
    Long getTotalTicketsSoldByOrganizer(String username);
    Integer getTotalEventsByOrganizer(String username);
}
