package com.example.inventory_management_system.SalesOrderModule.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.example.inventory_management_system.SalesOrderModule.DTO.SalesOrderRequest;
import com.example.inventory_management_system.SalesOrderModule.DTO.SalesOrderResponse;
import com.example.inventory_management_system.SalesOrderModule.Enum.OrderStatus;
import com.example.inventory_management_system.SalesOrderModule.Service.SalesOrderInterface;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/sales-order")
public class Controller {

    @Autowired
    private SalesOrderInterface salesOrderInterface;

    @GetMapping
    public ResponseEntity<List<SalesOrderResponse>> getAllOrders(){
        List<SalesOrderResponse> orders = salesOrderInterface.getAllOrders();
        return ResponseEntity.ok(orders);

    }

    @PostMapping
    public ResponseEntity<SalesOrderResponse> createOrder(@RequestBody SalesOrderRequest request){
        SalesOrderResponse response  = salesOrderInterface.createOrder(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SalesOrderResponse> updateStatus(@PathVariable String id, @RequestParam OrderStatus status){
        SalesOrderResponse response = salesOrderInterface.updateStatus(id, status);
        return ResponseEntity.ok(response);
    }

}
