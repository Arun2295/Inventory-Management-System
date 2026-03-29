package com.example.inventory_management_system.PurchaseOrderModule.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.inventory_management_system.SalesOrderModule.Enum.OrderStatus;
import com.example.inventory_management_system.PurchaseOrderModule.Enum.PurchaseOrderStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "purchase-orders")
public class PurchaseEntity {

    @Id
    private String id;
    private String supplierId;
    private List<PurchaseOrderItem> items;
    private LocalDate expectedDeliveryDate;
    private PurchaseOrderStatus status;


}
