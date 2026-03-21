package com.example.inventory_management_system.CustomerSupplierManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierRequest {

    private String name;
    private String email;
    private Long number;
    private String address;

}
