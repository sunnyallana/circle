package com.susa.circle.repository;

import static org.junit.jupiter.api.Assertions.*;

import com.susa.circle.entity.User;
import java.util.ArrayList;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Clear any existing data first
        entityManager.clear();

        testUser = User.builder()
            .firstName("John")
            .lastName("Doe")
            .email("john@example.com")
            .phoneNumber("+1234567890")
            .password("password")
            .active(true)
            .contacts(new ArrayList<>())
            .build();
        testUser = entityManager.persist(testUser);
        entityManager.flush();
    }

    @Test
    void testFindByEmail_Found() {
        Optional<User> found = userRepository.findByEmail("john@example.com");

        assertTrue(found.isPresent());
        assertEquals("John", found.get().getFirstName());
        assertEquals("john@example.com", found.get().getEmail());
    }

    @Test
    void testFindByEmail_NotFound() {
        Optional<User> found = userRepository.findByEmail(
            "nonexistent@example.com"
        );

        assertFalse(found.isPresent());
    }

    @Test
    void testFindByPhoneNumber_Found() {
        Optional<User> found = userRepository.findByPhoneNumber("+1234567890");

        assertTrue(found.isPresent());
        assertEquals("John", found.get().getFirstName());
        assertEquals("+1234567890", found.get().getPhoneNumber());
    }

    @Test
    void testFindByPhoneNumber_NotFound() {
        Optional<User> found = userRepository.findByPhoneNumber("+9999999999");

        assertFalse(found.isPresent());
    }

    @Test
    void testExistsByEmail_True() {
        boolean exists = userRepository.existsByEmail("john@example.com");

        assertTrue(exists);
    }

    @Test
    void testExistsByEmail_False() {
        boolean exists = userRepository.existsByEmail(
            "nonexistent@example.com"
        );

        assertFalse(exists);
    }

    @Test
    void testExistsByPhoneNumber_True() {
        boolean exists = userRepository.existsByPhoneNumber("+1234567890");

        assertTrue(exists);
    }

    @Test
    void testExistsByPhoneNumber_False() {
        boolean exists = userRepository.existsByPhoneNumber("+9999999999");

        assertFalse(exists);
    }

    @Test
    void testSaveUser_WithEmail() {
        User newUser = User.builder()
            .firstName("Jane")
            .lastName("Smith")
            .email("jane@example.com")
            .password("password")
            .active(true)
            .contacts(new ArrayList<>())
            .build();

        User saved = userRepository.save(newUser);

        assertNotNull(saved.getId());
        assertEquals("Jane", saved.getFirstName());
        assertEquals("jane@example.com", saved.getEmail());
        assertNotNull(saved.getCreatedAt());
    }

    @Test
    void testSaveUser_WithPhoneNumber() {
        User newUser = User.builder()
            .firstName("Bob")
            .lastName("Johnson")
            .phoneNumber("+9876543210")
            .password("password")
            .active(true)
            .contacts(new ArrayList<>())
            .build();

        User saved = userRepository.save(newUser);

        assertNotNull(saved.getId());
        assertEquals("Bob", saved.getFirstName());
        assertEquals("+9876543210", saved.getPhoneNumber());
    }
}
