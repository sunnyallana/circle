#!/bin/bash

# Contact Management System API Testing Script for Bash
# Make this file executable: chmod +x test-apis.sh
# Run: bash test-apis.sh or ./test-apis.sh

BASE_URL="http://localhost:8080/api"
TOKEN=""
CONTACT_ID=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}\n"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}\n"
}

# Function to print info
print_info() {
    echo -e "${YELLOW}ℹ $1${NC}\n"
}

# Test 1: Register a new user
test_register() {
    print_header "TEST 1: Register New User"

    response=$(curl -s -X POST "${BASE_URL}/auth/register" \
        -H "Content-Type: application/json" \
        -d '{
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "phoneNumber": "+1234567890",
            "password": "password123"
        }')

    echo "Response:"
    echo "$response" | jq .

    # Extract token
    TOKEN=$(echo "$response" | jq -r '.data.token')

    if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
        print_success "User registered successfully!"
        print_info "Token: $TOKEN"
    else
        print_error "Registration failed!"
    fi
}

# Test 2: Login
test_login() {
    print_header "TEST 2: Login"

    response=$(curl -s -X POST "${BASE_URL}/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "username": "john.doe@example.com",
            "password": "password123"
        }')

    echo "Response:"
    echo "$response" | jq .

    # Extract token
    TOKEN=$(echo "$response" | jq -r '.data.token')

    if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
        print_success "Login successful!"
        print_info "Token saved: $TOKEN"
    else
        print_error "Login failed!"
    fi
}

# Test 3: Get current user
test_get_current_user() {
    print_header "TEST 3: Get Current User"

    if [ -z "$TOKEN" ]; then
        print_error "No token available. Please login first."
        return
    fi

    response=$(curl -s -X GET "${BASE_URL}/auth/me" \
        -H "Authorization: Bearer $TOKEN")

    echo "Response:"
    echo "$response" | jq .

    if echo "$response" | jq -e '.success' > /dev/null; then
        print_success "User profile retrieved successfully!"
    else
        print_error "Failed to get user profile!"
    fi
}

# Test 4: Create a contact
test_create_contact() {
    print_header "TEST 4: Create Contact"

    if [ -z "$TOKEN" ]; then
        print_error "No token available. Please login first."
        return
    fi

    response=$(curl -s -X POST "${BASE_URL}/contacts" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "firstName": "Jane",
            "lastName": "Smith",
            "title": "Software Engineer",
            "emails": [
                {
                    "email": "jane.smith@work.com",
                    "type": "WORK"
                },
                {
                    "email": "jane.smith@personal.com",
                    "type": "PERSONAL"
                }
            ],
            "phones": [
                {
                    "phoneNumber": "+1987654321",
                    "type": "WORK"
                },
                {
                    "phoneNumber": "+1122334455",
                    "type": "PERSONAL"
                }
            ]
        }')

    echo "Response:"
    echo "$response" | jq .

    CONTACT_ID=$(echo "$response" | jq -r '.data.id')

    if [ "$CONTACT_ID" != "null" ] && [ -n "$CONTACT_ID" ]; then
        print_success "Contact created successfully!"
        print_info "Contact ID: $CONTACT_ID"
        echo "$CONTACT_ID" > /tmp/contact_id.txt
    else
        print_error "Failed to create contact!"
    fi
}

# Test 5: Create another contact
test_create_another_contact() {
    print_header "TEST 5: Create Another Contact"

    if [ -z "$TOKEN" ]; then
        print_error "No token available. Please login first."
        return
    fi

    response=$(curl -s -X POST "${BASE_URL}/contacts" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "firstName": "Bob",
            "lastName": "Johnson",
            "title": "Product Manager",
            "emails": [
                {
                    "email": "bob.j@company.com",
                    "type": "WORK"
                }
            ],
            "phones": [
                {
                    "phoneNumber": "+1555666777",
                    "type": "WORK"
                }
            ]
        }')

    echo "Response:"
    echo "$response" | jq .

    if echo "$response" | jq -e '.data.id' > /dev/null; then
        print_success "Second contact created successfully!"
    else
        print_error "Failed to create second contact!"
    fi
}

# Test 6: Get all contacts (paginated)
test_get_all_contacts() {
    print_header "TEST 6: Get All Contacts (Paginated)"

    if [ -z "$TOKEN" ]; then
        print_error "No token available. Please login first."
        return
    fi

    response=$(curl -s -X GET "${BASE_URL}/contacts?page=0&size=10&sortBy=firstName&sortDir=ASC" \
        -H "Authorization: Bearer $TOKEN")

    echo "Response:"
    echo "$response" | jq .

    if echo "$response" | jq -e '.data.content' > /dev/null; then
        total=$(echo "$response" | jq '.data.totalElements')
        print_success "Retrieved contacts successfully! Total: $total"
    else
        print_error "Failed to get contacts!"
    fi
}

