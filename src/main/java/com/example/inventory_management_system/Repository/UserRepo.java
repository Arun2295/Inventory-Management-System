package com.example.inventory_management_system.Repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.inventory_management_system.Entity.User;


public interface UserRepo extends MongoRepository<User, ObjectId>{
    Optional<User> findByEmail(String email);
    Optional<User> findById(ObjectId id);
    Optional<User> findByRole(String role);

}
