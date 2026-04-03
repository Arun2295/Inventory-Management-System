package com.example.inventory_management_system.InvoiceGeneration.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceItem {

    private String productId;
    private String productName;
    private int quantity;
    private double price;

}
