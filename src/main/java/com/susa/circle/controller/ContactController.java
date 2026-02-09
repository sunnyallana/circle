package com.susa.circle.controller;

import com.susa.circle.dto.request.ContactRequest;
import com.susa.circle.dto.response.ApiResponse;
import com.susa.circle.dto.response.ContactResponse;
import com.susa.circle.security.CustomUserDetails;
import com.susa.circle.service.ContactExportService;
import com.susa.circle.service.ContactImportService;
import com.susa.circle.service.ContactService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
@Slf4j
public class ContactController {

    private final ContactService contactService;
    private final ContactExportService contactExportService;
    private final ContactImportService contactImportService;

    @PostMapping
    public ResponseEntity<ApiResponse<ContactResponse>> createContact(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody ContactRequest request
    ) {
        log.info("Create contact endpoint called");
        ContactResponse response = contactService.createContact(
            userDetails.getId(),
            request
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success("Contact created successfully", response)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ContactResponse>>> getAllContacts(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "firstName") String sortBy,
        @RequestParam(defaultValue = "ASC") String sortDir
    ) {
        log.info("Get all contacts endpoint called");

        Sort sort = sortDir.equalsIgnoreCase("DESC")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ContactResponse> response = contactService.getAllContacts(
            userDetails.getId(),
            pageable
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ContactResponse>>> searchContacts(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestParam String query,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "firstName") String sortBy,
        @RequestParam(defaultValue = "ASC") String sortDir
    ) {
        log.info("Search contacts endpoint called with query: {}", query);

        Sort sort = sortDir.equalsIgnoreCase("DESC")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ContactResponse> response = contactService.searchContacts(
            userDetails.getId(),
            query,
            pageable
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactResponse>> getContactById(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Long id
    ) {
        log.info("Get contact by id endpoint called");
        ContactResponse response = contactService.getContactById(
            userDetails.getId(),
            id
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactResponse>> updateContact(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Long id,
        @Valid @RequestBody ContactRequest request
    ) {
        log.info("Update contact endpoint called");
        ContactResponse response = contactService.updateContact(
            userDetails.getId(),
            id,
            request
        );
        return ResponseEntity.ok(
            ApiResponse.success("Contact updated successfully", response)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContact(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Long id
    ) {
        log.info("Delete contact endpoint called");
        contactService.deleteContact(userDetails.getId(), id);
        return ResponseEntity.ok(
            ApiResponse.success("Contact deleted successfully", null)
        );
    }

    // Export endpoints
    @GetMapping("/export/json")
    public ResponseEntity<byte[]> exportContactsAsJson(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("Export contacts as JSON endpoint called");
        byte[] jsonData = contactExportService.exportContactsAsJson(
            userDetails.getId()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setContentDispositionFormData("attachment", "contacts.json");

        return ResponseEntity.ok().headers(headers).body(jsonData);
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportContactsAsCsv(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("Export contacts as CSV endpoint called");
        byte[] csvData = contactExportService.exportContactsAsCsv(
            userDetails.getId()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "contacts.csv");

        return ResponseEntity.ok().headers(headers).body(csvData);
    }

    // Import endpoints
    @PostMapping("/import/json")
    public ResponseEntity<
        ApiResponse<List<ContactResponse>>
    > importContactsFromJson(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestParam("file") MultipartFile file
    ) {
        log.info("Import contacts from JSON endpoint called");

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("File is empty", null)
            );
        }

        List<ContactResponse> importedContacts =
            contactImportService.importContactsFromJson(
                userDetails.getId(),
                file
            );

        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success(
                "Successfully imported " +
                    importedContacts.size() +
                    " contacts",
                importedContacts
            )
        );
    }

    @PostMapping("/import/csv")
    public ResponseEntity<
        ApiResponse<List<ContactResponse>>
    > importContactsFromCsv(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestParam("file") MultipartFile file
    ) {
        log.info("Import contacts from CSV endpoint called");

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("File is empty", null)
            );
        }

        List<ContactResponse> importedContacts =
            contactImportService.importContactsFromCsv(
                userDetails.getId(),
                file
            );

        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success(
                "Successfully imported " +
                    importedContacts.size() +
                    " contacts",
                importedContacts
            )
        );
    }
}
