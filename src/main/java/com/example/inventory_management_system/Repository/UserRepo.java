package com.example.inventory_management_system.Repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.inventory_management_system.Entity.User;
import com.example.inventory_management_system.Enum.Role;
import java.util.List;


public interface UserRepo extends MongoRepository<User, ObjectId>{
    Optional<User> findByEmail(String email);
    Optional<User> findById(ObjectId id);
    List<User> findByRole(Role role);

}
