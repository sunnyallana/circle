package com.susa.circle.repository;

import static org.junit.jupiter.api.Assertions.*;

import com.susa.circle.entity.Contact;
import com.susa.circle.entity.User;
import java.util.ArrayList;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ContactRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ContactRepository contactRepository;

    private User testUser;
    private Contact testContact1;
    private Contact testContact2;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .firstName("John")
            .lastName("Doe")
            .email("john@example.com")
            .password("password")
            .active(true)
            .contacts(new ArrayList<>())
            .build();
        testUser = entityManager.persist(testUser);

        testContact1 = Contact.builder()
            .firstName("Jane")
            .lastName("Smith")
            .title("Engineer")
            .user(testUser)
            .emails(new ArrayList<>())
            .phones(new ArrayList<>())
            .build();
        testContact1 = entityManager.persist(testContact1);

        testContact2 = Contact.builder()
            .firstName("Bob")
            .lastName("Johnson")
            .title("Manager")
            .user(testUser)
            .emails(new ArrayList<>())
            .phones(new ArrayList<>())
            .build();
        testContact2 = entityManager.persist(testContact2);

        entityManager.flush();
    }

    @Test
    void testFindByUserId() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> contacts = contactRepository.findByUserId(
            testUser.getId(),
            pageable
        );

        assertNotNull(contacts);
        assertEquals(2, contacts.getTotalElements());
        assertTrue(
            contacts
                .getContent()
                .stream()
                .allMatch(c -> c.getUser().getId().equals(testUser.getId()))
        );
    }

    @Test
    void testSearchContactsByUserId_ByFirstName() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> contacts = contactRepository.searchContactsByUserId(
            testUser.getId(),
            "jane",
            pageable
        );

        assertNotNull(contacts);
        assertEquals(1, contacts.getTotalElements());
        assertEquals("Jane", contacts.getContent().get(0).getFirstName());
    }

    @Test
    void testSearchContactsByUserId_ByLastName() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> contacts = contactRepository.searchContactsByUserId(
            testUser.getId(),
            "johnson",
            pageable
        );

        assertNotNull(contacts);
        assertEquals(1, contacts.getTotalElements());
        assertEquals("Johnson", contacts.getContent().get(0).getLastName());
    }

    @Test
    void testSearchContactsByUserId_CaseInsensitive() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> contacts = contactRepository.searchContactsByUserId(
            testUser.getId(),
            "JANE",
            pageable
        );

        assertNotNull(contacts);
        assertEquals(1, contacts.getTotalElements());
        assertEquals("Jane", contacts.getContent().get(0).getFirstName());
    }

    @Test
    void testSearchContactsByUserId_NoResults() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contact> contacts = contactRepository.searchContactsByUserId(
            testUser.getId(),
            "nonexistent",
            pageable
        );

        assertNotNull(contacts);
        assertEquals(0, contacts.getTotalElements());
    }

    @Test
    void testExistsByIdAndUserId_True() {
        boolean exists = contactRepository.existsByIdAndUserId(
            testContact1.getId(),
            testUser.getId()
        );

        assertTrue(exists);
    }

    @Test
    void testExistsByIdAndUserId_False() {
        boolean exists = contactRepository.existsByIdAndUserId(
            999L,
            testUser.getId()
        );

        assertFalse(exists);
    }

    @Test
    void testExistsByIdAndUserId_WrongUser() {
        User anotherUser = User.builder()
            .firstName("Another")
            .lastName("User")
            .email("another@example.com")
            .password("password")
            .active(true)
            .contacts(new ArrayList<>())
            .build();
        anotherUser = entityManager.persist(anotherUser);
        entityManager.flush();

        boolean exists = contactRepository.existsByIdAndUserId(
            testContact1.getId(),
            anotherUser.getId()
        );

        assertFalse(exists);
    }
}
