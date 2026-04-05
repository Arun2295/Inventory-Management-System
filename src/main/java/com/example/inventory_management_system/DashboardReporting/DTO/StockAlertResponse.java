package com.example.inventory_management_system.DashboardReporting.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockAlertResponse {

    private String productId;
    private String productName;
    private int currentStock;
    private int reorderLevel;

}
