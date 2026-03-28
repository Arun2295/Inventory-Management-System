package com.example.inventory_management_system.SalesOrderModule.Entity;

import org.springframework.data.mongodb.core.mapping.Document;

import com.example.inventory_management_system.SalesOrderModule.Enum.OrderStatus;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.Id;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "sales-orders")
public class SalesEntity {

    @Id
    private String id;
    private String customerId; 
    private List<SalesOrderItem> items;
    private LocalDate orderDate;
    private OrderStatus status;
    private double totalAmount;
    
    

}
