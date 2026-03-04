# Product Requirements Document (PRD)

# Mis Gastos - Personal Expense Tracker

**Version:** 1.0  
**Date:** February 24, 2026  
**Status:** Active Development

---

## 1. Executive Summary

**Mis Gastos** is a lightweight, browser-based personal finance management application that enables users to track their expenses and income across multiple accounts. The application provides a simple, intuitive interface for managing financial categories, bank accounts/credit cards, and transactions without requiring backend infrastructure or user authentication.

### Key Value Proposition

- **Zero setup required**: Runs entirely in the browser with local storage
- **Privacy-first**: All data stays on the user's device
- **Simple and fast**: Single-page application with instant updates
- **Spanish language support**: Designed for Spanish-speaking users
- **Multi-account management**: Track multiple bank accounts and credit cards simultaneously

---

## 2. Product Overview

### 2.1 Product Vision

To provide individuals with a simple, accessible tool for personal expense tracking that respects privacy, requires no installation or registration, and works offline.

### 2.2 Target Users

- **Primary**: Spanish-speaking individuals seeking basic expense tracking
- **Secondary**: Users who prefer privacy-focused, offline-capable financial tools
- **Demographics**: Personal finance beginners to intermediate users
- **Technical Level**: Basic web browser knowledge required

### 2.3 Use Cases

1. **Daily Expense Tracking**: Record purchases and payments immediately
2. **Income Management**: Track salary, freelance payments, and other income
3. **Account Balance Monitoring**: View real-time balances across multiple accounts
4. **Expense Categorization**: Organize transactions by custom categories
5. **Personal Budget Review**: Review transaction history by date

---

## 3. Technical Architecture

### 3.1 Technology Stack

- **Frontend Framework**: Vanilla JavaScript (ES6+)
- **Build Tool**: Vite 7.3.1
- **Storage**: Browser localStorage API
- **Styling**: Custom CSS
- **Language**: Spanish (UI/UX)
- **Currency**: Mexican Peso (MXN)

### 3.2 System Architecture

```
┌─────────────────────────────────────┐
│         Browser (Client)            │
│  ┌───────────────────────────────┐  │
│  │     Single Page Application   │  │
│  │  ┌─────────┬─────────┬──────┐ │  │
│  │  │Categories│Accounts │Trans.│ │  │
│  │  │  Module  │ Module  │Module│ │  │
│  │  └────┬────┴────┬────┴───┬──┘ │  │
│  │       └─────────┼────────┘    │  │
│  │            ┌────▼────┐        │  │
│  │            │ Storage │        │  │
│  │            │  Layer  │        │  │
│  │            └────┬────┘        │  │
│  └─────────────────┼─────────────┘  │
│               ┌────▼────┐           │
│               │localStorage         │
│               └─────────┘           │
└─────────────────────────────────────┘
```

### 3.3 Data Models

#### Category

```javascript
{
  id: String (UUID),
  name: String
}
```

#### Account

```javascript
{
  id: String (UUID),
  name: String,
  type: String ('cuenta' | 'tarjeta'),
  balance: Number (decimal)
}
```

#### Transaction

```javascript
{
  id: String (UUID),
  accountId: String (UUID reference),
  categoryId: String | null (UUID reference),
  type: String ('gasto' | 'ingreso'),
  amount: Number (decimal),
  description: String,
  date: String (ISO date YYYY-MM-DD)
}
```

---

## 4. Feature Requirements

### 4.1 Category Management

#### 4.1.1 Add Category

- **Priority**: P0 (Critical)
- **Description**: Users can create custom expense categories
- **Acceptance Criteria**:
  - User enters category name in text input
  - Clicking "Agregar" creates new category
  - Category name is required and non-empty
  - New category appears immediately in the list
  - Input field clears after successful addition
  - Category receives unique UUID identifier

#### 4.1.2 View Categories

- **Priority**: P0 (Critical)
- **Description**: Display list of all created categories
- **Acceptance Criteria**:
  - All categories displayed in a list
  - Empty state message shown when no categories exist
  - Categories persist across browser sessions

#### 4.1.3 Delete Category

- **Priority**: P0 (Critical)
- **Description**: Remove categories from the system
- **Acceptance Criteria**:
  - Each category has a "Eliminar" button
  - Clicking button removes category immediately
  - No confirmation dialog (immediate deletion)
  - Transactions with deleted categories retain categoryId reference

---

### 4.2 Account Management

#### 4.2.1 Add Account

- **Priority**: P0 (Critical)
- **Description**: Create bank accounts or credit cards
- **Acceptance Criteria**:
  - Form includes: name, type, initial balance
  - Type selector offers: "Cuenta" (bank account) or "Tarjeta de crédito" (credit card)
  - Balance accepts decimal numbers (step 0.01)
  - All fields are required
  - Account appears immediately after creation
  - Form resets after successful addition

#### 4.2.2 View Accounts

