package com.pdh.services;

import java.util.List;

import com.pdh.pojo.Ticket;

public interface TicketService {
    List<Ticket> getTicketsAvailableByEventShowId(int id);
    List<Ticket> getTicketsByIds(List<Integer> ids);
    Ticket getTicketById(int id);
    void updateTicket(Ticket ticket);
    List<Ticket> getTicketsByUserId(int userId);
}
    

