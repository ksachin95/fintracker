// --- DEFAULT APP STATE ---
const DEFAULT_INCOME_CATEGORIES = [
    "Membership fees", 
    "Personal training", 
    "Merch/Supplements", 
    "Guest pass", 
    "Day pass", 
    "Other"
];

const DEFAULT_EXPENSE_CATEGORIES = [
    "Rent", 
    "Utilities", 
    "Staff salaries", 
    "Maintenance", 
    "Equipment purchase", 
    "Marketing", 
    "Cleaning supplies", 
    "Other"
];

// Seed sample data for high-fidelity first impression
const SAMPLE_TRANSACTIONS = [
    {
        id: "sample-1",
        title: "Monthly Membership Renewals",
        amount: 45000.00,
        type: "income",
        category: "Membership fees",
        method: "UPI",
        date: getFormattedDateOffset(0) // Today
    },
    {
        id: "sample-2",
        title: "Staff Gym Trainers Salary",
        amount: 25000.00,
        type: "expense",
        category: "Staff salaries",
        method: "Bank Transfer",
        date: getFormattedDateOffset(-2) // 2 days ago
    },
    {
        id: "sample-3",
        title: "Personal Training Package - Rajesh K.",
        amount: 12000.00,
        type: "income",
        category: "Personal training",
        method: "Card",
        date: getFormattedDateOffset(-4) // 4 days ago
    },
    {
        id: "sample-4",
        title: "Electric Bill (May 2026)",
        amount: 6800.00,
        type: "expense",
        category: "Utilities",
        method: "UPI",
        date: getFormattedDateOffset(-6) // 6 days ago
    },
    {
        id: "sample-5",
        title: "Protein Powders & Shaker Stock Purchase",
        amount: 15000.00,
        type: "expense",
        category: "Merch/Supplements",
        method: "Bank Transfer",
        date: getFormattedDateOffset(-15) // 15 days ago
    },
    {
        id: "sample-6",
        title: "Merchandise Supplement Sales",
        amount: 8400.00,
        type: "income",
        category: "Merch/Supplements",
        method: "Cash",
        date: getFormattedDateOffset(-12) // 12 days ago
    }
];

// Helper to get relative dates formatted as YYYY-MM-DD
function getFormattedDateOffset(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
}

// Global Variables
let transactions = [];
let incomeCategories = [];
let expenseCategories = [];
let activeCategoryTab = 'income'; // 'income' or 'expense' inside categories modal

// Active Filters
let activeFilters = {
    dateMode: 'all', // 'all', 'month', 'week', 'custom'
    startDate: '',
    endDate: '',
    category: 'all',
    paymentMethod: 'all',
    searchQuery: ''
};

// --- DOM ELEMENTS ---
const elements = {
    totalBalance: document.getElementById('total-balance'),
    totalIncome: document.getElementById('total-income'),
    totalExpense: document.getElementById('total-expense'),
    netMarginValue: document.getElementById('net-margin-value'),
    netMarginFill: document.getElementById('net-margin-fill'),
    balanceStatus: document.getElementById('balance-status'),
    
    // Quick Actions
    addIncomeBtn: document.getElementById('add-income-btn'),
    addExpenseBtn: document.getElementById('add-expense-btn'),
    manageCategoriesBtn: document.getElementById('manage-categories-btn'),
    currentDateEl: document.getElementById('current-date'),
    
    // Filters
    filterChips: document.querySelectorAll('.filter-chip'),
    customDateContainer: document.getElementById('custom-date-container'),
    filterStartDate: document.getElementById('filter-start-date'),
    filterEndDate: document.getElementById('filter-end-date'),
    filterCategory: document.getElementById('filter-category'),
    filterPaymentMethod: document.getElementById('filter-payment-method'),
    clearFiltersBtn: document.getElementById('clear-filters-btn'),
    searchTransactions: document.getElementById('search-transactions'),
    
    // Breakdown & Charts
    summaryMonthSelect: document.getElementById('summary-month-select'),
    categoryChartContainer: document.getElementById('category-chart-container'),
    
    // Transactions History
    transactionRows: document.getElementById('transaction-rows'),
    transactionTable: document.getElementById('transaction-table'),
    transactionCount: document.getElementById('transaction-count'),
    emptyState: document.getElementById('empty-state'),
    
    // Modals
    transactionModal: document.getElementById('transaction-modal'),
    closeTransModal: document.getElementById('close-transaction-modal'),
    cancelTransModal: document.getElementById('cancel-transaction-modal'),
    transactionForm: document.getElementById('transaction-form'),
    transFlowType: document.getElementById('transaction-flow-type'),
    modalTitle: document.getElementById('modal-title'),
    saveTransBtn: document.getElementById('save-transaction-btn'),
    
    // Modal Input Fields
    transId: document.getElementById('transaction-id'),
    transAmount: document.getElementById('trans-amount'),
    transDate: document.getElementById('trans-date'),
    transMethod: document.getElementById('trans-method'),
    transCategory: document.getElementById('trans-category'),
    transTitle: document.getElementById('trans-title'),
    
    // Categories Modal
    categoriesModal: document.getElementById('categories-modal'),
    closeCategoriesModal: document.querySelectorAll('#close-categories-modal, #close-categories-modal-btn'),
    categoriesListUl: document.getElementById('categories-list-ul'),
    addCategoryForm: document.getElementById('add-category-form'),
    newCategoryName: document.getElementById('new-category-name'),
    tabIncomeCategories: document.getElementById('tab-income-categories'),
    tabExpenseCategories: document.getElementById('tab-expense-categories'),
    
    // Toast
    toastContainer: document.getElementById('toast-container')
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
});

