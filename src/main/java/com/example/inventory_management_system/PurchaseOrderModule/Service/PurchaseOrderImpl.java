package com.example.inventory_management_system.PurchaseOrderModule.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventory_management_system.PurchaseOrderModule.DTO.PurchaseOrderRequest;
import com.example.inventory_management_system.PurchaseOrderModule.DTO.PurchaseOrderResponse;
import com.example.inventory_management_system.PurchaseOrderModule.Entity.PurchaseEntity;
import com.example.inventory_management_system.PurchaseOrderModule.Entity.PurchaseOrderItem;
import com.example.inventory_management_system.PurchaseOrderModule.Enum.PurchaseOrderStatus;
import com.example.inventory_management_system.PurchaseOrderModule.Repository.PurchaseOrderRepo;

@Service
public class PurchaseOrderImpl implements PurchaseOrderInterface{

    @Autowired
    private PurchaseOrderRepo purchaseOrderRepo;

    @Override
    public PurchaseOrderResponse createOrder(PurchaseOrderRequest request){

        PurchaseEntity purchase = new PurchaseEntity();
        purchase.setSupplierId(request.getSupplierId());
        purchase.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
        purchase.setStatus(PurchaseOrderStatus.ORDERED);

        List<PurchaseOrderItem> items = new ArrayList<>();

        for(PurchaseOrderRequest.ItemRequest itemRequest : request.getItems()){
            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setProductId(itemRequest.getProductId());
            item.setQuantity(itemRequest.getQuantity());
            items.add(item);
        }
        purchase.setItems(items);
        PurchaseEntity savedPurchase = purchaseOrderRepo.save(purchase);
        return mapToResponse(savedPurchase);

    }

    @Override
    public List<PurchaseOrderResponse> getAllOrders(){
        List<PurchaseEntity> purchase = purchaseOrderRepo.findAll();

        List<PurchaseOrderResponse> responses  = new ArrayList<>();

        for(PurchaseEntity p: purchase){
            responses.add(mapToResponse(p));
        }
        return responses;
    }


    @Override
    public PurchaseOrderResponse updateStatus(String id, PurchaseOrderStatus status){
        PurchaseEntity purchase = purchaseOrderRepo.findById(id).orElseThrow(()-> new RuntimeException("Order not found"));

        if(purchase.getStatus() == PurchaseOrderStatus.RECEIVED){
            throw new RuntimeException("Orderes already Received");
        }
        purchase.setStatus(status);
        PurchaseEntity updated = purchaseOrderRepo.save(purchase);
        return mapToResponse(updated);
    }

    private PurchaseOrderResponse mapToResponse(PurchaseEntity purchase){

        List<PurchaseOrderResponse.ItemResponse> items = new ArrayList<>();

        for(PurchaseOrderItem item : purchase.getItems()){
            items.add(new PurchaseOrderResponse.ItemResponse(item.getProductId(), item.getQuantity()));

        }
        return new PurchaseOrderResponse(
            purchase.getId(),
            purchase.getSupplierId(),
            items,
            purchase.getExpectedDeliveryDate(),
            purchase.getStatus()
            
        );
    }


}


