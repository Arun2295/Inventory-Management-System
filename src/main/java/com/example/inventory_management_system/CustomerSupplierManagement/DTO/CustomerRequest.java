package com.example.inventory_management_system.CustomerSupplierManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CustomerRequest {

    private String name;
    private String email;
    private Long number;
    private String address;

}
