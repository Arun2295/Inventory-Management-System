package com.example.inventory_management_system.CustomerSupplierManagement.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.inventory_management_system.CustomerSupplierManagement.Entity.Customer;

public interface CutomerRepo extends MongoRepository<Customer, String> {

}
