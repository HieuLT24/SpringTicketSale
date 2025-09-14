package com.pdh.services;

import com.pdh.dto.RevenueStatsDTO;
import java.util.Map;

public interface RevenueService {
    
    RevenueStatsDTO getEventRevenueStats(String username);

    RevenueStatsDTO getMonthlyRevenueStats(String username, Map<String, String> params);

    RevenueStatsDTO getQuarterlyRevenueStats(String username, Map<String, String> params);

    RevenueStatsDTO getYearlyRevenueStats(String username, Map<String, String> params);

    RevenueStatsDTO getOverallStats(String username);
}
