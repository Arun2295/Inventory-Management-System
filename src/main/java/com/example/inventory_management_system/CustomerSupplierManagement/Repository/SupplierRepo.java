package com.example.inventory_management_system.CustomerSupplierManagement.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.inventory_management_system.CustomerSupplierManagement.Entity.Supplier;

@Repository
public interface SupplierRepo extends MongoRepository<Supplier, String> {

}
