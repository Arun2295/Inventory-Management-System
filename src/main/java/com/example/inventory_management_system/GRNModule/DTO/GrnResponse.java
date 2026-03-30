package com.example.inventory_management_system.GRNModule.DTO;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class GrnResponse {

    private String id;
    private String purchaseOrderId;
    private LocalDate receivedDate;
    private List<GrnItemResponse> items;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GrnItemResponse{
        private String productId;
        private int quantity;
    }

}
