package com.example.inventory_management_system.CustomerSupplierManagement.Service;

import com.example.inventory_management_system.CustomerSupplierManagement.DTO.CustomerRequest;
import com.example.inventory_management_system.CustomerSupplierManagement.DTO.CustomerResponse;
import com.example.inventory_management_system.CustomerSupplierManagement.Entity.Customer;
import java.util.List;

public interface CustomerService {

    CustomerResponse createCustomer(CustomerRequest customerRequest);

    List<CustomerResponse> getAllCustomers();



}
