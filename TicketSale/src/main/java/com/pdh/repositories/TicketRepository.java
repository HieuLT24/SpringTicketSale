/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.repositories;

import java.util.List;

import com.pdh.pojo.Ticket;

/**
 *
 * @author duchi
 */
public interface TicketRepository {
    List<Ticket> getTicketsAvailableByEventShowId(int id);
    List<Ticket> getTicketsByIds(List<Integer> ids);
    Ticket getTicketById(int id);
    void updateTicket(Ticket ticket);
    List<Ticket> getTicketsByUserId(int userId);
    long getTotalSoldTickets();
    long getSoldTicketsByEventId(int eventId);

}
