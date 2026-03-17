package com.example.inventory_management_system.Product.Service;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.inventory_management_system.Product.DTO.RequestDto;
import com.example.inventory_management_system.Product.Entity.ProductEntity;
import com.example.inventory_management_system.Product.Repository.ProductRepo;
import com.example.inventory_management_system.Product.DTO.ResponseDto;
import java.util.ArrayList;
import java.util.List;


public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepo productRepo;

    @Override
    public ResponseDto createProduct(RequestDto requestdto){

        ProductEntity productEntity = new ProductEntity();

        productEntity.setProductname(requestdto.getProductname());
        productEntity.setSku(requestdto.getSku());
        productEntity.setCategory(requestdto.getCategory());
        productEntity.setPrice(requestdto.getPrice());
        productEntity.setCurrentstock(requestdto.getCurrentstock());
        productEntity.setReorderlevel(requestdto.getReorderlevel());

        ProductEntity savedProduct = productRepo.save(productEntity);
        return convertToResponseDto(savedProduct);
    }
    @Override
    public List<ResponseDto> getAllProducts(){
        List<ProductEntity> products = productRepo.findAll();

        List<ResponseDto> responsedto = new ArrayList<>();

        for(ProductEntity product: products){
            ResponseDto dto = convertToResponseDto(product);
            responsedto.add(dto);

        }
        return responsedto;

    }
    
    @Override
    public ResponseDto updateProduct(String id, RequestDto requestDto){
        ProductEntity productEntity = productRepo.findById(id).orElseThrow(()-> new RuntimeException("Product not found"));

        productEntity.setProductname(requestDto.getProductname());
        productEntity.setSku(requestDto.getSku());
        productEntity.setCategory(requestDto.getCategory());
        productEntity.setPrice(requestDto.getPrice());
        productEntity.setCurrentstock(requestDto.getCurrentstock());
        productEntity.setReorderlevel(requestDto.getReorderlevel());

        ProductEntity updatedproduct = productRepo.save(productEntity);

        return convertToResponseDto(updatedproduct);

    }

    @Override
    public ResponseDto deleteProduct(String id){
        ProductEntity productEntity = productRepo.findById(id).orElseThrow(()-> new RuntimeException("Product with id "+id+" not found"));
        productRepo.delete(productEntity);
        return convertToResponseDto(productEntity);
    }

    private ResponseDto convertToResponseDto(ProductEntity productEntity){
        return new ResponseDto(
            productEntity.getId(),
            productEntity.getProductname(),
            productEntity.getSku(),
            productEntity.getCategory(),
            productEntity.getPrice(),
            productEntity.getCurrentstock(),
            productEntity.getReorderlevel()
        );
    }

}
