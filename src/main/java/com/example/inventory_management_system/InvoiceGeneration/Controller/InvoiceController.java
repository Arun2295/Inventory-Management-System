package com.example.inventory_management_system.InvoiceGeneration.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.inventory_management_system.InvoiceGeneration.DTO.InvoiceResponse;
import com.example.inventory_management_system.InvoiceGeneration.Service.InvoiceServiceInterface;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private  InvoiceServiceInterface invoiceService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE') or hasRole('ACCOUNTANT')")
    public ResponseEntity<List<InvoiceResponse>> getAllInvoices(){
        List<InvoiceResponse> response = invoiceService.getAllInvoices();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{salesOrderId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE') or hasRole('ACCOUNTANT')")
    public ResponseEntity<InvoiceResponse> generateInvoice(@PathVariable String salesOrderId){
        InvoiceResponse response  = invoiceService.generateInvoice(salesOrderId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE') or hasRole('ACCOUNTANT')")
    public ResponseEntity<byte[]> generateInvoicePDF(@PathVariable String id){
        byte[] pdf = invoiceService.generateInvoicePDF(id);
        return ResponseEntity.ok().header("Content Disposition", "attachment; filename=invoice.pdf").contentType(MediaType.APPLICATION_PDF).body(pdf);
    }


}
