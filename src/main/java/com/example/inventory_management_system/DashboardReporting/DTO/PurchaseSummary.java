package com.example.inventory_management_system.DashboardReporting.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseSummary {

    private int totalOrders;
    private long receivedOrders;

}
