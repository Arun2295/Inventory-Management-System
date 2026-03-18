package com.example.inventory_management_system.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import com.example.inventory_management_system.DTO.LoginDto;
import com.example.inventory_management_system.DTO.RegisterDto;
import com.example.inventory_management_system.Entity.User;
import com.example.inventory_management_system.Repository.UserRepo;
import com.example.inventory_management_system.Security.Cookies;
import com.example.inventory_management_system.Security.ImplementUserDetails;
import com.example.inventory_management_system.Security.JwtUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private ImplementUserDetails userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private Cookies cookies;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto register) {

        if(userRepo.findByEmail(register.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User user = new User();
        
        user.setUsername(register.getUsername());
        user.setEmail(register.getEmail());
        user.setPassword(passwordEncoder.encode(register.getPassword()));
        
        userRepo.save(user);

        // Auto login after successful registration
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(register.getEmail(), register.getPassword()));
            String token = jwtUtil.generateToken(register.getEmail());
            return ResponseEntity.ok().header("set-cookie", cookies.createJwtcookie(token).toString())
                    .body("Registration and login successful");
        } catch (AuthenticationException e) {
            return ResponseEntity.ok("Registration successful, but auto-login failed");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        var userOptional = userRepo.findByEmail(userDetails.getUsername());
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Return public info
            return ResponseEntity.ok(java.util.Map.of(
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole()
            ));
        }

        return ResponseEntity.status(401).body("User not found");
    }

    @PostMapping("/Login")
    public ResponseEntity<?> login(@RequestBody LoginDto login) {
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(login.getEmail(), login.getPassword()));
            UserDetails userDetails = userDetailsService.loadUserByUsername(login.getEmail());
            String token = jwtUtil.generateToken(login.getEmail());
            return ResponseEntity.ok().header("set-cookie", cookies.createJwtcookie(token).toString())
                    .body("Login Successfully");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid credentials");

        }
    }

    @PostMapping("/Logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok().header("set-cookie", cookies.createlogoutcookie("").toString())
                .body("Logout Successfully");
    }

}
