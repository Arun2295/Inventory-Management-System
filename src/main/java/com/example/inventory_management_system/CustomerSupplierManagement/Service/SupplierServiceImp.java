package com.example.inventory_management_system.CustomerSupplierManagement.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventory_management_system.CustomerSupplierManagement.DTO.SupplierRequest;
import com.example.inventory_management_system.CustomerSupplierManagement.DTO.SupplierResponse;
import com.example.inventory_management_system.CustomerSupplierManagement.Repository.SupplierRepo;
import java.util.ArrayList;
import com.example.inventory_management_system.CustomerSupplierManagement.Entity.Supplier;
import java.util.List;


@Service
public class SupplierServiceImp implements SupplierService{

    @Autowired
    private SupplierRepo supplierRepo;

    @Override
    public  SupplierResponse createSupplier(SupplierRequest supplierRequest){
        Supplier supplier = new Supplier();
        supplier.setName(supplierRequest.getName());
        supplier.setEmail(supplierRequest.getEmail());
        supplier.setNumber(supplierRequest.getNumber());
        supplier.setAddress(supplierRequest.getAddress());
        Supplier savedSupplier = supplierRepo.save(supplier);
        return convertToResponse(savedSupplier);
    }

    @Override
    public List<SupplierResponse> getAllSuppliers(){
        List<Supplier> supplier = supplierRepo.findAll();
        List<SupplierResponse> supplierResponse = new ArrayList<>();
        for(Supplier s: supplier){
            SupplierResponse response  = convertToResponse(s);
            supplierResponse.add(response);

        } 
        return supplierResponse;
    }
    @Override
    public SupplierResponse getSupplierbyId(String id){
        Supplier supplier = supplierRepo.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));
        return convertToResponse(supplier);
    }
    private SupplierResponse convertToResponse(Supplier supplier){
                        return new SupplierResponse(
                                supplier.getId(),
                                supplier.getName(),
                                supplier.getEmail(),
                                supplier.getNumber(),
                                supplier.getAddress()
                        );
    }

}
