package com.example.inventory_management_system.InvoiceGeneration.Service;

import com.example.inventory_management_system.InvoiceGeneration.DTO.InvoiceResponse;
import java.util.List;

public interface InvoiceServiceInterface {

    List<InvoiceResponse> getAllInvoices();
    InvoiceResponse generateInvoice(String salesOrderId);
    byte[] generateInvoicePDF(String id);
}
