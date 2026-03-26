package com.example.inventory_management_system.SalesOrderModule.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalesOrderItem {

    private String productId;
    private int quantity;
    private double price;

}
