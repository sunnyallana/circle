package com.susa.circle.controller;

import com.susa.circle.dto.request.ChangePasswordRequest;
import com.susa.circle.dto.request.LoginRequest;
import com.susa.circle.dto.request.RegisterRequest;
import com.susa.circle.dto.response.ApiResponse;
import com.susa.circle.dto.response.AuthResponse;
import com.susa.circle.dto.response.UserResponse;
import com.susa.circle.security.CustomUserDetails;
import com.susa.circle.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
        @Valid @RequestBody RegisterRequest request
    ) {
        log.info("Register endpoint called");
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success("User registered successfully", response)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
        @Valid @RequestBody LoginRequest request
    ) {
        log.info("Login endpoint called");
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(
            ApiResponse.success("Login successful", response)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("Get current user endpoint called");
        UserResponse response = authService.getCurrentUser(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody ChangePasswordRequest request
    ) {
        log.info("Change password endpoint called");
        authService.changePassword(userDetails.getId(), request);
        return ResponseEntity.ok(
            ApiResponse.success("Password changed successfully", null)
        );
    }
}