function initApp() {
    // 1. Load Categories
    const storedIncomeCats = localStorage.getItem('fitzone_categories_income');
    const storedExpenseCats = localStorage.getItem('fitzone_categories_expense');
    
    if (storedIncomeCats) {
        incomeCategories = JSON.parse(storedIncomeCats);
    } else {
        incomeCategories = [...DEFAULT_INCOME_CATEGORIES];
        localStorage.setItem('fitzone_categories_income', JSON.stringify(incomeCategories));
    }
    
    if (storedExpenseCats) {
        expenseCategories = JSON.parse(storedExpenseCats);
    } else {
        expenseCategories = [...DEFAULT_EXPENSE_CATEGORIES];
        localStorage.setItem('fitzone_categories_expense', JSON.stringify(expenseCategories));
    }
    
    // 2. Load Transactions
    const storedTransactions = localStorage.getItem('fitzone_transactions');
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    } else {
        // If first launch, load dummy gym transactions for rich demonstration
        transactions = [...SAMPLE_TRANSACTIONS];
        localStorage.setItem('fitzone_transactions', JSON.stringify(transactions));
    }

    // 3. Set Dashboard Current Date badge
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    elements.currentDateEl.querySelector('span').textContent = today.toLocaleDateString('en-US', options);

    // 4. Populate category selectors
    populateCategorySelectors();

    // 5. Populate month list in summary
    populateMonthSelectors();

    // 6. Refresh Views
    refreshDashboard();
}

// --- APP EVENT LISTENERS ---
function setupEventListeners() {
    // Quick Actions
    elements.addIncomeBtn.addEventListener('click', () => openTransactionModal('income'));
    elements.addExpenseBtn.addEventListener('click', () => openTransactionModal('expense'));
    elements.manageCategoriesBtn.addEventListener('click', openCategoriesModal);
    
    // Modals Close
    elements.closeTransModal.addEventListener('click', closeTransactionModal);
    elements.cancelTransModal.addEventListener('click', closeTransactionModal);
    
    elements.closeCategoriesModal.forEach(btn => {
        btn.addEventListener('click', closeCategoriesModal);
    });
    
    // Close modal on click backdrop
    window.addEventListener('click', (e) => {
        if (e.target === elements.transactionModal) closeTransactionModal();
        if (e.target === elements.categoriesModal) closeCategoriesModal();
    });

    // Save transaction
    elements.transactionForm.addEventListener('submit', handleTransactionSubmit);
    
    // Add category in modal
    elements.addCategoryForm.addEventListener('submit', handleAddCategorySubmit);

    // Search bar filter
    elements.searchTransactions.addEventListener('input', (e) => {
        activeFilters.searchQuery = e.target.value.trim().toLowerCase();
        refreshDashboard();
    });

    // Category filter dropdown
    elements.filterCategory.addEventListener('change', (e) => {
        activeFilters.category = e.target.value;
        refreshDashboard();
    });

    // Payment method filter dropdown
    elements.filterPaymentMethod.addEventListener('change', (e) => {
        activeFilters.paymentMethod = e.target.value;
        refreshDashboard();
    });

    // Clear filters
    elements.clearFiltersBtn.addEventListener('click', resetFilters);

    // Quick Date Chip click handlers
    elements.filterChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            elements.filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            const filterValue = chip.getAttribute('data-filter');
            activeFilters.dateMode = filterValue;
            
            if (filterValue === 'custom') {
                elements.customDateContainer.style.display = 'flex';
                // Trigger refresh only if date range set
                if (elements.filterStartDate.value && elements.filterEndDate.value) {
                    activeFilters.startDate = elements.filterStartDate.value;
                    activeFilters.endDate = elements.filterEndDate.value;
                }
            } else {
                elements.customDateContainer.style.display = 'none';
                activeFilters.startDate = '';
                activeFilters.endDate = '';
            }
            
            refreshDashboard();
        });
    });

    // Custom Date input changes
    elements.filterStartDate.addEventListener('change', (e) => {
        activeFilters.startDate = e.target.value;
        if (activeFilters.endDate) refreshDashboard();
    });
    elements.filterEndDate.addEventListener('change', (e) => {
        activeFilters.endDate = e.target.value;
        if (activeFilters.startDate) refreshDashboard();
    });

    // Monthly breakdown month change
    elements.summaryMonthSelect.addEventListener('change', () => {
        renderMonthlyBreakdown();
    });
}

