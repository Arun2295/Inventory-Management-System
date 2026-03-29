package com.example.inventory_management_system.PurchaseOrderModule.DTO;

import java.time.LocalDate;

import com.example.inventory_management_system.PurchaseOrderModule.Enum.PurchaseOrderStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrderResponse {

    private String id;
    private String supplierId;
    private List<ItemResponse> items;
    private LocalDate expectedDeliveryDate;
    private PurchaseOrderStatus status;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ItemResponse{
        private String productId;
        private int quantity;
    }

}
