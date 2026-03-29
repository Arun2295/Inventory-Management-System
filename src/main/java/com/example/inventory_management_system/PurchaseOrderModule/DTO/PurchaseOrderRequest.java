package com.example.inventory_management_system.PurchaseOrderModule.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrderRequest {

    private String supplierId;
    private List<ItemRequest> items;
    private LocalDate expectedDeliveryDate;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ItemRequest{
        private String productId;
        private int quantity;
    }


}
