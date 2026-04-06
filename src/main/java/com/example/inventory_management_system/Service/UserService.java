package com.example.inventory_management_system.Service;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventory_management_system.DTO.UpdateRoleRequest;
import com.example.inventory_management_system.Entity.User;
import com.example.inventory_management_system.Enum.Role;
import com.example.inventory_management_system.Repository.UserRepo;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    //assign role to user
    public User assignRole(UpdateRoleRequest roleRequest){

        User user = userRepo.findById(new ObjectId(roleRequest.getUserId())).orElseThrow(() -> new RuntimeException("User not found"));

        if(user.getRole() == Role.ADMIN){
            throw new RuntimeException("Cannot change role of an admin user");
        }
        user.setRole(roleRequest.getRole());
        return userRepo.save(user);
    }
    // all users with role
    public List<User> getUserByRole(Role role){
        return userRepo.findByRole(role);
    }
    //get all users
    public List<User> getAllUsers(){
        return userRepo.findAll();
    }

}
