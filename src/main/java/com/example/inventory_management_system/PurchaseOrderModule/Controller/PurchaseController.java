
package com.example.inventory_management_system.PurchaseOrderModule.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.example.inventory_management_system.PurchaseOrderModule.DTO.PurchaseOrderRequest;
import com.example.inventory_management_system.PurchaseOrderModule.DTO.PurchaseOrderResponse;
import com.example.inventory_management_system.PurchaseOrderModule.Enum.PurchaseOrderStatus;
import com.example.inventory_management_system.PurchaseOrderModule.Service.PurchaseOrderInterface;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/purchase-order")
public class PurchaseController {

    @Autowired
    private PurchaseOrderInterface purchaseOrderInterface;

    @GetMapping
    public ResponseEntity<List<PurchaseOrderResponse>> getAllOrders(){
        List<PurchaseOrderResponse> orders = purchaseOrderInterface.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<PurchaseOrderResponse> createOrder(@RequestBody PurchaseOrderRequest request){
        PurchaseOrderResponse response = purchaseOrderInterface.createOrder(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PurchaseOrderResponse> updateStatus(@PathVariable String id, @RequestParam PurchaseOrderStatus status){
        PurchaseOrderResponse response = purchaseOrderInterface.updateStatus(id, status);
        return ResponseEntity.ok(response);
    }

}
