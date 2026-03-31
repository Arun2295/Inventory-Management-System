package com.example.inventory_management_system.GRNModule.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventory_management_system.GRNModule.DTO.GrnRequest;
import com.example.inventory_management_system.GRNModule.DTO.GrnResponse;
import com.example.inventory_management_system.GRNModule.Entity.GrnEntity;
import com.example.inventory_management_system.GRNModule.Entity.GrnItem;
import com.example.inventory_management_system.GRNModule.Repository.GrnRepo;
import com.example.inventory_management_system.Product.Entity.ProductEntity;
import com.example.inventory_management_system.Product.Repository.ProductRepo;
import com.example.inventory_management_system.PurchaseOrderModule.Entity.PurchaseEntity;
import com.example.inventory_management_system.PurchaseOrderModule.Repository.PurchaseOrderRepo;
import java.util.ArrayList;
import java.util.List;

@Service
public class GrnServiceImpl implements GrnService {

    @Autowired
    private GrnRepo grnRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private  PurchaseOrderRepo purchaseOrderRepo;


    // create grn
    @Override

    public GrnResponse createGrn(GrnRequest request){

        PurchaseEntity purchaseEntity = purchaseOrderRepo.findById(request.getPurchaseOrderId()).orElseThrow(() -> new RuntimeException("Purchase Order not found"));

        GrnEntity grn = new GrnEntity();

        grn.setPurchaseOrderId(request.getPurchaseOrderId());
        grn.setReceivedDate(java.time.LocalDate.now());
        List<GrnItem> item = new ArrayList<>();

        for(GrnRequest.GrnItemRequest items : request.getItems()){

            ProductEntity product = productRepo.findById(items.getProductId()).orElseThrow(()-> new RuntimeException("Product not found"));

            product.setCurrentstock(product.getCurrentstock()+items.getQuantity());
            productRepo.save(product);

            GrnItem grnItem = new GrnItem();
            grnItem.setProductId(items.getProductId());
            grnItem.setQuantity(items.getQuantity());
            item.add(grnItem);
        }
        grn.setItems(item);

        GrnEntity saved = grnRepo.save(grn);
        return mapToResponse(saved);

    }

    @Override
    public List<GrnResponse> getAllGrn(){
        List<GrnEntity> grnEntities = grnRepo.findAll();
        List<GrnResponse> responses = new ArrayList<>();

        for(GrnEntity grn: grnEntities){
            responses.add(mapToResponse(grn));
        }
        return responses;
    }

    private GrnResponse mapToResponse(GrnEntity grnEntity){

        List<GrnResponse.GrnItemResponse> itemResponses = new ArrayList<>();
        for(GrnItem grn: grnEntity.getItems()){
            itemResponses.add(new GrnResponse.GrnItemResponse(grn.getProductId(), grn.getQuantity()));

        }
        return new GrnResponse(
            grnEntity.getId(),
            grnEntity.getPurchaseOrderId(),
            grnEntity.getReceivedDate(),
            itemResponses
        );
    }



}
