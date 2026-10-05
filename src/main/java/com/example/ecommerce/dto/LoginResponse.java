package com.example.ecommerce.dto;

import com.example.ecommerce.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String email;
    private String name;
    private Role role;
}