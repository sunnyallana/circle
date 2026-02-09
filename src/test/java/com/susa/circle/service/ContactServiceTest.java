package com.susa.circle.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.susa.circle.dto.request.ContactRequest;
import com.susa.circle.dto.request.EmailRequest;
import com.susa.circle.dto.request.PhoneRequest;
import com.susa.circle.dto.response.ContactResponse;
import com.susa.circle.entity.Contact;
import com.susa.circle.entity.ContactEmail;
import com.susa.circle.entity.ContactPhone;
import com.susa.circle.entity.User;
import com.susa.circle.enums.EmailType;
import com.susa.circle.enums.PhoneType;
import com.susa.circle.exception.BadRequestException;
import com.susa.circle.exception.ResourceNotFoundException;
import com.susa.circle.repository.ContactRepository;
import com.susa.circle.repository.UserRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ContactService contactService;

    private User testUser;
    private Contact testContact;
    private ContactRequest contactRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(1L)
            .firstName("John")
            .lastName("Doe")
            .email("john@example.com")
            .password("password")
            .active(true)
            .build();

        testContact = Contact.builder()
            .id(1L)
            .firstName("Jane")
            .lastName("Smith")
            .title("Software Engineer")
            .user(testUser)
            .emails(new ArrayList<>())
            .phones(new ArrayList<>())
            .build();

        ContactEmail email = ContactEmail.builder()
            .id(1L)
            .email("jane@work.com")
            .type(EmailType.WORK)
            .contact(testContact)
            .build();
        testContact.getEmails().add(email);

        ContactPhone phone = ContactPhone.builder()
            .id(1L)
            .phoneNumber("+1234567890")
            .type(PhoneType.WORK)
            .contact(testContact)
            .build();
        testContact.getPhones().add(phone);

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
    }

    @Test
    void testCreateContact_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(contactRepository.save(any(Contact.class))).thenReturn(
            testContact
        );

        ContactResponse response = contactService.createContact(
            1L,
            contactRequest
        );

        assertNotNull(response);
        assertEquals("Jane", response.getFirstName());
        assertEquals("Smith", response.getLastName());
        assertEquals("Software Engineer", response.getTitle());
        assertEquals(1, response.getEmails().size());
        assertEquals(1, response.getPhones().size());

        verify(userRepository).findById(1L);
        verify(contactRepository).save(any(Contact.class));
    }

    @Test
    void testCreateContact_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> contactService.createContact(1L, contactRequest)
        );

        assertTrue(exception.getMessage().contains("User"));
        verify(userRepository).findById(1L);
        verify(contactRepository, never()).save(any(Contact.class));
    }

    @Test
    void testGetAllContacts_Success() {
        List<Contact> contacts = Arrays.asList(testContact);
        Page<Contact> contactPage = new PageImpl<>(contacts);
        Pageable pageable = PageRequest.of(0, 10);

        when(contactRepository.findByUserId(1L, pageable)).thenReturn(
            contactPage
        );

        Page<ContactResponse> response = contactService.getAllContacts(
            1L,
            pageable
        );

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals("Jane", response.getContent().get(0).getFirstName());

        verify(contactRepository).findByUserId(1L, pageable);
    }

    @Test
    void testSearchContacts_Success() {
        List<Contact> contacts = Arrays.asList(testContact);
        Page<Contact> contactPage = new PageImpl<>(contacts);
        Pageable pageable = PageRequest.of(0, 10);

        when(
            contactRepository.searchContactsByUserId(1L, "jane", pageable)
        ).thenReturn(contactPage);

        Page<ContactResponse> response = contactService.searchContacts(
            1L,
            "jane",
            pageable
        );

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals("Jane", response.getContent().get(0).getFirstName());

        verify(contactRepository).searchContactsByUserId(1L, "jane", pageable);
    }

    @Test
    void testGetContactById_Success() {
        when(contactRepository.findById(1L)).thenReturn(
            Optional.of(testContact)
        );

        ContactResponse response = contactService.getContactById(1L, 1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Jane", response.getFirstName());

        verify(contactRepository).findById(1L);
    }

    @Test
    void testGetContactById_ContactNotFound() {
        when(contactRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> contactService.getContactById(1L, 1L)
        );

        assertTrue(exception.getMessage().contains("Contact"));
        verify(contactRepository).findById(1L);
    }

    @Test
    void testGetContactById_UnauthorizedAccess() {
        Contact otherUserContact = Contact.builder()
            .id(1L)
            .firstName("Jane")
            .lastName("Smith")
            .user(User.builder().id(2L).build())
            .emails(new ArrayList<>())
            .phones(new ArrayList<>())
            .build();

        when(contactRepository.findById(1L)).thenReturn(
            Optional.of(otherUserContact)
        );

        BadRequestException exception = assertThrows(
            BadRequestException.class,
            () -> contactService.getContactById(1L, 1L)
        );

        assertEquals(
            "You don't have permission to access this contact",
            exception.getMessage()
        );
        verify(contactRepository).findById(1L);
    }

    @Test
    void testUpdateContact_Success() {
        when(contactRepository.findById(1L)).thenReturn(
            Optional.of(testContact)
        );
        when(contactRepository.save(any(Contact.class))).thenReturn(
            testContact
        );

        ContactRequest updateRequest = new ContactRequest();
        updateRequest.setFirstName("Jane");
        updateRequest.setLastName("Smith-Updated");
        updateRequest.setTitle("Senior Software Engineer");
        updateRequest.setEmails(contactRequest.getEmails());
        updateRequest.setPhones(contactRequest.getPhones());

        ContactResponse response = contactService.updateContact(
            1L,
            1L,
            updateRequest
        );

        assertNotNull(response);
        verify(contactRepository).findById(1L);
        verify(contactRepository).save(any(Contact.class));
    }

    @Test
    void testUpdateContact_ContactNotFound() {
        when(contactRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> contactService.updateContact(1L, 1L, contactRequest)
        );

        assertTrue(exception.getMessage().contains("Contact"));
        verify(contactRepository).findById(1L);
        verify(contactRepository, never()).save(any(Contact.class));
    }

    @Test
    void testUpdateContact_UnauthorizedAccess() {
        Contact otherUserContact = Contact.builder()
            .id(1L)
            .firstName("Jane")
            .lastName("Smith")
            .user(User.builder().id(2L).build())
            .emails(new ArrayList<>())
            .phones(new ArrayList<>())
            .build();

        when(contactRepository.findById(1L)).thenReturn(
            Optional.of(otherUserContact)
        );

        BadRequestException exception = assertThrows(
            BadRequestException.class,
            () -> contactService.updateContact(1L, 1L, contactRequest)
        );

        assertEquals(
            "You don't have permission to update this contact",
            exception.getMessage()
        );
        verify(contactRepository).findById(1L);
        verify(contactRepository, never()).save(any(Contact.class));
    }

    @Test
    void testDeleteContact_Success() {
        when(contactRepository.findById(1L)).thenReturn(
            Optional.of(testContact)
        );
        doNothing().when(contactRepository).delete(any(Contact.class));

        assertDoesNotThrow(() -> contactService.deleteContact(1L, 1L));

        verify(contactRepository).findById(1L);
        verify(contactRepository).delete(testContact);
    }

    @Test
    void testDeleteContact_ContactNotFound() {
        when(contactRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> contactService.deleteContact(1L, 1L)
        );

        assertTrue(exception.getMessage().contains("Contact"));
        verify(contactRepository).findById(1L);
        verify(contactRepository, never()).delete(any(Contact.class));
    }

    @Test
    void testDeleteContact_UnauthorizedAccess() {
        Contact otherUserContact = Contact.builder()
            .id(1L)
            .firstName("Jane")
            .lastName("Smith")
            .user(User.builder().id(2L).build())
            .emails(new ArrayList<>())
            .phones(new ArrayList<>())
            .build();

        when(contactRepository.findById(1L)).thenReturn(
            Optional.of(otherUserContact)
        );

        BadRequestException exception = assertThrows(
            BadRequestException.class,
            () -> contactService.deleteContact(1L, 1L)
        );

        assertEquals(
            "You don't have permission to delete this contact",
            exception.getMessage()
        );
        verify(contactRepository).findById(1L);
        verify(contactRepository, never()).delete(any(Contact.class));
    }
}
