package com.example.inventory_management_system.GRNModule.Entity;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "grn")
public class GrnEntity {

    @Id
    private String id;

    private String purchaseOrderId;
    private List<GrnItem> items;
    private LocalDate receivedDate;



}
