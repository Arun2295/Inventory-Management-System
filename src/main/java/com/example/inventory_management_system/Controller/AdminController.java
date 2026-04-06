package com.example.inventory_management_system.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.inventory_management_system.DTO.UpdateRoleRequest;
import com.example.inventory_management_system.Enum.Role;
import com.example.inventory_management_system.Service.UserService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/roles/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllRoles(@PathVariable Role role){
        return ResponseEntity.ok().body(userService.getUserByRole(role));
    }

    @GetMapping("/all-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers(){
        return ResponseEntity.ok().body(userService.getAllUsers());
    }


    @PutMapping("/assign-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignRole(@RequestBody UpdateRoleRequest roleRequest){
        return ResponseEntity.ok().body(userService.assignRole(roleRequest));
    }



}
