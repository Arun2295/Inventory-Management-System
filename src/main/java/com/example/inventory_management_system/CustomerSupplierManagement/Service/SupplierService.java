package com.example.inventory_management_system.CustomerSupplierManagement.Service;

import com.example.inventory_management_system.CustomerSupplierManagement.DTO.SupplierRequest;
import com.example.inventory_management_system.CustomerSupplierManagement.DTO.SupplierResponse;
import com.example.inventory_management_system.CustomerSupplierManagement.Repository.SupplierRepo;
import java.util.List;


public interface SupplierService {

    SupplierResponse createSupplier(SupplierRequest supplierRequest);

    List<SupplierResponse> getAllSuppliers();

    SupplierResponse getSupplierbyId(String id);



}
