/*constants, state and DOM references*/

"use strict";

/* ---------- 1. Constants and state ---------- */
const STORAGE_KEY = "expense-tracker-transactions";

const CATEGORIES = {
  expense: ["Food", "Travel", "Shopping", "Bills", "Rent", "Health", "Entertainment", "Other"],
  income: ["Salary", "Freelance", "Gift", "Investment", "Other"],
};

let transactions = loadTransactions(); // array of transaction objects
let editingId = null;                  // id of the transaction being edited (null = adding)

/* ---------- 2. DOM references ---------- */
const form = document.getElementById("txnForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const categorySelect = document.getElementById("category");
const typeRadios = document.querySelectorAll('input[name="type"]');
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formHeading = document.getElementById("formHeading");

const searchInput = document.getElementById("search");
const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");

const txnBody = document.getElementById("txnBody");
const tableWrap = document.querySelector(".table-wrap");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyText = document.getElementById("emptyText");
const resultCount = document.getElementById("resultCount");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("totalIncome");
const expenseEl = document.getElementById("totalExpense");
const countEl = document.getElementById("txnCount");
const flowSpent = document.getElementById("flowSpent");
const flowCaption = document.getElementById("flowCaption");
const toastArea = document.getElementById("toastArea");
/* ---------- 3. Local Storage (JSON) ---------- */
function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Could not read saved data:", error);
    return [];
  }
}

function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    showToast("Could not save to your browser storage.", "error");
  }
}
/*helper functions*/
/* ---------- 4. Helpers ---------- */
const formatMoney = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split("-");
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const todayISO = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 10);
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const escapeHTML = (text) =>
  text.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

const getSelectedType = () => document.querySelector('input[name="type"]:checked').value;

function showToast(message, kind = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${kind === "error" ? "error" : ""}`;
  toast.textContent = message;
  toastArea.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}


/*category dropdowns and a temporary start*/
/* ---------- 5. Category dropdowns ---------- */
function fillFormCategories(type, selected = "") {
  categorySelect.innerHTML =
    `<option value="">Select a category</option>` +
    CATEGORIES[type].map((cat) => `<option value="${cat}">${cat}</option>`).join("");
  categorySelect.value = selected;
}

function fillFilterCategories() {
  const all = [...new Set([...CATEGORIES.expense, ...CATEGORIES.income])];
  filterCategory.innerHTML =
    `<option value="all">All categories</option>` +
    all.map((cat) => `<option value="${cat}">${cat}</option>`).join("");
}

// Show matching categories when the type changes
typeRadios.forEach((radio) =>
  radio.addEventListener("change", () => fillFormCategories(getSelectedType()))
);

/* ---------- Temporary start (we replace this in step 6) ---------- */
fillFilterCategories();
fillFormCategories("expense");
dateInput.value = todayISO();



