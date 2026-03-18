package com.example.inventory_management_system.Product.Controller;

import java.net.http.HttpResponse.ResponseInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.inventory_management_system.Product.Service.ProductService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import com.example.inventory_management_system.Product.DTO.RequestDto;
import com.example.inventory_management_system.Product.DTO.ResponseDto;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/all")
    public ResponseEntity<List<ResponseDto>> getallproducts(){
        List<ResponseDto> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseDto> createProduct(@RequestBody RequestDto requestdto){
        ResponseDto responseDto = productService.createProduct(requestdto);
        return ResponseEntity.status(201).body(responseDto);


    }
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseDto> updateProduct(@PathVariable String id, @RequestBody RequestDto requestDto){
        ResponseDto responseDto = productService.updateProduct(id, requestDto);
        return ResponseEntity.ok(responseDto);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseDto> deleteProduct(@PathVariable String id){
        ResponseDto responseDto  = productService.deleteProduct(id);
        return ResponseEntity.ok(responseDto);
    }

}
