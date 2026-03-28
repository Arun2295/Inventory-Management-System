package com.example.inventory_management_system.SalesOrderModule.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalesOrderRequest {
    
    private String customerId;
    private  List<ItemRequest> items;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ItemRequest{
        private String productid;
        private int quantity;
    }

}
