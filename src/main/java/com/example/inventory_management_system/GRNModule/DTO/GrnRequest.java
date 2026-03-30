package com.example.inventory_management_system.GRNModule.DTO;

import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GrnRequest {

    private String purchaseOrderId;
    private List<GrnItemRequest> items;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GrnItemRequest{

        private String productId;
        private int quantity;

    }

}
