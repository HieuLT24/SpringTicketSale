/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;

/**
 *
 * @author duchi
 */
@Entity
@Table(name = "update_request")
@NamedQueries({
    @NamedQuery(name = "UpdateRequest.findAll", query = "SELECT u FROM UpdateRequest u"),
    @NamedQuery(name = "UpdateRequest.findById", query = "SELECT u FROM UpdateRequest u WHERE u.id = :id"),
    @NamedQuery(name = "UpdateRequest.findByUserId", query = "SELECT u FROM UpdateRequest u WHERE u.userId = :userId"),
    @NamedQuery(name = "UpdateRequest.findByStatus", query = "SELECT u FROM UpdateRequest u WHERE u.status = :status")})
public class UpdateRequest implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @NotNull
    @Column(name = "id")
    private Integer id;
    
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private User userId;
    
    @Size(max = 45)
    @Column(name = "status")
    private String status;
    
    @Column(name = "request_date")
    private LocalDateTime requestDate;
    

    public UpdateRequest() {
    }

    public UpdateRequest(Integer id) {
        this.id = id;
    }

    public UpdateRequest(User userId, String status, LocalDateTime requestDate, String message) {
        this.userId = userId;
        this.status = status;
        this.requestDate = requestDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
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
        if (!(object instanceof UpdateRequest)) {
            return false;
        }
        UpdateRequest other = (UpdateRequest) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.pdh.pojo.UpdateRequest[ id=" + id + " ]";
    }
}
