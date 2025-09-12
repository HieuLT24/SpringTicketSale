package com.pdh.services.impl;

import com.pdh.repositories.TicketRepository;
import com.pdh.pojo.Ticket;
import com.pdh.services.TicketService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TicketServiceImpl implements TicketService {
    @Autowired
    private TicketRepository ticketRepo;

    @Override
    public List<Ticket> getTicketsAvailableByEventShowId(int id) {
        return this.ticketRepo.getTicketsAvailableByEventShowId(id);
    }

    @Override
    public List<Ticket> getTicketsByIds(List<Integer> ids) {
        return this.ticketRepo.getTicketsByIds(ids);
    }

    @Override
    public Ticket getTicketById(int id) {
        return this.ticketRepo.getTicketById(id);
    }

    @Override
    public void updateTicket(Ticket ticket) {
        this.ticketRepo.updateTicket(ticket);
    }

    @Override
    public List<Ticket> getTicketsByUserId(int userId) {
        return this.ticketRepo.getTicketsByUserId(userId);
    }

    @Override
    public long getTotalSoldTickets() {
        return this.ticketRepo.getTotalSoldTickets();
    }

    @Override
    public long getSoldTicketsByEventId(int eventId) {
        return this.ticketRepo.getSoldTicketsByEventId(eventId);
    }

}
