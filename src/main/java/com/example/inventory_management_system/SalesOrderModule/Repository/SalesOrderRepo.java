package com.example.inventory_management_system.SalesOrderModule.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.inventory_management_system.SalesOrderModule.Entity.SalesEntity;

public interface SalesOrderRepo  extends MongoRepository<SalesEntity, String>{

}
