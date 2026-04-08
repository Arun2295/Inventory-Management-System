package com.example.inventory_management_system.SalesOrderModule.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.example.inventory_management_system.SalesOrderModule.DTO.SalesOrderRequest;
import com.example.inventory_management_system.SalesOrderModule.DTO.SalesOrderResponse;
import com.example.inventory_management_system.SalesOrderModule.Enum.OrderStatus;
import com.example.inventory_management_system.SalesOrderModule.Service.SalesOrderInterface;

@RestController
@RequestMapping("/api/sales-order")
public class SalesOrderController {

    @Autowired
    private SalesOrderInterface salesOrderInterface;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    public ResponseEntity<List<SalesOrderResponse>> getAllOrders(){
        List<SalesOrderResponse> orders = salesOrderInterface.getAllOrders();
        return ResponseEntity.ok(orders);

    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    public ResponseEntity<SalesOrderResponse> createOrder(@RequestBody SalesOrderRequest request){
        SalesOrderResponse response  = salesOrderInterface.createOrder(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    public ResponseEntity<SalesOrderResponse> updateStatus(@PathVariable String id, @RequestParam OrderStatus status){
        SalesOrderResponse response = salesOrderInterface.updateStatus(id, status);
        return ResponseEntity.ok(response);
    }

}
