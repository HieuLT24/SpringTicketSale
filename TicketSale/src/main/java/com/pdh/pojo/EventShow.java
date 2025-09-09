/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 *
 * @author duchi
 */
@Entity
@Table(name = "event_show")
@NamedQueries({
    @NamedQuery(name = "EventShow.findAll", query = "SELECT e FROM EventShow e"),
    @NamedQuery(name = "EventShow.findById", query = "SELECT e FROM EventShow e WHERE e.id = :id"),
    @NamedQuery(name = "EventShow.findByName", query = "SELECT e FROM EventShow e WHERE e.name = :name"),
    @NamedQuery(name = "EventShow.findByDescription", query = "SELECT e FROM EventShow e WHERE e.description = :description"),
    @NamedQuery(name = "EventShow.findByImage", query = "SELECT e FROM EventShow e WHERE e.image = :image"),
    @NamedQuery(name = "EventShow.findByTime", query = "SELECT e FROM EventShow e WHERE e.time = :time"),
    @NamedQuery(name = "EventShow.findByAddress", query = "SELECT e FROM EventShow e WHERE e.address = :address"),
    @NamedQuery(name = "EventShow.findByCapacity", query = "SELECT e FROM EventShow e WHERE e.capacity = :capacity"),
    @NamedQuery(name = "EventShow.findByTicketPrice", query = "SELECT e FROM EventShow e WHERE e.ticketPrice = :ticketPrice")})
public class EventShow implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "id")
    private Integer id;
    @Size(max = 45)
    @Column(name = "name")
    private String name;
    @Size(max = 255)
    @Column(name = "description")
    private String description;
    @Size(max = 255)
    @Column(name = "image")
    private String image;
    @Column(name = "time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date time;
    @Size(max = 100)
    @Column(name = "address")
    private String address;
    @Column(name = "capacity")
    private Integer capacity;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "ticket_price")
    private Double ticketPrice;
    @OneToMany(mappedBy = "eventShowId")
    @JsonIgnore
    private Collection<Ticket> ticketCollection;
    @JoinColumn(name = "category", referencedColumnName = "id")
    @ManyToOne
    private Category category;

    public EventShow() {
    }

    public EventShow(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }


    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Double getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(Double ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public Collection<Ticket> getTicketCollection() {
        return ticketCollection;
    }

    public void setTicketCollection(Collection<Ticket> ticketCollection) {
        this.ticketCollection = ticketCollection;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof EventShow)) {
            return false;
        }
        EventShow other = (EventShow) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.pdh.pojo.EventShow[ id=" + id + " ]";
    }
    
}
