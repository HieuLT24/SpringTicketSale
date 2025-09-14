package com.pdh.services.impl;

import com.pdh.dto.*;
import com.pdh.pojo.EventShow;
import com.pdh.repositories.EventShowRepository;
import com.pdh.repositories.PaymentRepository;
import com.pdh.repositories.TicketRepository;
import com.pdh.repositories.RevenueRepository;
import com.pdh.services.RevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RevenueServiceImpl implements RevenueService {

    @Autowired
    private EventShowRepository eventRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private RevenueRepository revenueRepository;

    @Override
    public RevenueStatsDTO getEventRevenueStats(String username) {
        List<EventShow> events = eventRepository.getEventsByOrganizer(username);
        List<EventRevenueDTO> eventRevenues = new ArrayList<>();
        
        double totalRevenue = 0.0;
        long totalTicketsSold = 0;

        for (EventShow event : events) {
            double eventRevenue = paymentRepository.getRevenueByEventId(event.getId());
            long eventTicketsSold = ticketRepository.getSoldTicketsByEventId(event.getId());
            
            eventRevenues.add(new EventRevenueDTO(
                event.getId(),
                event.getName(),
                event.getTime(),
                eventRevenue,
                eventTicketsSold,
                event.getCapacity(),
                event.getTicketPrice()
            ));
            
            totalRevenue += eventRevenue;
            totalTicketsSold += eventTicketsSold;
        }

        RevenueStatsDTO stats = new RevenueStatsDTO("event", "Tất cả sự kiện", 
                                                   totalRevenue, totalTicketsSold, events.size());
        stats.setEventRevenues(eventRevenues);
        return stats;
    }

    @Override
    public RevenueStatsDTO getMonthlyRevenueStats(String username, Map<String, String> params) {
        String year = params.getOrDefault("year", String.valueOf(Calendar.getInstance().get(Calendar.YEAR)));
        
        List<Object[]> results = revenueRepository.getMonthlyRevenueStats(username, year);
        
        List<MonthlyRevenueDTO> monthlyRevenues = new ArrayList<>();
        double totalRevenue = 0.0;
        long totalTicketsSold = 0;
        
        String[] monthNames = {"", "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
                              "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"};
        
        for (Object[] result : results) {
            Integer yearValue = (Integer) result[0];
            Integer month = (Integer) result[1];
            Double revenue = (Double) result[2];
            Long ticketsSold = (Long) result[3];
            
            String monthStr = String.format("%d-%02d", yearValue, month);
            String monthName = monthNames[month] + "/" + yearValue;
            
            monthlyRevenues.add(new MonthlyRevenueDTO(monthStr, monthName, revenue, ticketsSold, 1));
            totalRevenue += revenue;
            totalTicketsSold += ticketsSold;
        }
        
        RevenueStatsDTO stats = new RevenueStatsDTO("month", "Năm " + year, 
                                                   totalRevenue, totalTicketsSold, monthlyRevenues.size());
        stats.setMonthlyRevenues(monthlyRevenues);
        return stats;
    }

    @Override
    public RevenueStatsDTO getQuarterlyRevenueStats(String username, Map<String, String> params) {
        String year = params.getOrDefault("year", String.valueOf(Calendar.getInstance().get(Calendar.YEAR)));
        
        List<Object[]> results = revenueRepository.getQuarterlyRevenueStats(username, year);
        
        List<QuarterlyRevenueDTO> quarterlyRevenues = new ArrayList<>();
        double totalRevenue = 0.0;
        long totalTicketsSold = 0;
        
        String[] quarterNames = {"", "Quý 1", "Quý 2", "Quý 3", "Quý 4"};
        
        for (Object[] result : results) {
            Integer yearValue = (Integer) result[0];
            Integer quarter = (Integer) result[1];
            Double revenue = (Double) result[2];
            Long ticketsSold = (Long) result[3];
            
            String quarterStr = String.format("%d-Q%d", yearValue, quarter);
            String quarterName = quarterNames[quarter] + "/" + yearValue;
            
            quarterlyRevenues.add(new QuarterlyRevenueDTO(quarterStr, quarterName, revenue, ticketsSold, 1));
            totalRevenue += revenue;
            totalTicketsSold += ticketsSold;
        }
        
        RevenueStatsDTO stats = new RevenueStatsDTO("quarter", "Năm " + year, 
                                                   totalRevenue, totalTicketsSold, quarterlyRevenues.size());
        stats.setQuarterlyRevenues(quarterlyRevenues);
        return stats;
    }

    @Override
    public RevenueStatsDTO getYearlyRevenueStats(String username, Map<String, String> params) {
        List<Object[]> results = revenueRepository.getYearlyRevenueStats(username);
        
        List<YearlyRevenueDTO> yearlyRevenues = new ArrayList<>();
        double totalRevenue = 0.0;
        long totalTicketsSold = 0;
        
        for (Object[] result : results) {
            Integer year = (Integer) result[0];
            Double revenue = (Double) result[1];
            Long ticketsSold = (Long) result[2];
            
            String yearStr = String.valueOf(year);
            String yearName = "Năm " + year;
            
            yearlyRevenues.add(new YearlyRevenueDTO(yearStr, yearName, revenue, ticketsSold, 1));
            totalRevenue += revenue;
            totalTicketsSold += ticketsSold;
        }
        
        RevenueStatsDTO stats = new RevenueStatsDTO("year", "Tất cả các năm", 
                                                   totalRevenue, totalTicketsSold, yearlyRevenues.size());
        stats.setYearlyRevenues(yearlyRevenues);
        return stats;
    }

    @Override
    public RevenueStatsDTO getOverallStats(String username) {
        Double totalRevenue = revenueRepository.getTotalRevenueByOrganizer(username);
        Long totalTicketsSold = revenueRepository.getTotalTicketsSoldByOrganizer(username);
        Integer totalEvents = revenueRepository.getTotalEventsByOrganizer(username);
        
        return new RevenueStatsDTO("overall", "Tổng quan", totalRevenue, totalTicketsSold, totalEvents);
    }
}
