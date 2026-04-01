package com.example.inventory_management_system.GRNModule.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.inventory_management_system.GRNModule.DTO.GrnRequest;
import com.example.inventory_management_system.GRNModule.DTO.GrnResponse;
import com.example.inventory_management_system.GRNModule.Service.GrnService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import java.util.List;


@RestController
@RequestMapping("/grn")
public class GrnController {

    @Autowired
    private  GrnService grnService;


    @GetMapping
    public ResponseEntity<List<GrnResponse>> getAllGrns(){
        List<GrnResponse> response = grnService.getAllGrns();
        return ResponseEntity.ok(response);
    }

    @PostMapping

    public ResponseEntity<GrnResponse>  createGrn(@RequestBody GrnRequest grnRequest){
        GrnResponse response  = grnService.createGrn(grnRequest);
        return ResponseEntity.ok(response);
    }
}
