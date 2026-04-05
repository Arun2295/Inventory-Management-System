package com.example.inventory_management_system.DashboardReporting.Service;

import com.example.inventory_management_system.DashboardReporting.DTO.PurchaseSummary;
import com.example.inventory_management_system.DashboardReporting.DTO.SalesSummaryResponse;
import com.example.inventory_management_system.DashboardReporting.DTO.StockAlertResponse;
import java.util.List;

public interface ReportingServiceInterface {

    SalesSummaryResponse getSalesSummary();

    PurchaseSummary getPurchaseSummary();

    List<StockAlertResponse> getStockAlert();

}
