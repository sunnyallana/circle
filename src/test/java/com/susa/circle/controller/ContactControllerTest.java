package com.susa.circle.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.susa.circle.dto.request.ContactRequest;
import com.susa.circle.dto.request.EmailRequest;
import com.susa.circle.dto.request.PhoneRequest;
import com.susa.circle.dto.response.ContactResponse;
import com.susa.circle.dto.response.EmailResponse;
import com.susa.circle.dto.response.PhoneResponse;
import com.susa.circle.enums.EmailType;
import com.susa.circle.enums.PhoneType;
import com.susa.circle.security.CustomUserDetails;
import com.susa.circle.security.JwtAuthenticationFilter;
import com.susa.circle.service.ContactService;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
    controllers = ContactController.class,
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = JwtAuthenticationFilter.class
    )
)
@AutoConfigureMockMvc(addFilters = false)
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ContactService contactService;

    private ContactRequest contactRequest;
    private ContactResponse contactResponse;
    private CustomUserDetails userDetails;

    @TestConfiguration
    static class TestConfig {

        @Bean
        public ObjectMapper objectMapper() {
            return new ObjectMapper();
        }
    }

    @BeforeEach
    void setUp() {
        contactRequest = new ContactRequest();
        contactRequest.setFirstName("Jane");
        contactRequest.setLastName("Smith");
        contactRequest.setTitle("Software Engineer");

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setEmail("jane@work.com");
        emailRequest.setType(EmailType.WORK);
        contactRequest.setEmails(Arrays.asList(emailRequest));

        PhoneRequest phoneRequest = new PhoneRequest();
        phoneRequest.setPhoneNumber("+1234567890");
        phoneRequest.setType(PhoneType.WORK);
        contactRequest.setPhones(Arrays.asList(phoneRequest));

        EmailResponse emailResponse = EmailResponse.builder()
            .id(1L)
            .email("jane@work.com")
            .type(EmailType.WORK)
            .build();

        PhoneResponse phoneResponse = PhoneResponse.builder()
            .id(1L)
            .phoneNumber("+1234567890")
            .type(PhoneType.WORK)
            .build();

        contactResponse = ContactResponse.builder()
            .id(1L)
            .firstName("Jane")
            .lastName("Smith")
            .title("Software Engineer")
            .emails(Arrays.asList(emailResponse))
            .phones(Arrays.asList(phoneResponse))
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        userDetails = new CustomUserDetails(
            1L,
            "john@example.com",
            "password",
            true
        );
    }

    @Test
    @WithMockUser
    void testCreateContact_Success() throws Exception {
        when(
            contactService.createContact(anyLong(), any(ContactRequest.class))
        ).thenReturn(contactResponse);

        mockMvc
            .perform(
                post("/api/contacts")
                    .with(user(userDetails))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(contactRequest))
            )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(
                jsonPath("$.message").value("Contact created successfully")
            )
            .andExpect(jsonPath("$.data.firstName").value("Jane"))
            .andExpect(jsonPath("$.data.lastName").value("Smith"))
            .andExpect(jsonPath("$.data.title").value("Software Engineer"));

        verify(contactService).createContact(
            anyLong(),
            any(ContactRequest.class)
        );
    }

    @Test
    @WithMockUser
    void testCreateContact_ValidationError_MissingFirstName() throws Exception {
        contactRequest.setFirstName(null);

        mockMvc
            .perform(
                post("/api/contacts")
                    .with(user(userDetails))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(contactRequest))
            )
            .andExpect(status().isBadRequest());

        verify(contactService, never()).createContact(
            anyLong(),
            any(ContactRequest.class)
        );
    }

    @Test
    @WithMockUser
    void testCreateContact_ValidationError_InvalidEmail() throws Exception {
        EmailRequest invalidEmail = new EmailRequest();
        invalidEmail.setEmail("invalid-email");
        invalidEmail.setType(EmailType.WORK);
        contactRequest.setEmails(Arrays.asList(invalidEmail));

        mockMvc
            .perform(
                post("/api/contacts")
                    .with(user(userDetails))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(contactRequest))
            )
            .andExpect(status().isBadRequest());

        verify(contactService, never()).createContact(
            anyLong(),
            any(ContactRequest.class)
        );
    }

    @Test
    @WithMockUser
    void testGetAllContacts_Success() throws Exception {
        List<ContactResponse> contacts = Arrays.asList(contactResponse);
        Page<ContactResponse> contactPage = new PageImpl<>(contacts);

        when(contactService.getAllContacts(anyLong(), any())).thenReturn(
            contactPage
        );

        mockMvc
            .perform(
                get("/api/contacts")
                    .with(user(userDetails))
                    .param("page", "0")
                    .param("size", "10")
                    .param("sortBy", "firstName")
                    .param("sortDir", "ASC")
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.content[0].firstName").value("Jane"))
            .andExpect(jsonPath("$.data.totalElements").value(1));

        verify(contactService).getAllContacts(anyLong(), any());
    }

    @Test
    @WithMockUser
    void testSearchContacts_Success() throws Exception {
        List<ContactResponse> contacts = Arrays.asList(contactResponse);
        Page<ContactResponse> contactPage = new PageImpl<>(contacts);

        when(
            contactService.searchContacts(anyLong(), anyString(), any())
        ).thenReturn(contactPage);

        mockMvc
            .perform(
                get("/api/contacts/search")
                    .with(user(userDetails))
                    .param("query", "jane")
                    .param("page", "0")
                    .param("size", "10")
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.content[0].firstName").value("Jane"))
            .andExpect(jsonPath("$.data.totalElements").value(1));

        verify(contactService).searchContacts(anyLong(), eq("jane"), any());
    }

    @Test
    @WithMockUser
    void testGetContactById_Success() throws Exception {
        when(contactService.getContactById(anyLong(), anyLong())).thenReturn(
            contactResponse
        );

        mockMvc
            .perform(get("/api/contacts/1").with(user(userDetails)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.id").value(1))
            .andExpect(jsonPath("$.data.firstName").value("Jane"));

        verify(contactService).getContactById(anyLong(), eq(1L));
    }

    @Test
    @WithMockUser
    void testUpdateContact_Success() throws Exception {
        when(
            contactService.updateContact(
                anyLong(),
                anyLong(),
                any(ContactRequest.class)
            )
        ).thenReturn(contactResponse);

        mockMvc
            .perform(
                put("/api/contacts/1")
                    .with(user(userDetails))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(contactRequest))
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(
                jsonPath("$.message").value("Contact updated successfully")
            )
            .andExpect(jsonPath("$.data.firstName").value("Jane"));

        verify(contactService).updateContact(
            anyLong(),
            eq(1L),
            any(ContactRequest.class)
        );
    }

    @Test
    @WithMockUser
    void testUpdateContact_ValidationError() throws Exception {
        contactRequest.setFirstName("");

        mockMvc
            .perform(
                put("/api/contacts/1")
                    .with(user(userDetails))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(contactRequest))
            )
            .andExpect(status().isBadRequest());

        verify(contactService, never()).updateContact(
            anyLong(),
            anyLong(),
            any(ContactRequest.class)
        );
    }

    @Test
    @WithMockUser
    void testDeleteContact_Success() throws Exception {
        doNothing().when(contactService).deleteContact(anyLong(), anyLong());

        mockMvc
            .perform(delete("/api/contacts/1").with(user(userDetails)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(
                jsonPath("$.message").value("Contact deleted successfully")
            );

        verify(contactService).deleteContact(anyLong(), eq(1L));
    }
}
