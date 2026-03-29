package com.example.inventory_management_system.PurchaseOrderModule.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderItem {

    private String productId;
    private int quantity;

}
