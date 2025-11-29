# Test Scenarios for Saucedemo.com E-Commerce Automation

## Overview
This document outlines the key test scenarios identified for the Saucedemo.com e-commerce platform, prioritized by business criticality and user impact.

---

## Test Scenarios

### **Priority 1: Critical User Journeys**

#### Scenario 1: Successful Login with Valid Credentials
- **Priority**: CRITICAL
- **Rationale**: Authentication is the foundation of user access. Any failure here blocks all subsequent functionality.
- **Type**: Positive Test Case
- **Preconditions**: User has valid credentials
- **Test Steps**:
  1. Navigate to saucedemo.com
  2. Enter valid username (standard_user)
  3. Enter valid password (secret_sauce)
  4. Click Login button
- **Expected Results**:
  - User is redirected to the Products page
  - Products are displayed with prices
  - Cart icon is visible in the header
- **Assertions**:
  - URL contains "/inventory"
  - Product list is populated
  - "Your Cart" link exists

---

#### Scenario 2: Complete Purchase Flow - Add to Cart and Checkout
- **Priority**: CRITICAL
- **Rationale**: This is the core business process. Any failure directly impacts revenue.
- **Type**: Positive Test Case (End-to-End)
- **Preconditions**: User is logged in
- **Test Steps**:
  1. Navigate to Products page
  2. Add one or more products to cart
  3. Navigate to cart
  4. Verify cart contents
  5. Click Checkout
  6. Fill in checkout form (First Name, Last Name, Postal Code)
  7. Click Continue
  8. Review order summary
  9. Click Finish
- **Expected Results**:
  - Products are added to cart successfully
  - Cart reflects correct quantity
  - Checkout form accepts valid data
  - Order confirmation page appears
  - Success message is displayed
- **Assertions**:
  - Cart count updates
  - Checkout page title matches expected
  - Confirmation page URL is correct
  - Success message contains "Thank you"

---

#### Scenario 3: Browse and Filter Products
- **Priority**: HIGH
- **Rationale**: Product discovery and filtering are essential user features for a marketplace.
- **Type**: Positive Test Case
- **Preconditions**: User is logged in and on Products page
- **Test Steps**:
  1. View all available products
  2. Apply sorting (e.g., A-Z, Z-A, Price Low-High)
  3. Verify product order changes
  4. Select different sorting options
- **Expected Results**:
  - All products are displayed
  - Products are sorted according to selection
  - Price and name display correctly
  - Sorting options work consistently
- **Assertions**:
  - Product count matches expected
  - Product order matches sorting criteria
  - No duplicate products
  - All products are clickable

---

### **Priority 2: Error Handling & Negative Cases**

#### Scenario 4: Login with Invalid Credentials
- **Priority**: HIGH
- **Rationale**: The system must handle invalid authentication attempts securely and provide clear feedback.
- **Type**: Negative Test Case
- **Preconditions**: None
- **Test Steps**:
  1. Navigate to saucedemo.com
  2. Enter invalid username
  3. Enter invalid password
  4. Click Login button
- **Expected Results**:
  - Login fails
  - Error message is displayed
  - User remains on login page
  - No sensitive data is exposed
- **Assertions**:
  - Error message exists and is visible
  - URL still points to login page
  - No redirect to protected page
  - Error message is specific (e.g., "Username and password do not match")

---

#### Scenario 5: Login with Locked User Account
- **Priority**: HIGH
- **Rationale**: Locked accounts must be handled gracefully with appropriate user feedback.
- **Type**: Negative Test Case
- **Preconditions**: Locked user account exists (locked_out_user)
- **Test Steps**:
  1. Navigate to saucedemo.com
  2. Enter locked user credentials (locked_out_user / secret_sauce)
  3. Click Login button
- **Expected Results**:
  - Login fails
  - Appropriate error message for locked account is shown
  - User cannot access the system
- **Assertions**:
  - Error message mentions account being locked
  - URL remains on login page
  - No partial access to system

---

#### Scenario 6: Checkout with Missing Required Fields
- **Priority**: MEDIUM
- **Rationale**: Form validation is critical to prevent incomplete or invalid orders.
- **Type**: Negative Test Case
- **Preconditions**: User has items in cart and is on checkout page
- **Test Steps**:
  1. Navigate to checkout
  2. Leave required fields (First Name, Last Name, Postal Code) empty
  3. Click Continue
- **Expected Results**:
  - Form validation fails
  - Error message(s) displayed for missing fields
  - User remains on checkout page
  - Order is not submitted
- **Assertions**:
  - Error message indicates required fields
  - Form data is preserved
  - Continue button doesn't proceed

---

### **Priority 3: Additional Edge Cases**

#### Scenario 7: Attempt Checkout with Empty Cart
- **Priority**: MEDIUM
- **Rationale**: Users should not be able to proceed without items; this prevents invalid orders.
- **Type**: Negative Test Case
- **Preconditions**: User is logged in with empty cart
- **Test Steps**:
  1. Navigate to cart
  2. Verify cart is empty
  3. Attempt to click Checkout (if available)
- **Expected Results**:
  - Checkout button is disabled or not available
  - Clear message indicates empty cart
  - User cannot proceed to checkout
- **Assertions**:
  - Checkout button is not clickable or not visible
  - Empty cart message is displayed

---

#### Scenario 8: Session Persistence & Logout
- **Priority**: MEDIUM
- **Rationale**: Session management is important for security and user experience.
- **Type**: Positive Test Case
- **Preconditions**: User is logged in
- **Test Steps**:
  1. User is logged in and on Products page
  2. Add item to cart
  3. Verify cart persists
  4. Click Logout
  5. Verify user is redirected to login
- **Expected Results**:
  - Logout is successful
  - User is redirected to login page
  - Session is cleared
  - Cart is not accessible after logout
- **Assertions**:
  - URL is login page
  - Cart icon is not visible
  - No authenticated content accessible

---

## Test Coverage Summary

| Scenario | Type | Priority | Status |
|----------|------|----------|--------|
| Valid Login | Positive | CRITICAL | ✓ |
| Complete Purchase | Positive | CRITICAL | ✓ |
| Browse/Filter | Positive | HIGH | ✓ |
| Invalid Login | Negative | HIGH | ✓ |
| Locked Account | Negative | HIGH | ✓ |
| Missing Fields | Negative | MEDIUM | ✓ |
| Empty Cart | Negative | MEDIUM | ✓ |
| Logout | Positive | MEDIUM | ✓ |

**Total Scenarios**: 8 (5 Positive, 3 Negative)
**Coverage**: User authentication, product browsing, shopping cart, checkout, error handling, and session management.

---

## Notes
- All tests use the official test accounts provided by Saucedemo (standard_user, locked_out_user, etc.)
- Tests are designed to be independent and can run in any order
- Session reusage is implemented via authentication setup to optimize test execution time
- Data-driven testing approach allows testing multiple product and user scenarios
