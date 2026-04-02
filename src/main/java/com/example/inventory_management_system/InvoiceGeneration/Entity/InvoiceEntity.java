package com.example.inventory_management_system.InvoiceGeneration.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "invoices")
public class InvoiceEntity {

    @Id
    private String id;
    private String salesOrderId;
    private String customerId;
    

}
