package com.example.inventory_management_system.CustomerSupplierManagement.Entity;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "customer")
public class Customer {
    private String name;
    private String email;
    private Long number;
    private String address;
    

}
