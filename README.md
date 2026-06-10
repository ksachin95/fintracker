# FitZone Gym - Finance Tracker

A sleek, modern, and framework-free web-based Finance Tracker designed for **FitZone Gym** to digitize daily financial logging, replacing manual notebook tracking. 

The application is built for gym staff with basic computer skills, prioritizing clear visibility of gym cash flow, surplus statuses, and visual breakdown analytics.

---

## 🚀 Key Features

*   **Financial Dashboard Widgets**:
    *   **Current Balance**: Real-time overall net cash flow status (surplus or deficit indicators).
    *   **Total Income & Expenses**: Summarized outgoing and incoming cash flow relative to active date/type filters.
    *   **Net Profit Margin**: Color-coded percentage meter detailing gym efficiency (surplus, caution, or deficit).
*   **Transaction CRUD**:
    *   **Add Entries**: Log income or expense transactions with Amount, Date, Category, Payment Method, and Description.
    *   **Edit Entries**: Modify recorded logs instantly with automatic state recalculation.
    *   **Delete Entries**: Double-confirmed removal of transaction items.
*   **Ledger Filters & Search**:
    *   Dynamic live search by description or category.
    *   Filters by payment methods (Cash, Card, UPI, Bank Transfer).
    *   Filter by specific transaction category.
    *   Preselected date ranges (All Time, This Month, This Week) or Custom start/end date selectors.
*   **Monthly Summary Breakdown**:
    *   Dynamic select input to filter data by month/year.
    *   Sleek progress bar charts illustrating category allocations (e.g., membership fees vs. utilities expense distribution).
*   **Category Management Panel**:
    *   Create custom categories for income and expenses.
    *   Delete categories with a built-in safety check (prevents deletion if the category is currently used in active logs to preserve data integrity).
*   **Aesthetic & Responsive UI**:
    *   Premium light professional theme with crisp typography (`Plus Jakarta Sans`) and smooth hover animations.
    *   Fully optimized viewport scaling (Mobile block layout fallback for effortless touch-targets).

---

## 🛠️ Technology Stack

*   **Markup**: HTML5 (Semantic elements)
*   **Styling**: Vanilla CSS3 (CSS Custom Properties, Flexbox, Grid, keyframe animations)
*   **Logic**: Vanilla JavaScript (ES6+ array utilities, DOM bindings, and event streams)
*   **Storage**: Browser `localStorage` (Zero external database dependencies)
*   **Icons**: FontAwesome v6.4.0 (CDN linked)

---

## 📁 Project Structure

```text
Fintrack/
├── index.html     # Application structure & markup
├── style.css      # Styling rules & responsive breakpoints
├── app.js         # State machine, storage logic, and DOM rendering
└── README.md      # Project documentation
```

---

## 💻 Getting Started

### 1. Requirements
A modern web browser (Chrome, Firefox, Safari, Edge).

### 2. Running the App
Since the application relies on vanilla assets, you can run it in two ways:

#### Option A: Direct File Open
Double-click `index.html` or drag the file into any web browser window to load the tracker immediately.

#### Option B: Local Static Server (Recommended)
To run in a server context, launch a lightweight server inside the project folder:
*   **Using Node.js**:
    ```bash
    npx http-server -p 8000
    ```
*   **Using Python**:
    ```bash
    python -m http.server 8000
    ```
Then, navigate to **`http://localhost:8000`** in your browser.

---

## 🔒 Data Portability & Storage
All financial records are stored client-side in the browser's `localStorage` namespace (`fitzone_transactions`). 
*   **Privacy**: Your financial data remains local to your device and is never transmitted to any external servers.
*   **Caution**: Clearing your web browser's application cache or website data for this URL will clear the transactions history.
