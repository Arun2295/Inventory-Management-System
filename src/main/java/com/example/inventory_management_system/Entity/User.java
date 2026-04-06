package com.example.inventory_management_system.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import com.example.inventory_management_system.Enum.Role;


@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "users")
public class User {

    @Id
    private ObjectId id;
    private String username;
    private String password;
    @Indexed(unique = true)
    private String email;
    private Role role;

}
