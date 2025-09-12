package com.pdh.dto;

public class TicketDTO {
    private Integer id;
    private Double price;
    private String seatNumber;
    private String status;
    private Integer eventShowId;
    private Integer userId;

    public TicketDTO() {}

    public TicketDTO(Integer id, Double price, String seatNumber, String status, Integer eventShowId, Integer userId) {
        this.id = id;
        this.price = price;
        this.seatNumber = seatNumber;
        this.status = status;
        this.eventShowId = eventShowId;
        this.userId = userId;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getEventShowId() { return eventShowId; }
    public void setEventShowId(Integer eventShowId) { this.eventShowId = eventShowId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
}


