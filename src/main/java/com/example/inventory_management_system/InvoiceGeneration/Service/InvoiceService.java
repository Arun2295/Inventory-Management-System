package com.example.inventory_management_system.InvoiceGeneration.Service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.inventory_management_system.InvoiceGeneration.DTO.InvoiceResponse;
import com.example.inventory_management_system.InvoiceGeneration.Entity.InvoiceEntity;
import com.example.inventory_management_system.InvoiceGeneration.Entity.InvoiceItem;
import com.example.inventory_management_system.InvoiceGeneration.Enum.InvoiceStatus;
import com.example.inventory_management_system.InvoiceGeneration.Repository.InvoiceRepo;
import com.example.inventory_management_system.SalesOrderModule.Entity.SalesEntity;
import com.example.inventory_management_system.SalesOrderModule.Entity.SalesOrderItem;
import com.example.inventory_management_system.SalesOrderModule.Enum.OrderStatus;
import com.example.inventory_management_system.SalesOrderModule.Repository.SalesOrderRepo;
import java.util.ArrayList;
import java.util.List;

@Service
public class InvoiceService implements InvoiceServiceInterface {

    @Autowired
    private InvoiceRepo invoiceRepo;

    @Autowired
    protected SalesOrderRepo salesOrderRepo;

    public static final double GST = 0.18;


    // Gene invoice
    @Override
    public InvoiceResponse generateInvoice(String salesOrderId){
        SalesEntity order = salesOrderRepo.findById(salesOrderId).orElseThrow(()-> new RuntimeException("Sales order not found"));
        if(order.getStatus() != OrderStatus.APPROVED && order.getStatus() != OrderStatus.DISPATCHED){
            throw new RuntimeException("Order is not approved yet");
        }
        InvoiceEntity invoice = new InvoiceEntity();
        invoice.setId(order.getId());
        invoice.setSalesOrderId(order.getId());
        invoice.setCustomerId(order.getCustomerId());
        invoice.setCreatedDate(LocalDate.now());
        invoice.setStatus(InvoiceStatus.UNPAID);

        List<InvoiceItem> items = new ArrayList<>();
        double total = 0;

        for(SalesOrderItem item: order.getItems()){

            InvoiceItem invoiceItem = new InvoiceItem(
                item.getProductId(),
                "N/A",
                item.getQuantity(),
                item.getPrice()
            );
            total += item.getPrice() * item.getQuantity();
            items.add(invoiceItem);
        }
        double tax = total * GST;
        double totalPayable = total + tax;

        invoice.setItems(items);
        invoice.setTotalAmount(total);
        invoice.setTax(tax);
        invoice.setTotalPayable(totalPayable);
        InvoiceEntity saved = invoiceRepo.save(invoice);

        return new InvoiceResponse(
            saved.getId(),
            saved.getSalesOrderId(),
            saved.getCustomerId(),
            saved.getItems(),
            saved.getTotalAmount(),
            saved.getTax(),
            saved.getTotalPayable(),
            saved.getStatus(),
            saved.getCreatedDate()
        );


    }

    //Get All
    @Override
    public List<InvoiceResponse> getAllInvoices(){
         return invoiceRepo.findAll().stream().map(inv -> new InvoiceResponse(
            inv.getId(),
            inv.getSalesOrderId(),
            inv.getCustomerId(),
            inv.getItems(),
            inv.getTotalAmount(),
            inv.getTax(),
            inv.getTotalPayable(),
            inv.getStatus(),
            inv.getCreatedDate()
         )).toList();

    }

    




}
