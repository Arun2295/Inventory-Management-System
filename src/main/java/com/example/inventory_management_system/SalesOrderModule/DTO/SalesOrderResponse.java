package com.example.inventory_management_system.SalesOrderModule.DTO;

import java.time.LocalDate;

import com.example.inventory_management_system.SalesOrderModule.Enum.OrderStatus;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalesOrderResponse {

    private String id;
    private String customerId;
    private LocalDate orderDate;
    private OrderStatus status;
    private double totalAmount;
    private List<ItemResponse> items;


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ItemResponse{
        private String productid;
        private String productname;
        private double price;
        private int quantity;

    }

}
