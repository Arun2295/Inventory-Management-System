package com.example.inventory_management_system.SalesOrderModule.Service;

import com.example.inventory_management_system.SalesOrderModule.DTO.SalesOrderRequest;
import com.example.inventory_management_system.SalesOrderModule.DTO.SalesOrderResponse;
import com.example.inventory_management_system.SalesOrderModule.Enum.OrderStatus;

import java.util.List;

public interface SalesOrderInterface {


    SalesOrderResponse createOrder(SalesOrderRequest requestorder);

    List<SalesOrderResponse> getAllOrders();

    SalesOrderResponse  getOrderById(String id, OrderStatus status);



}
