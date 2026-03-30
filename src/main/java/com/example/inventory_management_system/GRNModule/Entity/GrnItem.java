package com.example.inventory_management_system.GRNModule.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GrnItem {

    private String productId;
    private int quantity;

}
