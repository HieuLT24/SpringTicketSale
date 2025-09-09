/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.services.CategoryService;
import com.pdh.services.EventShowService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author duchi
 */
@RestController
@CrossOrigin
@RequestMapping("/api")
public class ApiIndexController {
    
    @Autowired
    private EventShowService eventService;
    
    @Autowired
    private CategoryService cateService;
    
    @GetMapping("/events")
    public ResponseEntity<?> getAllEvent(@RequestParam Map<String,String> params, HttpServletRequest request) {
        return ResponseEntity.ok(eventService.getAllEvent(params));
    } 
    
    @GetMapping("/categories")
    public ResponseEntity<?> getCates () {
        return ResponseEntity.ok(cateService.getCates());
    }
    
}