// --- UTILITIES & HELPERS ---
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-circle-check';
    if (type === 'danger') iconClass = 'fa-triangle-exclamation';
    if (type === 'warning') iconClass = 'fa-circle-exclamation';
    
    toast.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <span>${message}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOutRight 0.3s forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// --- MODAL CONTROLLERS ---
function openTransactionModal(flowType) {
    elements.transFlowType.value = flowType;
    elements.transId.value = '';
    elements.transactionForm.reset();
    
    // Default today date
    const today = new Date().toISOString().split('T')[0];
    elements.transDate.value = today;

    // Load matching categories
    const targetCategories = flowType === 'income' ? incomeCategories : expenseCategories;
    elements.transCategory.innerHTML = '';
    targetCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        elements.transCategory.appendChild(option);
    });

    // Style adjustments for modal type
    if (flowType === 'income') {
        elements.modalTitle.innerHTML = `<i class="fa-solid fa-circle-arrow-down text-success"></i> Add Income`;
        elements.saveTransBtn.className = 'btn btn-success';
        elements.saveTransBtn.textContent = 'Save Income';
        elements.transAmount.className = 'amount-input-success';
    } else {
        elements.modalTitle.innerHTML = `<i class="fa-solid fa-circle-arrow-up text-danger"></i> Add Expense`;
        elements.saveTransBtn.className = 'btn btn-danger';
        elements.saveTransBtn.textContent = 'Save Expense';
        elements.transAmount.className = 'amount-input-danger';
    }

    elements.transactionModal.style.display = 'flex';
    elements.transAmount.focus();
}

function closeTransactionModal() {
    elements.transactionModal.style.display = 'none';
}

function openCategoriesModal() {
    activeCategoryTab = 'income';
    elements.tabIncomeCategories.classList.add('active');
    elements.tabExpenseCategories.classList.remove('active');
    
    renderCategoriesList();
    elements.categoriesModal.style.display = 'flex';
}

function closeCategoriesModal() {
    elements.categoriesModal.style.display = 'none';
    populateCategorySelectors();
    refreshDashboard();
}

// Switch categories inside manage categories tab
window.switchCategoryTab = function(type) {
    activeCategoryTab = type;
    if (type === 'income') {
        elements.tabIncomeCategories.classList.add('active');
        elements.tabExpenseCategories.classList.remove('active');
    } else {
        elements.tabIncomeCategories.classList.remove('active');
        elements.tabExpenseCategories.classList.add('active');
    }
    renderCategoriesList();
};

// --- DATA PROCESSING & CALCULATIONS ---

// Populate Category selectors in filter sidebars
function populateCategorySelectors() {
    // Filter Categories dropdown (all combined)
    const combinedCats = [...new Set([...incomeCategories, ...expenseCategories])];
    elements.filterCategory.innerHTML = '<option value="all">All Categories</option>';
    
    combinedCats.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        elements.filterCategory.appendChild(option);
    });
}

