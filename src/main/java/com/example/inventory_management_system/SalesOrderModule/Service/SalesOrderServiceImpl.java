package com.example.inventory_management_system.SalesOrderModule.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventory_management_system.Product.Repository.ProductRepo;
import com.example.inventory_management_system.SalesOrderModule.DTO.SalesOrderRequest;
import com.example.inventory_management_system.SalesOrderModule.Repository.SalesOrderRepo;
import com.example.inventory_management_system.SalesOrderModule.DTO.SalesOrderResponse;
import com.example.inventory_management_system.SalesOrderModule.Entity.SalesEntity;
import com.example.inventory_management_system.SalesOrderModule.Enum.OrderStatus;

import java.time.LocalDate;
import java.util.List;

@Service
public class SalesOrderServiceImpl implements SalesOrderInterface{

    @Autowired
    private SalesOrderRepo salesOrderRepo;

    @Autowired
    private ProductRepo productRepo;

    @Override
    public SalesOrderResponse createOrder(SalesOrderRequest request){
        SalesEntity order = new SalesEntity();
        order.setCustomerId(request.getCustomerId());
        order.setOrderDate(LocalDate.now());
        order.setStatus(OrderStatus.PENDING);


    }


}
