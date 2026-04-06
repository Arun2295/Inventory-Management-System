
package com.example.inventory_management_system.DTO;
import com.example.inventory_management_system.Enum.Role;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateRoleRequest {

    private String userId;
    private Role role;

}