// Populate Month dropdown dynamically based on transaction history
function populateMonthSelectors() {
    const activeSelection = elements.summaryMonthSelect.value;
    elements.summaryMonthSelect.innerHTML = '';
    
    const months = [];
    // Always include current month
    const curDate = new Date();
    const currentMonthString = curDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    months.push(currentMonthString);

    transactions.forEach(t => {
        const d = new Date(t.date);
        const monthStr = d.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!months.includes(monthStr)) {
            months.push(monthStr);
        }
    });

    // Sort months chronologically (most recent first)
    months.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB - dateA;
    });

    months.forEach(m => {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = m;
        elements.summaryMonthSelect.appendChild(option);
    });

    // Preserve previous choice if still valid, or default to most recent
    if (activeSelection && months.includes(activeSelection)) {
        elements.summaryMonthSelect.value = activeSelection;
    } else {
        elements.summaryMonthSelect.value = months[0];
    }
}

// Filter the transactions list based on active filters
function getFilteredTransactions() {
    return transactions.filter(t => {
        // 1. Text Search Filter (Title & Category)
        const matchesSearch = !activeFilters.searchQuery || 
            t.title.toLowerCase().includes(activeFilters.searchQuery) ||
            t.category.toLowerCase().includes(activeFilters.searchQuery);

        // 2. Category Filter
        const matchesCategory = activeFilters.category === 'all' || t.category === activeFilters.category;

        // 3. Payment Method Filter
        const matchesMethod = activeFilters.paymentMethod === 'all' || t.method === activeFilters.paymentMethod;

        // 4. Date Range Filter
        let matchesDate = true;
        const transDate = new Date(t.date);
        const today = new Date();
        today.setHours(0,0,0,0);

        if (activeFilters.dateMode === 'week') {
            const oneWeekAgo = new Date(today);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            matchesDate = transDate >= oneWeekAgo && transDate <= new Date();
        } else if (activeFilters.dateMode === 'month') {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            matchesDate = transDate >= startOfMonth && transDate <= new Date();
        } else if (activeFilters.dateMode === 'custom') {
            if (activeFilters.startDate && activeFilters.endDate) {
                const sDate = new Date(activeFilters.startDate);
                sDate.setHours(0,0,0,0);
                const eDate = new Date(activeFilters.endDate);
                eDate.setHours(23,59,59,999);
                matchesDate = transDate >= sDate && transDate <= eDate;
            }
        }

        return matchesSearch && matchesCategory && matchesMethod && matchesDate;
    });
}

// Resets filters
function resetFilters() {
    activeFilters = {
        dateMode: 'all',
        startDate: '',
        endDate: '',
        category: 'all',
        paymentMethod: 'all',
        searchQuery: ''
    };
    
    // Reset inputs
    elements.searchTransactions.value = '';
    elements.filterCategory.value = 'all';
    elements.filterPaymentMethod.value = 'all';
    elements.filterStartDate.value = '';
    elements.filterEndDate.value = '';
    elements.customDateContainer.style.display = 'none';

    // Reset filter chips active states
    elements.filterChips.forEach(c => c.classList.remove('active'));
    elements.filterChips[0].classList.add('active'); // Set all time active
    
    showToast("Filters reset successfully");
    refreshDashboard();
}

// --- RENDER & DISPLAY REFRESH ---
function refreshDashboard() {
    const filtered = getFilteredTransactions();
    
    // Sort transactions by date descending, then ID descending
    filtered.sort((a, b) => {
        const dateDiff = new Date(b.date) - new Date(a.date);
        if (dateDiff !== 0) return dateDiff;
        return b.id.localeCompare(a.id);
    });

    // 1. Calculate and update dashboard stats
    updateStatsCards(filtered);

    // 2. Render transaction list
    renderTransactionsList(filtered);

    // 3. Re-render monthly breakdown
    renderMonthlyBreakdown();
}