- **Priority**: P0 (Critical)
- **Description**: Display all accounts with current balances
- **Acceptance Criteria**:
  - Accounts shown in a list with name, type, and balance
  - Balance formatted as currency (MXN format: $1,234.56)
  - Type displayed as visual tag/label
  - Empty state message when no accounts exist
  - Balance updates in real-time when transactions added/removed

#### 4.2.3 Delete Account

- **Priority**: P0 (Critical)
- **Description**: Remove accounts from the system
- **Acceptance Criteria**:
  - Each account has "Eliminar" button
  - Deletion happens immediately without confirmation
  - Transactions retain accountId reference after deletion
  - Deleted account shows as "Cuenta eliminada" in transaction list

---

### 4.3 Transaction Management

#### 4.3.1 Add Transaction

- **Priority**: P0 (Critical)
- **Description**: Record income or expenses
- **Acceptance Criteria**:
  - Form fields:
    - Account (required, dropdown from existing accounts)
    - Category (optional, dropdown from existing categories)
    - Type (required, "Gasto" or "Ingreso")
    - Amount (required, decimal ≥ 0.01)
    - Description (optional, free text)
    - Date (required, date picker, defaults to today)
  - Creating transaction updates account balance:
    - Expenses (gasto) subtract from balance
    - Income (ingreso) adds to balance
  - Transaction appears immediately in list
  - Form resets after successful addition

#### 4.3.2 View Transactions

- **Priority**: P0 (Critical)
- **Description**: Display transaction history
- **Acceptance Criteria**:
  - Transactions sorted by date (newest first)
  - Each transaction shows:
    - Description (or "Sin descripción" if empty)
    - Account name · Category name (if assigned) · Date
    - Amount with +/- prefix and currency formatting
    - Visual distinction for income vs expense (CSS class)
  - Empty state message when no transactions exist
  - Deleted account appears as "Cuenta eliminada"
  - Deleted category is hidden (not displayed)

#### 4.3.3 Delete Transaction

- **Priority**: P0 (Critical)
- **Description**: Remove transaction and reverse balance impact
- **Acceptance Criteria**:
  - Each transaction has "Eliminar" button
  - Deletion reverses the balance change:
    - Deleted expense adds amount back to account
    - Deleted income subtracts amount from account
  - Transaction removed immediately without confirmation
  - Account balance updates immediately

#### 4.3.4 Account Dependency

- **Priority**: P0 (Critical)
- **Description**: Prevent transaction creation without accounts
- **Acceptance Criteria**:
  - If no accounts exist, show message: "Primero agrega una cuenta en la pestaña Cuentas"
  - Transaction form hidden when no accounts exist
  - User redirected/prompted to create account first

---

### 4.4 Navigation & UI

#### 4.4.1 Tab Navigation

- **Priority**: P0 (Critical)
- **Description**: Navigate between three main sections
- **Acceptance Criteria**:
  - Three tabs: "Categorías", "Cuentas", "Transacciones"
  - Clicking tab switches active panel
  - Active tab has visual indicator (CSS class 'active')
  - Only one panel visible at a time
  - Default view: Categories tab on page load

#### 4.4.2 Responsive Design

- **Priority**: P1 (High)
- **Description**: Application works on various screen sizes
- **Acceptance Criteria**:
  - Layout adapts to mobile, tablet, and desktop
  - Forms remain usable on small screens
  - List items readable and actionable on mobile

#### 4.4.3 Visual Design

- **Priority**: P1 (High)
- **Description**: Clean, modern interface with good UX
- **Acceptance Criteria**:
  - Card-based layout for sections
  - Clear visual hierarchy
  - Consistent spacing and typography
  - Accessible color contrast
  - Button styles indicate actions clearly

---

### 4.5 Data Persistence

#### 4.5.1 localStorage Integration

- **Priority**: P0 (Critical)
- **Description**: All data saved to browser localStorage
- **Acceptance Criteria**:
  - Data persists across browser sessions
  - Data survives page refreshes
  - Three separate storage keys:
    - `my-expenses-categories`
    - `my-expenses-accounts`
    - `my-expenses-transactions`
  - Data stored as JSON strings
  - Empty arrays used as default when no data exists

#### 4.5.2 Data Integrity

- **Priority**: P1 (High)
- **Description**: Maintain referential integrity across entities
- **Acceptance Criteria**:
  - Transaction accountId references remain valid
  - Transaction categoryId can be null
  - Deleted references handled gracefully (show fallback text)
  - No data corruption on concurrent operations

---

## 5. Non-Functional Requirements

### 5.1 Performance

- **Requirement**: Page load under 2 seconds on 3G connection
- **Requirement**: Instant UI updates after data operations (<100ms)
- **Requirement**: Support up to 10,000 transactions without performance degradation

### 5.2 Browser Compatibility

- **Requirement**: Support latest 2 versions of Chrome, Firefox, Safari, Edge
- **Requirement**: Requires JavaScript enabled
- **Requirement**: Requires localStorage support (no fallback)

### 5.3 Accessibility

- **Requirement**: Semantic HTML structure
- **Requirement**: Keyboard navigation support for forms
- **Requirement**: Form labels properly associated with inputs
- **Requirement**: ARIA attributes where appropriate (future enhancement)

