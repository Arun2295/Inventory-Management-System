package com.example.inventory_management_system.CustomerSupplierManagement.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import com.example.inventory_management_system.CustomerSupplierManagement.DTO.CustomerResponse;
import com.example.inventory_management_system.CustomerSupplierManagement.DTO.CustomerRequest;


import com.example.inventory_management_system.CustomerSupplierManagement.DTO.CustomerRequest;
import com.example.inventory_management_system.CustomerSupplierManagement.Service.CustomerService;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALESEXECUTIVE')")
    public ResponseEntity<CustomerResponse> createCustomer(@RequestBody CustomerRequest customerRequest){
        CustomerResponse response = customerService.createCustomer(customerRequest);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')or hasRole('SALESEXECUTIVE')")
    public ResponseEntity<List<CustomerResponse>> getAllCustomers(){
        List<CustomerResponse> customer = customerService.getAllCustomers();
        return ResponseEntity.ok(customer);
    }




}
