package com.susa.circle.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.susa.circle.dto.response.ContactResponse;
import com.susa.circle.entity.Contact;
import com.susa.circle.entity.ContactEmail;
import com.susa.circle.entity.ContactPhone;
import com.susa.circle.exception.BadRequestException;
import com.susa.circle.mapper.ContactMapper;
import com.susa.circle.repository.ContactRepository;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class ContactExportService {

    private final ContactRepository contactRepository;
    private final ObjectMapper objectMapper;

    public ContactExportService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(
            SerializationFeature.WRITE_DATES_AS_TIMESTAMPS
        );
    }

    @Transactional(readOnly = true)
    public byte[] exportContactsAsJson(Long userId) {
        log.info("Exporting contacts as JSON for user id: {}", userId);

        List<Contact> contacts = contactRepository
            .findAll()
            .stream()
            .filter(contact -> contact.getUser().getId().equals(userId))
            .collect(Collectors.toList());

        List<ContactResponse> contactResponses = contacts
            .stream()
            .map(ContactMapper::toResponse)
            .collect(Collectors.toList());

        try {
            byte[] jsonBytes = objectMapper.writeValueAsBytes(contactResponses);
            log.info(
                "Successfully exported {} contacts as JSON",
                contacts.size()
            );
            return jsonBytes;
        } catch (IOException e) {
            log.error("Error exporting contacts as JSON", e);
            throw new BadRequestException("Failed to export contacts as JSON");
        }
    }

    @Transactional(readOnly = true)
    public byte[] exportContactsAsCsv(Long userId) {
        log.info("Exporting contacts as CSV for user id: {}", userId);

        List<Contact> contacts = contactRepository
            .findAll()
            .stream()
            .filter(contact -> contact.getUser().getId().equals(userId))
            .collect(Collectors.toList());

        try (
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            OutputStreamWriter writer = new OutputStreamWriter(
                out,
                StandardCharsets.UTF_8
            );
            CSVPrinter csvPrinter = new CSVPrinter(
                writer,
                CSVFormat.DEFAULT.builder()
                    .setHeader(
                        "First Name",
                        "Last Name",
                        "Title",
                        "Emails",
                        "Phones"
                    )
                    .build()
            )
        ) {
            for (Contact contact : contacts) {
                String emails = contact
                    .getEmails()
                    .stream()
                    .map(this::formatEmail)
                    .collect(Collectors.joining("; "));

                String phones = contact
                    .getPhones()
                    .stream()
                    .map(this::formatPhone)
                    .collect(Collectors.joining("; "));

                csvPrinter.printRecord(
                    contact.getFirstName(),
                    contact.getLastName(),
                    contact.getTitle() != null ? contact.getTitle() : "",
                    emails,
                    phones
                );
            }

            csvPrinter.flush();
            log.info(
                "Successfully exported {} contacts as CSV",
                contacts.size()
            );
            return out.toByteArray();
        } catch (IOException e) {
            log.error("Error exporting contacts as CSV", e);
            throw new BadRequestException("Failed to export contacts as CSV");
        }
    }

    private String formatEmail(ContactEmail email) {
        return email.getEmail() + " (" + email.getType() + ")";
    }

    private String formatPhone(ContactPhone phone) {
        return phone.getPhoneNumber() + " (" + phone.getType() + ")";
    }
}