### 5.4 Security

- **Requirement**: No user authentication (not required)
- **Requirement**: Data stays local (never transmitted)
- **Requirement**: No external API calls or tracking
- **Requirement**: XSS prevention through proper DOM handling

### 5.5 Localization

- **Requirement**: Spanish language UI
- **Requirement**: Mexican Peso (MXN) currency formatting
- **Requirement**: Date format: YYYY-MM-DD (ISO 8601)
- **Requirement**: Number format: Spanish locale (es-MX)

---

## 6. Constraints & Assumptions

### 6.1 Technical Constraints

- **localStorage Limitation**: ~5-10MB storage limit per domain
- **No Sync**: Data not synchronized across devices
- **No Backup**: Users responsible for exporting/backing up data
- **Browser Dependency**: Clearing browser data deletes all application data

### 6.2 Assumptions

- Users have modern web browsers (ES6+ support)
- Users understand localStorage data is device-specific
- Users comfortable with Spanish language interface
- Users managing personal finances (not business use)
- Internet connection required only for initial page load

---

## 7. Future Enhancements (Out of Scope v1.0)

### 7.1 Priority 2 (P2) Features

- **Export/Import Data**: JSON or CSV export/import functionality
- **Search & Filter**: Search transactions by description, filter by date range
- **Budget Management**: Set monthly budgets per category
- **Reports & Analytics**: Charts showing spending trends, category breakdowns
- **Recurring Transactions**: Template for recurring monthly expenses
- **Multi-currency Support**: Handle multiple currencies with conversion

### 7.2 Priority 3 (P3) Features

- **Account Transfer**: Move money between accounts
- **Split Transactions**: Single transaction across multiple categories
- **Attachments**: Upload receipts/images per transaction
- **Tags**: Additional labels beyond categories
- **Dark Mode**: Theme switcher for dark/light modes
- **PWA Support**: Install as Progressive Web App
- **Cloud Sync**: Optional cloud backup and multi-device sync
- **Shared Accounts**: Collaborative expense tracking for families

### 7.3 Technical Debt

- **Input Validation**: Enhanced validation with error messages
- **Confirmation Dialogs**: Confirm before deleting items
- **Undo Functionality**: Restore recently deleted items
- **Accessibility Audit**: Full WCAG 2.1 AA compliance
- **Unit Tests**: Comprehensive test coverage
- **E2E Tests**: Automated integration testing

---

## 8. Success Metrics

### 8.1 Adoption Metrics

- Daily Active Users (DAU)
- Average session duration
- Retention rate (7-day, 30-day)

### 8.2 Engagement Metrics

- Average transactions per user per week
- Average number of accounts per user
- Average number of categories per user
- Category utilization rate

### 8.3 Technical Metrics

- Page load time (target: <2s)
- JavaScript error rate (target: <1%)
- Browser compatibility coverage (target: >95%)
- localStorage usage per user

### 8.4 User Satisfaction

- User feedback/bug reports
- Feature request frequency
- App rating (if published to store)

---

## 9. Risks & Mitigations

| Risk                          | Impact | Probability | Mitigation                                  |
| ----------------------------- | ------ | ----------- | ------------------------------------------- |
| localStorage data loss        | High   | Medium      | Add export/import feature, educate users    |
| Browser localStorage disabled | High   | Low         | Show error message with instructions        |
| localStorage quota exceeded   | Medium | Low         | Implement storage monitoring, data archival |
| Accidental deletions          | Medium | High        | Add confirmation dialogs, undo feature      |
| Currency format confusion     | Low    | Low         | Clear documentation of MXN format           |
| Concurrent tab operations     | Medium | Low         | Implement storage event listeners           |

---

## 10. Release Plan

### Phase 1: MVP (Current)

- ✅ Category management (add, view, delete)
- ✅ Account management (add, view, delete)
- ✅ Transaction management (add, view, delete)
- ✅ Tab navigation
- ✅ localStorage persistence
- ✅ Balance calculation

### Phase 2: Enhancements (Q2 2026)

- Export/import functionality
- Search and filtering
- Confirmation dialogs
- Enhanced validation

### Phase 3: Analytics (Q3 2026)

- Spending reports
- Category charts
- Budget tracking
- Date range filtering

### Phase 4: Advanced Features (Q4 2026)

- PWA support
- Dark mode
- Recurring transactions
- Multi-currency support

---

## 11. Appendix

### 11.1 Glossary

- **Gasto**: Expense (money leaving an account)
- **Ingreso**: Income (money entering an account)
- **Cuenta**: Bank account
- **Tarjeta**: Credit card
- **Categoría**: Expense category for organization
- **Saldo**: Balance (current amount in account)

### 11.2 References

- Vite Documentation: https://vitejs.dev/
- localStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat

### 11.3 Document History

| Version | Date       | Author         | Changes              |
| ------- | ---------- | -------------- | -------------------- |
| 1.0     | 2026-02-24 | GitHub Copilot | Initial PRD creation |

---

**End of Document**
