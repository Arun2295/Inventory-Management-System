package com.example.inventory_management_system.Product.Service;

import com.example.inventory_management_system.Product.DTO.RequestDto;
import com.example.inventory_management_system.Product.DTO.ResponseDto;

import io.swagger.v3.oas.annotations.servers.Server;

import java.util.List;


public interface ProductService {

    ResponseDto createProduct(RequestDto requestdto);

    List<ResponseDto> getAllProducts();

    ResponseDto updateProduct(String id, RequestDto requestdto);

    ResponseDto deleteProduct(String id);

}
