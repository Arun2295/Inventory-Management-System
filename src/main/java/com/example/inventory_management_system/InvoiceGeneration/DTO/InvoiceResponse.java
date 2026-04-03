package com.example.inventory_management_system.InvoiceGeneration.DTO;

import java.time.LocalDate;

import com.example.inventory_management_system.InvoiceGeneration.Enum.InvoiceStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceResponse {

    private String id;
    private String salesOrderId;
    private String customerId;
    private String totalAmount;
    private String tax;
    private String totalPayable;
    private InvoiceStatus status;
    private LocalDate createdDate;
    

}
