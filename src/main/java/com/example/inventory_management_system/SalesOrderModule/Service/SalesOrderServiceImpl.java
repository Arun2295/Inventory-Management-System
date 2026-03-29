package com.example.inventory_management_system.SalesOrderModule.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventory_management_system.Product.Repository.ProductRepo;
import com.example.inventory_management_system.SalesOrderModule.DTO.SalesOrderRequest;
import com.example.inventory_management_system.SalesOrderModule.Repository.SalesOrderRepo;
import com.example.inventory_management_system.SalesOrderModule.DTO.SalesOrderResponse;
import com.example.inventory_management_system.SalesOrderModule.Entity.SalesEntity;
import com.example.inventory_management_system.SalesOrderModule.Enum.OrderStatus;
import com.example.inventory_management_system.SalesOrderModule.Entity.SalesOrderItem;
import com.example.inventory_management_system.Product.Entity.Product;
import com.example.inventory_management_system.Product.Entity.ProductEntity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service 
public class SalesOrderServiceImpl implements SalesOrderInterface{

    @Autowired
    private SalesOrderRepo salesOrderRepo;

    @Autowired
    private ProductRepo productRepo;

    //create Order
    @Override
    public SalesOrderResponse createOrder(SalesOrderRequest request){
        SalesEntity order = new SalesEntity();
        order.setCustomerId(request.getCustomerId());
        order.setOrderDate(LocalDate.now());
        order.setStatus(OrderStatus.PENDING);
        
        List<SalesOrderItem> items = new ArrayList<>();
        double totalAmount = 0;
        for(SalesOrderRequest.ItemRequest itemReq : request.getItems()){
            ProductEntity product = productRepo.findById(itemReq.getProductid()).orElseThrow(() -> new RuntimeException("Product not found"));

            SalesOrderItem item = new SalesOrderItem();
            item.setProductId(product.getId());
            item.setPrice(product.getPrice());
            item.setQuantity(itemReq.getQuantity());

            totalAmount = totalAmount + product.getPrice() * itemReq.getQuantity();
            items.add(item);

        }
        order.setItems(items);
        order.setTotalAmount(totalAmount);
        SalesEntity saved = salesOrderRepo.save(order);
        return mapToResponse(saved);


    }

    //Get All orders
    @Override
    public List<SalesOrderResponse> getAllOrders(){
        List<SalesEntity> orders = salesOrderRepo.findAll();
        List<SalesOrderResponse> responseList = new ArrayList<>();
        for(SalesEntity order:orders){
            responseList.add(mapToResponse(order));
        }
        return responseList;
    }


    @Override

    public SalesOrderResponse updateStatus(String id, OrderStatus status){
        SalesEntity order = salesOrderRepo.findById(id).orElseThrow(()-> new RuntimeException("Order not found"));
        if(order.getStatus()==OrderStatus.APPROVED){
            throw new RuntimeException("Order Already APPROVED");

        }
        if(status==OrderStatus.APPROVED){
            for(SalesOrderItem item: order.getItems()){

                ProductEntity product = productRepo.findById(item.getProductId()).orElseThrow(()-> new RuntimeException("Product not found"));

                if(product.getCurrentstock()< item.getQuantity()){
                    throw new RuntimeException("Insufficient Stock");
                }
                product.setCurrentstock(product.getCurrentstock()-item.getQuantity());
                productRepo.save(product);

            }
        }
        order.setStatus(status);
        SalesEntity updated = salesOrderRepo.save(order);
        return mapToResponse(updated);
    }

    private SalesOrderResponse mapToResponse(SalesEntity order){
        List<SalesOrderResponse.ItemResponse> items = new ArrayList<>();
        for(SalesOrderItem item: order.getItems()){

            SalesOrderResponse.ItemResponse restItem = new SalesOrderResponse.ItemResponse(
                item.getProductId(),
                "N/A",
                item.getPrice(),
                item.getQuantity()
            );
            items.add(restItem);
        }
        return new SalesOrderResponse(
            order.getId(),
            order.getCustomerId(),
            order.getOrderDate(),
            order.getStatus(),
            order.getTotalAmount(),
            items
        );
    }


}
