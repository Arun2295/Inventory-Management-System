package com.example.inventory_management_system.InvoiceGeneration.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.inventory_management_system.InvoiceGeneration.Entity.InvoiceEntity;

public interface InvoiceRepo extends MongoRepository<InvoiceEntity, String>{

}