# Test 7: Search contacts
test_search_contacts() {
    print_header "TEST 7: Search Contacts"

    if [ -z "$TOKEN" ]; then
        print_error "No token available. Please login first."
        return
    fi

    response=$(curl -s -X GET "${BASE_URL}/contacts/search?query=jane&page=0&size=10" \
        -H "Authorization: Bearer $TOKEN")

    echo "Response:"
    echo "$response" | jq .

    if echo "$response" | jq -e '.data.content' > /dev/null; then
        found=$(echo "$response" | jq '.data.totalElements')
        print_success "Search completed! Found: $found contacts"
    else
        print_error "Search failed!"
    fi
}

# Test 8: Get contact by ID
test_get_contact_by_id() {
    print_header "TEST 8: Get Contact by ID"

    if [ -z "$TOKEN" ]; then
        print_error "No token available. Please login first."
        return
    fi

    if [ -f /tmp/contact_id.txt ]; then
        CONTACT_ID=$(cat /tmp/contact_id.txt)
    else
        print_error "No contact ID found. Create a contact first."
        return
    fi

    response=$(curl -s -X GET "${BASE_URL}/contacts/${CONTACT_ID}" \
        -H "Authorization: Bearer $TOKEN")

    echo "Response:"
    echo "$response" | jq .

    if echo "$response" | jq -e '.data.id' > /dev/null; then
        print_success "Contact retrieved successfully!"
    else
        print_error "Failed to get contact!"
    fi
}

# Test 9: Update contact
test_update_contact() {
    print_header "TEST 9: Update Contact"

    if [ -z "$TOKEN" ]; then
        print_error "No token available. Please login first."
        return
    fi

    if [ -f /tmp/contact_id.txt ]; then
        CONTACT_ID=$(cat /tmp/contact_id.txt)
    else
        print_error "No contact ID found. Create a contact first."
        return
    fi

    response=$(curl -s -X PUT "${BASE_URL}/contacts/${CONTACT_ID}" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "firstName": "Jane",
            "lastName": "Smith-Updated",
            "title": "Senior Software Engineer",
            "emails": [
                {
                    "email": "jane.updated@work.com",
                    "type": "WORK"
                }
            ],
            "phones": [
                {
                    "phoneNumber": "+1999888777",
                    "type": "WORK"
                }
            ]
        }')

    echo "Response:"
    echo "$response" | jq .

    if echo "$response" | jq -e '.data.id' > /dev/null; then
        print_success "Contact updated successfully!"
    else
        print_error "Failed to update contact!"
    fi
}

# Test 10: Change password
test_change_password() {
    print_header "TEST 10: Change Password"

    if [ -z "$TOKEN" ]; then
        print_error "No token available. Please login first."
        return
    fi

    response=$(curl -s -X PUT "${BASE_URL}/auth/change-password" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "currentPassword": "password123",
            "newPassword": "newpassword123"
        }')

    echo "Response:"
    echo "$response" | jq .

    if echo "$response" | jq -e '.success' > /dev/null; then
        print_success "Password changed successfully!"
    else
        print_error "Failed to change password!"
    fi
}

# Test 11: Login with new password
test_login_new_password() {
    print_header "TEST 11: Login with New Password"

    response=$(curl -s -X POST "${BASE_URL}/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "username": "john.doe@example.com",
            "password": "newpassword123"
        }')

    echo "Response:"
    echo "$response" | jq .

    NEW_TOKEN=$(echo "$response" | jq -r '.data.token')

    if [ "$NEW_TOKEN" != "null" ] && [ -n "$NEW_TOKEN" ]; then
        print_success "Login with new password successful!"
        TOKEN="$NEW_TOKEN"
    else
        print_error "Login with new password failed!"
    fi
}

# Test 12: Delete contact
test_delete_contact() {
    print_header "TEST 12: Delete Contact"

    if [ -z "$TOKEN" ]; then
        print_error "No token available. Please login first."
        return
    fi

    if [ -f /tmp/contact_id.txt ]; then
        CONTACT_ID=$(cat /tmp/contact_id.txt)
    else
        print_error "No contact ID found. Create a contact first."
        return
    fi

    response=$(curl -s -X DELETE "${BASE_URL}/contacts/${CONTACT_ID}" \
        -H "Authorization: Bearer $TOKEN")

    echo "Response:"
    echo "$response" | jq .

    if echo "$response" | jq -e '.success' > /dev/null; then
        print_success "Contact deleted successfully!"
        rm -f /tmp/contact_id.txt
    else
        print_error "Failed to delete contact!"
    fi
}

# Test 13: Error handling - Invalid login
test_invalid_login() {
    print_header "TEST 13: Error Handling - Invalid Login"

    response=$(curl -s -X POST "${BASE_URL}/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "username": "invalid@example.com",
            "password": "wrongpassword"
        }')

    echo "Response:"
    echo "$response" | jq .

    if echo "$response" | jq -e '.success == false' > /dev/null; then
        print_success "Error handling working correctly!"
    else
        print_error "Error handling test failed!"
    fi
}

