package com.example.inventory_management_system.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.inventory_management_system.Entity.User;
import com.example.inventory_management_system.Repository.UserRepo;

@Service
public class ImplementUserDetails implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        User user = userRepo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));
        String roleName = (user.getRole() != null) ? user.getRole().name() : "PENDING";
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(roleName)
                .build();
    }

}
