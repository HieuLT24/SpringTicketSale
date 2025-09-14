package com.pdh.dto;

import java.util.Date;

public class EventDTO {
    private Integer id;
    private String name;
    private String description;
    private String image;
    private Date time;
    private String address;
    private Integer capacity;
    private Double ticketPrice;
    private Integer categoryId;
    private String categoryName;
    private Integer organizerId;
    private String organizerName;

    public EventDTO() {}

    public EventDTO(Integer id, String name, String description, String image, Date time, 
                   String address, Integer capacity, Double ticketPrice, Integer categoryId, 
                   String categoryName, Integer organizerId, String organizerName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.time = time;
        this.address = address;
        this.capacity = capacity;
        this.ticketPrice = ticketPrice;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.organizerId = organizerId;
        this.organizerName = organizerName;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Date getTime() { return time; }
    public void setTime(Date time) { this.time = time; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Double getTicketPrice() { return ticketPrice; }
    public void setTicketPrice(Double ticketPrice) { this.ticketPrice = ticketPrice; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Integer getOrganizerId() { return organizerId; }
    public void setOrganizerId(Integer organizerId) { this.organizerId = organizerId; }

    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }
}
