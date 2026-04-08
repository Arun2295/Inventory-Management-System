package com.example.inventory_management_system.GRNModule.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.inventory_management_system.GRNModule.DTO.GrnRequest;
import com.example.inventory_management_system.GRNModule.DTO.GrnResponse;
import com.example.inventory_management_system.GRNModule.Service.GrnService;

import java.util.List;


@RestController
@RequestMapping("/api/grn")
public class GrnController {

    @Autowired
    private  GrnService grnService;


    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INVENTORY_MANAGER') or hasRole('PURCHASE_MANAGER')")
    public ResponseEntity<List<GrnResponse>> getAllGrns(){
        List<GrnResponse> response = grnService.getAllGrns();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INVENTORY_MANAGER') or hasRole('PURCHASE_MANAGER')")
    public ResponseEntity<GrnResponse>  createGrn(@RequestBody GrnRequest grnRequest){
        GrnResponse response  = grnService.createGrn(grnRequest);
        return ResponseEntity.ok(response);
    }
}
