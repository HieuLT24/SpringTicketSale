/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.services.impl;

import com.pdh.pojo.UpdateRequest;
import com.pdh.pojo.User;
import com.pdh.repositories.UpdateRequestRepository;
import com.pdh.services.UpdateRequestService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author duchi
 */
@Service
public class UpdateRequestServiceImpl implements UpdateRequestService {

    @Autowired
    private UpdateRequestRepository updateRequestRepository;

    @Override
    public List<UpdateRequest> getUpdateRequests() {
        return this.updateRequestRepository.getUpdateRequests();
    }

    @Override
    public UpdateRequest getUpdateRequestById(int id) {
        return this.updateRequestRepository.getUpdateRequestById(id);
    }

    @Override
    public List<UpdateRequest> getUpdateRequestsByUser(User user) {
        return this.updateRequestRepository.getUpdateRequestsByUser(user);
    }

    @Override
    public List<UpdateRequest> getUpdateRequestsByStatus(String status) {
        return this.updateRequestRepository.getUpdateRequestsByStatus(status);
    }

    @Override
    public boolean addUpdateRequest(UpdateRequest updateRequest) {
        return this.updateRequestRepository.addUpdateRequest(updateRequest);
    }

    @Override
    public boolean updateUpdateRequest(UpdateRequest updateRequest) {
        return this.updateRequestRepository.updateUpdateRequest(updateRequest);
    }

    @Override
    public boolean deleteUpdateRequest(int id) {
        return this.updateRequestRepository.deleteUpdateRequest(id);
    }
}
