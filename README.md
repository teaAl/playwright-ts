# Single-shift CRUD operations

End-to-end test automation for single shift

## 🚀 Features

- (partial)End-to-end testing of shift management functionality
- Page Object Model (POM) implementation
- GitHub Actions integration (incomplete)
- Authentication handling
- API response validation
- Test data management

## 📋 Prerequisites

- Node.js (LTS version)
- npm

## 🛠️ Setup

1. Clone the repository

```bash
git clone https://github.com/teaAl/playwright-ts.git
```

2. Install dependencies

```bash
npm install
```

3. Install Playwright browsers

```bash
npx playwright install
```

## 🧪 Running Tests

Run all tests:

```bash
npm run tests
```

## 📁 Project Structure

```
playwright-ts/
├── tests/
│   ├── POM/              # Page Object Models
│   ├── COM/              # Component Object Models
│   ├── auth/             # Authentication setup
│   └── shifts/           # Shift Tests
├── playwright.config.ts  # Playwright configuration
└── package.json
```

## 🎯 Test Suites

### Single Shift Test Suite (Automated)

### 1. Create Shift

```typescript
test("Create a single shift successfully");
```

**Pre-conditions:**

- User is authenticated
- User is on dashboard page

**Steps:**

1. Click shift management button
2. Verify "Schichten" page title
3. Open aside action form
4. Fill in shift details:
   - Vorlage
   - Mitarbeiter
   - Datum
   - Endzeit
5. Click save button
6. Navigate to created shift date

**Assertions:**

- ✓ GraphQL response contains shift ID
- ✓ Shift card is visible in calendar
- ✓ Shift details popup opens on click

### 2. Verify Shift Details

```typescript
test("Verify shift details");
```

**Pre-conditions:**

- Shift is created
- User is on shift calendar view

**Steps:**

1. Click shift popup open button
2. Wait for aside form
3. Verify form data matches created shift:
   - Vorlage
   - Mitarbeiter
   - Datum
   - Endzeit

**Assertions:**

- ✓ Aside form is visible
- ✓ All form fields match created data

### 3. Update Shift Details

```typescript
test("Update shift details");
```

**Pre-conditions:**

- Shift details form is open
- Shift is editable

**Steps:**

1. Click endzeit input
2. Select a new valid value (17:00)
3. Click save button
4. Reload page
5. Reopen shift details

**Assertions:**

- ✓ GraphQL update response is successful
- ✓ Updated shift ID matches original
- ✓ Form shows updated end time
- ✓ Shift card reflects changes

### 4. Delete Shift

```typescript
test("Delete shift");
```

**Pre-conditions:**

- Shift exists
- Delete button is accessible

**Steps:**

1. Click delete button
2. Wait for GraphQL delete operation
3. Verify shift removal

**Assertions:**

- ✓ GraphQL delete response is successful
- ✓ Deleted shift ID matches target
- ✓ Shift card is removed from view

##

### Recurring Shift Test Suite (not-automated)

1. **With set period**
2. **With infinite period**

## 📊 Test Reports

Generate HTML report:

```bash
npx playwright show-report
```

## 🔄 CI/CD

- missing self-hosted runner and/or vpn config