// Calculate cumulative balance (Always Overall) and filtered statistics
function updateStatsCards(filteredTrans) {
    // A. Cumulative Overall Balance (Total all-time income - total all-time expense)
    let cumulativeIncome = 0;
    let cumulativeExpense = 0;
    
    transactions.forEach(t => {
        if (t.type === 'income') {
            cumulativeIncome += parseFloat(t.amount);
        } else {
            cumulativeExpense += parseFloat(t.amount);
        }
    });
    
    const balance = cumulativeIncome - cumulativeExpense;
    elements.totalBalance.textContent = formatCurrency(balance);

    // Color balance text based on net positive status
    if (balance > 0) {
        elements.totalBalance.className = "amount text-success";
        elements.balanceStatus.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> Surplus Cash`;
        elements.balanceStatus.className = "trend positive";
    } else if (balance < 0) {
        elements.totalBalance.className = "amount text-danger";
        elements.balanceStatus.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> Cash Deficit`;
        elements.balanceStatus.className = "trend negative";
    } else {
        elements.totalBalance.className = "amount";
        elements.balanceStatus.innerHTML = `<i class="fa-solid fa-info-circle"></i> Balanced`;
        elements.balanceStatus.className = "trend neutral";
    }

    // B. Filtered Statistics
    let incomeSum = 0;
    let expenseSum = 0;

    filteredTrans.forEach(t => {
        if (t.type === 'income') {
            incomeSum += parseFloat(t.amount);
        } else {
            expenseSum += parseFloat(t.amount);
        }
    });

    elements.totalIncome.textContent = formatCurrency(incomeSum);
    elements.totalExpense.textContent = formatCurrency(expenseSum);

    // C. Net Profit Margin Percentage
    let netMargin = 0;
    if (incomeSum > 0) {
        netMargin = Math.round(((incomeSum - expenseSum) / incomeSum) * 100);
    }
    
    elements.netMarginValue.textContent = `${netMargin}%`;
    
    // Scale profit bar (max 100%, min 0% for negative status)
    const displayPercentage = Math.max(0, Math.min(100, netMargin));
    elements.netMarginFill.style.width = `${displayPercentage}%`;

    if (netMargin >= 30) {
        elements.netMarginFill.style.background = "linear-gradient(90deg, #10b981, #34d399)"; // Emerald
    } else if (netMargin > 0 && netMargin < 30) {
        elements.netMarginFill.style.background = "linear-gradient(90deg, #f59e0b, #fbbf24)"; // Amber
    } else {
        elements.netMarginFill.style.background = "linear-gradient(90deg, #f43f5e, #fb7185)"; // Red
    }
}

