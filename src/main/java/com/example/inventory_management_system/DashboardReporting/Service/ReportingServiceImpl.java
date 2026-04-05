package com.example.inventory_management_system.DashboardReporting.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventory_management_system.DashboardReporting.DTO.PurchaseSummary;
import com.example.inventory_management_system.DashboardReporting.DTO.SalesSummaryResponse;
import com.example.inventory_management_system.DashboardReporting.DTO.StockAlertResponse;
import com.example.inventory_management_system.InvoiceGeneration.Enum.InvoiceStatus;
import com.example.inventory_management_system.InvoiceGeneration.Repository.InvoiceRepo;
import com.example.inventory_management_system.Product.Entity.ProductEntity;
import com.example.inventory_management_system.Product.Repository.ProductRepo;
import com.example.inventory_management_system.PurchaseOrderModule.Entity.PurchaseEntity;
import com.example.inventory_management_system.PurchaseOrderModule.Enum.PurchaseOrderStatus;
import com.example.inventory_management_system.PurchaseOrderModule.Repository.PurchaseOrderRepo;
import com.example.inventory_management_system.SalesOrderModule.Entity.SalesEntity;
import com.example.inventory_management_system.SalesOrderModule.Entity.SalesOrderItem;
import com.example.inventory_management_system.SalesOrderModule.Repository.SalesOrderRepo;
import java.util.Comparator;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@Service
public class ReportingServiceImpl implements ReportingServiceInterface {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private SalesOrderRepo salesOrderRepo;

    @Autowired
    private PurchaseOrderRepo purchaseOrderRepo;

    @Autowired
    private InvoiceRepo invoiceRepo;

    @Override
    public SalesSummaryResponse getSalesSummary(){

        List<SalesEntity> orders = salesOrderRepo.findAll();
        double totalSales=0;
        int totalOrders = orders.size();

        Map<String, Integer> productCount = new HashMap<>();

        for (SalesEntity order : orders) {
            totalSales += order.getTotalAmount();

            if (order.getItems() == null) {
                continue;
            }

            for (SalesOrderItem item : order.getItems()) {
                if (item == null || item.getProductId() == null) {
                    continue;
                }

                productCount.put(
                        item.getProductId(),
                        productCount.getOrDefault(item.getProductId(), 0) + item.getQuantity());
            }
        }

        List<Map.Entry<String, Integer>> topProductEntries = productCount.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(5)
                .toList();

        List<SalesSummaryResponse.TopProducts> topProducts = topProductEntries.stream()
                .map(e -> new SalesSummaryResponse.TopProducts(
                        e.getKey(),
                        productRepo.findById(e.getKey()).map(ProductEntity::getProductname).orElse(null),
                        e.getValue()))
                .toList();

        long pendingInvoices = invoiceRepo.countByStatus(InvoiceStatus.UNPAID);

        return new SalesSummaryResponse(
                totalSales,
                totalOrders,
                topProducts,
                pendingInvoices);


    }
    @Override
    public PurchaseSummary  getPurchaseSummary(){

        List<PurchaseEntity> order = purchaseOrderRepo.findAll();
        int totalOrders = order.size();

        long receivedOrders = order.stream()
            .filter(o -> o.getStatus() == PurchaseOrderStatus.RECEIVED)
            .count();

        return new PurchaseSummary(totalOrders, receivedOrders);
    }

    @Override
    public List<StockAlertResponse> getStockAlert(){

        List<ProductEntity> product = productRepo.findAll();

        List<StockAlertResponse> alerts = new ArrayList<>();

        for (ProductEntity p : product) {
            if (p.getCurrentstock() < p.getReorderlevel()) {
                alerts.add(new StockAlertResponse(
                        p.getId(),
                        p.getProductname(),
                        p.getCurrentstock(),
                        p.getReorderlevel()));
            }
        }

        return alerts;

    }




}
