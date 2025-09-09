/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.services.EventShowService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author duchi
 */
@RestController
@CrossOrigin
@RequestMapping("/api/categories")
public class ApiCategoryController {
    @Autowired
    private EventShowService eventService;
    
    @GetMapping("/{cateId}")
    public ResponseEntity<?> getEventsByCateId(@PathVariable int cateId, HttpServletRequest request) {
        return ResponseEntity.ok(eventService.getEventsByCateId(cateId));
    }
}
