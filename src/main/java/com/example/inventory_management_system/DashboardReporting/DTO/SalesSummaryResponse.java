package com.example.inventory_management_system.DashboardReporting.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalesSummaryResponse {

    private double totalSales;
    private int totalOrders; 
    private List<TopProducts>  topProducts;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TopProducts{
        private String productId;
        private String productName;
        private int quantity;
    }


}
