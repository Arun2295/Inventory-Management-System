package com.example.inventory_management_system.GRNModule.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.inventory_management_system.GRNModule.Entity.GrnEntity;

public interface GrnRepo extends MongoRepository<GrnEntity, String> {

}