// Render Transactions History Rows
function renderTransactionsList(filteredTrans) {
    elements.transactionRows.innerHTML = '';
    elements.transactionCount.textContent = filteredTrans.length;

    if (filteredTrans.length === 0) {
        elements.transactionTable.style.display = 'none';
        elements.emptyState.style.display = 'flex';
        return;
    }

    elements.transactionTable.style.display = 'table';
    elements.emptyState.style.display = 'none';

    filteredTrans.forEach(t => {
        const row = document.createElement('tr');
        row.id = `trans-row-${t.id}`;
        
        // Date formatting (DD-MMM-YYYY)
        const dateObj = new Date(t.date);
        const formattedDate = dateObj.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        const sign = t.type === 'income' ? '+' : '-';
        const flowClass = t.type === 'income' ? 'income' : 'expense';

        row.innerHTML = `
            <td class="col-date">${formattedDate}</td>
            <td class="col-desc">
                <div>${escapeHTML(t.title)}</div>
            </td>
            <td class="col-cat">
                <span class="cat-badge ${flowClass}">${escapeHTML(t.category)}</span>
            </td>
            <td class="col-method">
                <span class="method-tag">${escapeHTML(t.method)}</span>
            </td>
            <td class="col-amount text-right amount-flow ${flowClass}">
                ${sign}${formatCurrency(t.amount)}
            </td>
            <td class="col-action">
                <div class="action-buttons-cell">
                    <button onclick="openEditTransactionModal('${t.id}')" class="btn-edit-row" title="Edit Transaction">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button onclick="confirmDeleteTransaction('${t.id}')" class="btn-delete-row" title="Delete Transaction">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;

        elements.transactionRows.appendChild(row);
    });
}

// Render monthly category breakdowns on the sidebar summary card
function renderMonthlyBreakdown() {
    const selectedMonth = elements.summaryMonthSelect.value;
    elements.categoryChartContainer.innerHTML = '';

    if (!selectedMonth) {
        elements.categoryChartContainer.innerHTML = `
            <div class="empty-state-small">
                <i class="fa-solid fa-chart-line"></i>
                <p>No transaction history recorded</p>
            </div>
        `;
        return;
    }

    // Filter transactions belonging to selected Month & Year
    const monthTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        const monthStr = d.toLocaleString('default', { month: 'long', year: 'numeric' });
        return monthStr === selectedMonth;
    });

    if (monthTransactions.length === 0) {
        elements.categoryChartContainer.innerHTML = `
            <div class="empty-state-small">
                <i class="fa-solid fa-chart-line"></i>
                <p>No transactions recorded in ${selectedMonth}</p>
            </div>
        `;
        return;
    }

    // Group sums by category
    const categoryBreakdown = {};
    let totalMonthCash = 0;

    monthTransactions.forEach(t => {
        const amt = parseFloat(t.amount);
        totalMonthCash += amt;
        
        if (!categoryBreakdown[t.category]) {
            categoryBreakdown[t.category] = {
                amount: 0,
                type: t.type
            };
        }
        categoryBreakdown[t.category].amount += amt;
    });

    // Convert to array and sort by amount descending
    const breakdownArray = Object.keys(categoryBreakdown).map(catName => ({
        name: catName,
        amount: categoryBreakdown[catName].amount,
        type: categoryBreakdown[catName].type,
        percentage: totalMonthCash > 0 ? Math.round((categoryBreakdown[catName].amount / totalMonthCash) * 100) : 0
    })).sort((a, b) => b.amount - a.amount);

    breakdownArray.forEach(item => {
        const barItem = document.createElement('div');
        barItem.className = 'chart-bar-item';
        
        const dotClass = item.type === 'income' ? 'income' : 'expense';
        const fillStyle = item.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)';
        
        barItem.innerHTML = `
            <div class="chart-bar-header">
                <div class="chart-bar-label">
                    <span class="dot ${dotClass}"></span>
                    <span>${escapeHTML(item.name)}</span>
                </div>
                <span>${formatCurrency(item.amount)} (${item.percentage}%)</span>
            </div>
            <div class="chart-bar-bg">
                <div class="chart-bar-fill" style="width: ${item.percentage}%; background-color: ${fillStyle};"></div>
            </div>
        `;
        elements.categoryChartContainer.appendChild(barItem);
    });
}

// Render the categories list inside "Manage Categories Modal"
function renderCategoriesList() {
    elements.categoriesListUl.innerHTML = '';
    const targetCategories = activeCategoryTab === 'income' ? incomeCategories : expenseCategories;
    
    if (targetCategories.length === 0) {
        elements.categoriesListUl.innerHTML = '<li class="category-item" style="justify-content: center; color: var(--color-text-muted)">No custom categories added.</li>';
        return;
    }

    targetCategories.forEach(cat => {
        const li = document.createElement('li');
        li.className = 'category-item';
        
        // Show delete button for all categories
        // We will do a check to prevent deleting categories that have active transactions
        li.innerHTML = `
            <span>${escapeHTML(cat)}</span>
            <button type="button" onclick="deleteCategory('${escapeHTML(cat)}')">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        `;
        elements.categoriesListUl.appendChild(li);
    });
}

// --- DATA WRITE OPERATIONS ---

// Add a transaction
function handleTransactionSubmit(e) {
    e.preventDefault();

    const amtVal = parseFloat(elements.transAmount.value);
    const dateVal = elements.transDate.value;
    const methodVal = elements.transMethod.value;
    const catVal = elements.transCategory.value;
    const titleVal = elements.transTitle.value.trim();
    const typeVal = elements.transFlowType.value;

    if (isNaN(amtVal) || amtVal <= 0) {
        showToast("Please enter a valid amount greater than zero.", "danger");
        return;
    }

    if (!titleVal) {
        showToast("Please enter a description.", "danger");
        return;
    }

    if (!catVal) {
        showToast("Please select a category.", "danger");
        return;
    }

    const existingId = elements.transId.value;

    if (existingId) {
        // Edit existing transaction
        const index = transactions.findIndex(t => t.id === existingId);
        if (index !== -1) {
            transactions[index].title = titleVal;
            transactions[index].amount = amtVal;
            transactions[index].type = typeVal;
            transactions[index].category = catVal;
            transactions[index].method = methodVal;
            transactions[index].date = dateVal;
            
            localStorage.setItem('fitzone_transactions', JSON.stringify(transactions));
            showToast(`Updated transaction successfully!`);
        } else {
            showToast("Transaction not found.", "danger");
            return;
        }
    } else {
        // Create new transaction
        const newTransaction = {
            id: 'txn-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            title: titleVal,
            amount: amtVal,
            type: typeVal,
            category: catVal,
            method: methodVal,
            date: dateVal
        };

        transactions.push(newTransaction);
        localStorage.setItem('fitzone_transactions', JSON.stringify(transactions));
        showToast(`Added ${typeVal} of ${formatCurrency(amtVal)} successfully!`);
    }

    // Refresh display
    populateMonthSelectors();
    refreshDashboard();
    
    // Close modal
    closeTransactionModal();
}

// Edit transaction load modal
window.openEditTransactionModal = function(id) {
    const t = transactions.find(txn => txn.id === id);
    if (!t) return;

    elements.transFlowType.value = t.type;
    elements.transId.value = t.id;
    
    // Set field values
    elements.transAmount.value = t.amount;
    elements.transDate.value = t.date;
    elements.transMethod.value = t.method;
    elements.transTitle.value = t.title;

    // Load categories matching the transaction type
    const targetCategories = t.type === 'income' ? incomeCategories : expenseCategories;
    elements.transCategory.innerHTML = '';
    targetCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        elements.transCategory.appendChild(option);
    });
    
    // Select the category
    elements.transCategory.value = t.category;

    // Style adjustments for modal type
    if (t.type === 'income') {
        elements.modalTitle.innerHTML = `<i class="fa-solid fa-pen-to-square text-success"></i> Edit Income`;
        elements.saveTransBtn.className = 'btn btn-success';
        elements.saveTransBtn.textContent = 'Update Income';
        elements.transAmount.className = 'amount-input-success';
    } else {
        elements.modalTitle.innerHTML = `<i class="fa-solid fa-pen-to-square text-danger"></i> Edit Expense`;
        elements.saveTransBtn.className = 'btn btn-danger';
        elements.saveTransBtn.textContent = 'Update Expense';
        elements.transAmount.className = 'amount-input-danger';
    }

    elements.transactionModal.style.display = 'flex';
    elements.transAmount.focus();
};

// Delete transaction
window.confirmDeleteTransaction = function(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    const formattedAmt = formatCurrency(transaction.amount);
    const confirmMsg = `Delete "${transaction.title}" (${formattedAmt})?`;
    
    if (confirm(confirmMsg)) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('fitzone_transactions', JSON.stringify(transactions));
        
        populateMonthSelectors();
        refreshDashboard();
        
        showToast("Transaction deleted successfully", "warning");
    }
};

// Add Category
function handleAddCategorySubmit(e) {
    e.preventDefault();

    const newCatName = elements.newCategoryName.value.trim();
    if (!newCatName) return;

    const list = activeCategoryTab === 'income' ? incomeCategories : expenseCategories;
    
    // Duplicate check
    const duplicate = list.some(cat => cat.toLowerCase() === newCatName.toLowerCase());
    if (duplicate) {
        showToast("Category name already exists!", "danger");
        return;
    }

    list.push(newCatName);
    
    if (activeCategoryTab === 'income') {
        localStorage.setItem('fitzone_categories_income', JSON.stringify(incomeCategories));
    } else {
        localStorage.setItem('fitzone_categories_expense', JSON.stringify(expenseCategories));
    }

    elements.newCategoryName.value = '';
    renderCategoriesList();
    showToast(`Category "${newCatName}" added!`);
}

// Delete Category
window.deleteCategory = function(catName) {
    const list = activeCategoryTab === 'income' ? incomeCategories : expenseCategories;
    
    // Check if category is currently used by any transaction
    const inUse = transactions.some(t => t.category === catName && t.type === activeCategoryTab);
    if (inUse) {
        showToast(`Cannot delete! "${catName}" is currently used in active transactions.`, "danger");
        return;
    }

    if (confirm(`Are you sure you want to delete category "${catName}"?`)) {
        const updatedList = list.filter(cat => cat !== catName);
        
        if (activeCategoryTab === 'income') {
            incomeCategories = updatedList;
            localStorage.setItem('fitzone_categories_income', JSON.stringify(incomeCategories));
        } else {
            expenseCategories = updatedList;
            localStorage.setItem('fitzone_categories_expense', JSON.stringify(expenseCategories));
        }
        
        renderCategoriesList();
        showToast(`Category "${catName}" deleted`, "warning");
    }
};

// XSS Prevention Utility
function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
