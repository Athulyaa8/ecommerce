package com.example.ecommerce.dto;

import com.example.ecommerce.model.Role;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @Size(min = 1, message = "Name cannot be empty")
    private String name;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private Role role;
}