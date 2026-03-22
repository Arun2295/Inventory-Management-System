package com.example.inventory_management_system.CustomerSupplierManagement.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "supplier")

public class Supplier {

    @Id
    private String id;

    private String name;
    private String email;
    private Long number;
    private String address;


}
