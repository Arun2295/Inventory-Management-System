package com.example.inventory_management_system.SalesOrderModule.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.inventory_management_system.SalesOrderModule.Service.SalesOrderInterface;

@RestController
@RequestMapping("/api/sales-order")
public class Controller {

    @Autowired
    private SalesOrderInterface salesOrderInterface;

    @GetMapping
    public ResponseEntity<List<SalesOrderRespon

}
