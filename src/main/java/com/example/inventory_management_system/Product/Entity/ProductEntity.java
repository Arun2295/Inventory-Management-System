package com.example.inventory_management_system.Product.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "products")
public class ProductEntity {

    @Id
    private String id;
    private String productname;
    private String sku;
    private String category;
    private double price;
    private int currentstock;
    private int reorderlevel;

}
