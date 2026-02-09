package com.susa.circle.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.susa.circle.dto.request.ContactRequest;
import com.susa.circle.dto.response.ContactResponse;
import com.susa.circle.entity.Contact;
import com.susa.circle.entity.ContactEmail;
import com.susa.circle.entity.ContactPhone;
import com.susa.circle.entity.User;
import com.susa.circle.enums.EmailType;
import com.susa.circle.enums.PhoneType;
import com.susa.circle.exception.BadRequestException;
import com.susa.circle.exception.ResourceNotFoundException;
import com.susa.circle.mapper.ContactMapper;
import com.susa.circle.repository.ContactRepository;
import com.susa.circle.repository.UserRepository;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class ContactImportService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public ContactImportService(
        ContactRepository contactRepository,
        UserRepository userRepository
    ) {
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(
            SerializationFeature.WRITE_DATES_AS_TIMESTAMPS
        );
    }

    @Transactional
    public List<ContactResponse> importContactsFromJson(
        Long userId,
        MultipartFile file
    ) {
        log.info("Importing contacts from JSON for user id: {}", userId);

        User user = userRepository
            .findById(userId)
            .orElseThrow(() ->
                new ResourceNotFoundException("User", "id", userId)
            );

        try {
            List<ContactRequest> contactRequests = objectMapper.readValue(
                file.getInputStream(),
                new TypeReference<List<ContactRequest>>() {}
            );

            List<Contact> contacts = new ArrayList<>();
            for (ContactRequest request : contactRequests) {
                Contact contact = buildContactFromRequest(user, request);
                contacts.add(contact);
            }

            List<Contact> savedContacts = contactRepository.saveAll(contacts);
            log.info(
                "Successfully imported {} contacts from JSON",
                savedContacts.size()
            );

            return savedContacts
                .stream()
                .map(ContactMapper::toResponse)
                .collect(Collectors.toList());
        } catch (IOException e) {
            log.error("Error importing contacts from JSON", e);
            throw new BadRequestException(
                "Failed to import contacts from JSON: " + e.getMessage()
            );
        }
    }

    @Transactional
    public List<ContactResponse> importContactsFromCsv(
        Long userId,
        MultipartFile file
    ) {
        log.info("Importing contacts from CSV for user id: {}", userId);

        User user = userRepository
            .findById(userId)
            .orElseThrow(() ->
                new ResourceNotFoundException("User", "id", userId)
            );

        try (
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(
                    file.getInputStream(),
                    StandardCharsets.UTF_8
                )
            );
            CSVParser csvParser = new CSVParser(
                reader,
                CSVFormat.DEFAULT.builder()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .setIgnoreHeaderCase(true)
                    .setTrim(true)
                    .build()
            )
        ) {
            List<Contact> contacts = new ArrayList<>();

            for (CSVRecord record : csvParser) {
                Contact contact = buildContactFromCsvRecord(user, record);
                contacts.add(contact);
            }

            List<Contact> savedContacts = contactRepository.saveAll(contacts);
            log.info(
                "Successfully imported {} contacts from CSV",
                savedContacts.size()
            );

            return savedContacts
                .stream()
                .map(ContactMapper::toResponse)
                .collect(Collectors.toList());
        } catch (IOException e) {
            log.error("Error importing contacts from CSV", e);
            throw new BadRequestException(
                "Failed to import contacts from CSV: " + e.getMessage()
            );
        }
    }

    private Contact buildContactFromRequest(User user, ContactRequest request) {
        Contact contact = Contact.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .title(request.getTitle())
            .user(user)
            .build();

        if (request.getEmails() != null) {
            List<ContactEmail> emails = request
                .getEmails()
                .stream()
                .map(emailReq ->
                    ContactEmail.builder()
                        .email(emailReq.getEmail())
                        .type(emailReq.getType())
                        .contact(contact)
                        .build()
                )
                .collect(Collectors.toList());
            contact.setEmails(emails);
        }

        if (request.getPhones() != null) {
            List<ContactPhone> phones = request
                .getPhones()
                .stream()
                .map(phoneReq ->
                    ContactPhone.builder()
                        .phoneNumber(phoneReq.getPhoneNumber())
                        .type(phoneReq.getType())
                        .contact(contact)
                        .build()
                )
                .collect(Collectors.toList());
            contact.setPhones(phones);
        }

        return contact;
    }

    private Contact buildContactFromCsvRecord(User user, CSVRecord record) {
        Contact contact = Contact.builder()
            .firstName(record.get("First Name"))
            .lastName(record.get("Last Name"))
            .title(record.get("Title").isEmpty() ? null : record.get("Title"))
            .user(user)
            .build();

        // Parse emails
        String emailsStr = record.get("Emails");
        if (emailsStr != null && !emailsStr.trim().isEmpty()) {
            List<ContactEmail> emails = parseEmails(emailsStr, contact);
            contact.setEmails(emails);
        }

        // Parse phones
        String phonesStr = record.get("Phones");
        if (phonesStr != null && !phonesStr.trim().isEmpty()) {
            List<ContactPhone> phones = parsePhones(phonesStr, contact);
            contact.setPhones(phones);
        }

        return contact;
    }

    private List<ContactEmail> parseEmails(String emailsStr, Contact contact) {
        List<ContactEmail> emails = new ArrayList<>();
        Pattern pattern = Pattern.compile("([^;]+)\\s*\\(([^)]+)\\)");

        String[] emailParts = emailsStr.split(";");
        for (String part : emailParts) {
            part = part.trim();
            if (!part.isEmpty()) {
                Matcher matcher = pattern.matcher(part);
                if (matcher.find()) {
                    String email = matcher.group(1).trim();
                    String type = matcher.group(2).trim().toUpperCase();

                    EmailType emailType;
                    try {
                        emailType = EmailType.valueOf(type);
                    } catch (IllegalArgumentException e) {
                        emailType = EmailType.PERSONAL;
                    }

                    emails.add(
                        ContactEmail.builder()
                            .email(email)
                            .type(emailType)
                            .contact(contact)
                            .build()
                    );
                }
            }
        }

        return emails;
    }

    private List<ContactPhone> parsePhones(String phonesStr, Contact contact) {
        List<ContactPhone> phones = new ArrayList<>();
        Pattern pattern = Pattern.compile("([^;]+)\\s*\\(([^)]+)\\)");

        String[] phoneParts = phonesStr.split(";");
        for (String part : phoneParts) {
            part = part.trim();
            if (!part.isEmpty()) {
                Matcher matcher = pattern.matcher(part);
                if (matcher.find()) {
                    String phone = matcher.group(1).trim();
                    String type = matcher.group(2).trim().toUpperCase();

                    PhoneType phoneType;
                    try {
                        phoneType = PhoneType.valueOf(type);
                    } catch (IllegalArgumentException e) {
                        phoneType = PhoneType.PERSONAL;
                    }

                    phones.add(
                        ContactPhone.builder()
                            .phoneNumber(phone)
                            .type(phoneType)
                            .contact(contact)
                            .build()
                    );
                }
            }
        }

        return phones;
    }
}
