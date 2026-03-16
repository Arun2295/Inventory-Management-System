package com.example.inventory_management_system.Product.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestDto {

    private String productname;
    private String sku;
    private String category;
    private double price;
    private int currentstock;
    private int reorderlevel;

    

}
