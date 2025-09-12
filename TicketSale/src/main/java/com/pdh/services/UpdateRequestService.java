/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.services;

import com.pdh.pojo.UpdateRequest;
import com.pdh.pojo.User;
import java.util.List;

/**
 *
 * @author duchi
 */
public interface UpdateRequestService {
    List<UpdateRequest> getUpdateRequests();
    UpdateRequest getUpdateRequestById(int id);
    List<UpdateRequest> getUpdateRequestsByUser(User user);
    List<UpdateRequest> getUpdateRequestsByStatus(String status);
    boolean addUpdateRequest(UpdateRequest updateRequest);
    boolean updateUpdateRequest(UpdateRequest updateRequest);
    boolean deleteUpdateRequest(int id);
}
