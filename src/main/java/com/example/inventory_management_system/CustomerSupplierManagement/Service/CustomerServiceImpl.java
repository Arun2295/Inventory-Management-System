package com.example.inventory_management_system.CustomerSupplierManagement.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import com.example.inventory_management_system.CustomerSupplierManagement.DTO.CustomerResponse;
import com.example.inventory_management_system.CustomerSupplierManagement.DTO.CustomerRequest;
import com.example.inventory_management_system.CustomerSupplierManagement.DTO.SupplierRequest;
import com.example.inventory_management_system.CustomerSupplierManagement.DTO.SupplierResponse;
import com.example.inventory_management_system.CustomerSupplierManagement.Entity.Customer;
import com.example.inventory_management_system.CustomerSupplierManagement.Repository.CustomerRepo;




@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepo customerRepo;

    @Override
    public CustomerResponse createCustomer(CustomerRequest customerRequest){
        Customer customer  = new Customer();

        customer.setName(customerRequest.getName());
        customer.setEmail(customerRequest.getEmail());
        customer.setNumber(customerRequest.getNumber());
        customer.setAddress(customerRequest.getAddress());
        Customer savedCustomer = customerRepo.save(customer);
        return convertToResponse(savedCustomer);

    }
    @Override
    public List<CustomerResponse> getAllCustomers(){
        List<Customer> customers = customerRepo.findAll();
        List<CustomerResponse> customerResponse = new ArrayList<>();
        for(Customer c: customers){
            CustomerResponse response = convertToResponse(c);
            customerResponse.add(response);
        }
        return customerResponse;
    }

    private CustomerResponse convertToResponse(Customer customer){
        return new CustomerResponse(
            customer.getId(),
            customer.getName(),
            customer.getEmail(),
            customer.getNumber(),
            customer.getAddress()

        );
    }

}
