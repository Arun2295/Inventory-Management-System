package com.example.inventory_management_system.InvoiceGeneration.DTO;

import java.time.LocalDate;
import java.util.List;

import com.example.inventory_management_system.InvoiceGeneration.Entity.InvoiceItem;
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
    private List<InvoiceItem> items;
    private double totalAmount;
    private double tax;
    private double totalPayable;
    private InvoiceStatus status;
    private LocalDate createdDate;
    

}
