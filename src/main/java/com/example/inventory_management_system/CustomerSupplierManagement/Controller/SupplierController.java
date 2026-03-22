package com.example.inventory_management_system.CustomerSupplierManagement.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import java.util.List;

import com.example.inventory_management_system.CustomerSupplierManagement.DTO.SupplierRequest;
import com.example.inventory_management_system.CustomerSupplierManagement.DTO.SupplierResponse;
import com.example.inventory_management_system.CustomerSupplierManagement.Service.SupplierService;

@RestController
@RequestMapping("/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @PostMapping("/create")
    public ResponseEntity<?> createSupplier(@RequestBody SupplierRequest supplierRequest){
        SupplierResponse response  = supplierService.createSupplier(supplierRequest);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SupplierResponse>> getAllSuppliers(){
        List<SupplierResponse> supplier = supplierService.getAllSuppliers();
        return ResponseEntity.ok(supplier);
    }
    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponse> getSupplierById(@PathVariable String id){
        SupplierResponse response  = supplierService.getSupplierbyId(id);
        return ResponseEntity.ok(response);
    }



}
