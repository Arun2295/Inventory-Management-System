package com.example.inventory_management_system.DashboardReporting.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.inventory_management_system.InvoiceGeneration.Entity.InvoiceEntity;
import com.example.inventory_management_system.InvoiceGeneration.Enum.InvoiceStatus;

public interface ReportingRepo extends MongoRepository<InvoiceEntity, String> {

    long countByStatus(InvoiceStatus status);

}
