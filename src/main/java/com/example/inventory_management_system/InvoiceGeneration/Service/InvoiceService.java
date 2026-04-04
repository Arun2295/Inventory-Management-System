package com.example.inventory_management_system.InvoiceGeneration.Service;

import java.io.ByteArrayOutputStream;
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
//import com.itextpdf.io.font.woff2.Woff2Common.Table;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

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

    @Override
    public byte[] generateInvoicePDF(String Id){

        InvoiceEntity invoice = invoiceRepo.findById(Id).orElseThrow(()-> new RuntimeException("Invoice Not Found"));

        try{

            ByteArrayOutputStream out =  new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("INVOICE").setBold().setFontSize(20));
            document.add(new Paragraph("Invoice ID: " + invoice.getId()));
            document.add(new Paragraph("Customer ID: " + invoice.getCustomerId()));
            document.add(new Paragraph("Created Date: " + invoice.getCreatedDate()));
            document.add(new Paragraph("\n"));

            float[] columnWidths = {150, 100, 100, 100};
            com.itextpdf.layout.element.Table table = new com.itextpdf.layout.element.Table(columnWidths);
            table.addHeaderCell("Product");
            table.addHeaderCell("Price");
            table.addHeaderCell("Quantity");
            table.addHeaderCell("Total");

            for(InvoiceItem item: invoice.getItems()){
                table.addCell(item.getProductId());
                table.addCell(String.valueOf(item.getPrice()));
                table.addCell(String.valueOf(item.getQuantity()));
                table.addCell(String.valueOf(item.getPrice()*item.getQuantity()));

            }
            document.add(table);
            document.add(new Paragraph("\n"));

            document.add(new Paragraph("Total Amount: " + invoice.getTotalAmount()));
            document.add(new Paragraph("GST (18%): " + invoice.getTax()));
            document.add(new Paragraph("Total Payable: " + invoice.getTotalPayable()).setBold());

            document.close();
            return out.toByteArray();

        }catch(Exception e){
            throw new RuntimeException("Error generating PDF: " + e.getMessage());
        }

    }

    




}