# Test 14: Error handling - Unauthorized access
test_unauthorized_access() {
    print_header "TEST 14: Error Handling - Unauthorized Access"

    response=$(curl -s -X GET "${BASE_URL}/contacts" \
        -H "Authorization: Bearer invalid_token_here")

    echo "Response:"
    echo "$response" | jq .

    print_success "Unauthorized access test completed!"
}

# Main menu
show_menu() {
    echo -e "\n${YELLOW}╔════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║   Contact Management API Test Suite   ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════╝${NC}\n"
    echo "1.  Register new user"
    echo "2.  Login"
    echo "3.  Get current user"
    echo "4.  Create contact"
    echo "5.  Create another contact"
    echo "6.  Get all contacts (paginated)"
    echo "7.  Search contacts"
    echo "8.  Get contact by ID"
    echo "9.  Update contact"
    echo "10. Change password"
    echo "11. Login with new password"
    echo "12. Delete contact"
    echo "13. Test invalid login (error handling)"
    echo "14. Test unauthorized access (error handling)"
    echo "15. Run all tests sequentially"
    echo "0.  Exit"
    echo ""
}

# Run all tests
run_all_tests() {
    print_header "RUNNING ALL TESTS SEQUENTIALLY"

    test_register
    sleep 1

    test_login
    sleep 1

    test_get_current_user
    sleep 1

    test_create_contact
    sleep 1

    test_create_another_contact
    sleep 1

    test_get_all_contacts
    sleep 1

    test_search_contacts
    sleep 1

    test_get_contact_by_id
    sleep 1

    test_update_contact
    sleep 1

    test_change_password
    sleep 1

    test_login_new_password
    sleep 1

    test_delete_contact
    sleep 1

    test_invalid_login
    sleep 1

    test_unauthorized_access

    print_header "ALL TESTS COMPLETED!"
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    print_error "jq is not installed. Please install it first:"
    echo "  sudo pacman -S jq"
    exit 1
fi

# Check if server is running
if ! curl -s "${BASE_URL}/auth/login" > /dev/null 2>&1; then
    print_error "Server is not running at ${BASE_URL}"
    print_info "Please start the Spring Boot application first"
    exit 1
fi

# Main loop
while true; do
    show_menu
    read -p "Enter your choice: " choice

    case $choice in
        1) test_register ;;
        2) test_login ;;
        3) test_get_current_user ;;
        4) test_create_contact ;;
        5) test_create_another_contact ;;
        6) test_get_all_contacts ;;
        7) test_search_contacts ;;
        8) test_get_contact_by_id ;;
        9) test_update_contact ;;
        10) test_change_password ;;
        11) test_login_new_password ;;
        12) test_delete_contact ;;
        13) test_invalid_login ;;
        14) test_unauthorized_access ;;
        15) run_all_tests ;;
        0)
            print_info "Exiting..."
            rm -f /tmp/contact_id.txt
            exit 0
            ;;
        *) print_error "Invalid choice. Please try again." ;;
    esac

    read -p "Press Enter to continue..."
done



_________________________________________________________________________+++++++++++++++++++++++++++
# This workflow will build a Java project with Maven, and cache/restore any dependencies to improve the workflow execution time
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-java-with-maven
name: Java CI with Maven
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
jobs:
  build:
    runs-on: ubuntu-latest

    # PostgreSQL service for integration tests
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: contact_management
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        # Set health checks to wait until postgres has started
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0  # Shallow clones should be disabled for better SonarQube analysis

    - name: Set up JDK 25
      uses: actions/setup-java@v4
      with:
        java-version: '25'
        distribution: 'temurin'
        cache: maven

    - name: Verify Java and Maven versions
      run: |
        java -version
        mvn -version

    - name: Cache Maven packages
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
        restore-keys: ${{ runner.os }}-m2

    - name: Cache SonarQube packages
      uses: actions/cache@v3
      with:
        path: ~/.sonar/cache
        key: ${{ runner.os }}-sonar
        restore-keys: ${{ runner.os }}-sonar

    - name: Run tests with coverage
      run: mvn -B clean verify --file pom.xml
      env:
        SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/contact_management
        SPRING_DATASOURCE_USERNAME: postgres
        SPRING_DATASOURCE_PASSWORD: postgres

    - name: SonarQube Scan
      run: |
        mvn -B sonar:sonar \
          -Dsonar.projectKey=${{ secrets.SONAR_PROJECT_KEY }} \
          -Dsonar.host.url=${{ secrets.SONAR_HOST_URL }} \
          -Dsonar.login=${{ secrets.SONAR_TOKEN }}
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

    - name: Build with Maven
      run: mvn -B package -Dmaven.test.skip=true --file pom.xml

    # Optional: Upload test results
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: test-results
        path: target/surefire-reports/
        retention-days: 7

    # Optional: Upload coverage reports
    - name: Upload coverage reports
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: coverage-reports
        path: target/site/jacoco/
        retention-days: 7

    # Optional: Upload build artifact (JAR file)
    - name: Upload JAR artifact
      if: success()
      uses: actions/upload-artifact@v4
      with:
        name: circle-jar
        path: target/circle-0.0.1-SNAPSHOT.jar
        retention-days: 7
