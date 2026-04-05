package com.example.inventory_management_system.DashboardReporting.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.inventory_management_system.DashboardReporting.Service.ReportingServiceImpl;
import com.example.inventory_management_system.DashboardReporting.Service.ReportingServiceInterface;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private  ReportingServiceInterface reportingInterface;

    @GetMapping("sales-summary")
    public ResponseEntity<?> getSalesSummary(){
        return ResponseEntity.ok(reportingInterface.getSalesSummary());
    }

    @GetMapping("purchase-summary")
    public ResponseEntity<?> getPurchaseSummary(){
        return ResponseEntity.ok(reportingInterface.getPurchaseSummary());
    }

    @GetMapping("stock-alert")
    public ResponseEntity<?> getStockAlert(){
        return ResponseEntity.ok(reportingInterface.getStockAlert());
    }

}
