package com.example.inventory_management_system.GRNModule.Service;

import com.example.inventory_management_system.GRNModule.DTO.GrnRequest;
import com.example.inventory_management_system.GRNModule.DTO.GrnResponse;
import java.util.List;

public interface GrnService {

    GrnResponse createGrn(GrnRequest grnRequest);

    List<GrnResponse> getAllGrns();
}
