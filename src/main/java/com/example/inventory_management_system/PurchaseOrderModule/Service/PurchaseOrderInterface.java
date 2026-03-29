package com.example.inventory_management_system.PurchaseOrderModule.Service;


import com.example.inventory_management_system.PurchaseOrderModule.DTO.PurchaseOrderRequest;
import com.example.inventory_management_system.PurchaseOrderModule.DTO.PurchaseOrderResponse;
import com.example.inventory_management_system.PurchaseOrderModule.Enum.PurchaseOrderStatus;
import java.util.List;

public interface PurchaseOrderInterface {

    PurchaseOrderResponse createOrder(PurchaseOrderRequest request);

    List<PurchaseOrderResponse> getAllOrders();
    
    PurchaseOrderResponse updateStatus(String id, PurchaseOrderStatus status);

}
