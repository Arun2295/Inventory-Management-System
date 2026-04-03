package com.example.inventory_management_system.InvoiceGeneration.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.inventory_management_system.InvoiceGeneration.Enum.InvoiceStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "invoices")
public class InvoiceEntity {

    @Id
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
