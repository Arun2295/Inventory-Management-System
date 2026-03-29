package com.example.inventory_management_system.PurchaseOrderModule.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.inventory_management_system.PurchaseOrderModule.Entity.PurchaseEntity;

public interface PurchaseOrderRepo extends MongoRepository<PurchaseEntity, String> {

}
