package com.example.inventory_management_system.Product.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.inventory_management_system.Product.Entity.ProductEntity;
import java.util.List;


public interface ProductRepo extends MongoRepository<ProductEntity, String> {
    List<ProductEntity> findByProductname(String productname);

}
