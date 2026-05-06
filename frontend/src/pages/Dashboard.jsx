import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date_desc");

  const [editingTransactionId, setEditingTransactionId] = useState(null);

  const [newTransaction, setNewTransaction] = useState({
    account_id: 1,
    amount: "",
    merchant_name: "",
    merchant_category: "",
    transaction_location: "",
    transaction_time: "",
    transaction_type: "purchase",
    fraud_score: 0,
    risk_level: "low",
  });

  async function fetchTransactions() {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get("/transactions/", {
        params: {
          search: search || undefined,
          risk: risk || undefined,
          category: category || undefined,
          sort: sort || undefined,
        },
      });

      setTransactions(response.data);
    } catch (err) {
      setError("Could not load transactions from backend.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchDashboardSummary() {
    try {
      const response = await apiClient.get("/dashboard/summary");
      setSummary(response.data);
    } catch (err) {
      setError("Could not load dashboard summary.");
    }
  }

  useEffect(() => {
    fetchTransactions();
    fetchDashboardSummary();
  }, [search, risk, category, sort]);

  function downloadTransactionsCsv() {
    window.open("http://127.0.0.1:5000/api/export/transactions-csv", "_blank");
  }

  function clearFilters() {
    setSearch("");
    setRisk("");
    setCategory("");
    setSort("date_desc");
  }

  function resetTransactionForm() {
    setEditingTransactionId(null);

    setNewTransaction({
      account_id: 1,
      amount: "",
      merchant_name: "",
      merchant_category: "",
      transaction_location: "",
      transaction_time: "",
      transaction_type: "purchase",
      fraud_score: 0,
      risk_level: "low",
    });
  }

  function handleNewTransactionChange(event) {
    setNewTransaction({
      ...newTransaction,
      [event.target.name]: event.target.value,
    });
  }

  async function handleCreateTransaction(event) {
    event.preventDefault();
    setError("");

    const transactionPayload = {
      ...newTransaction,
      account_id: Number(newTransaction.account_id),
      amount: Number(newTransaction.amount),
      fraud_score: Number(newTransaction.fraud_score),
    };

    try {
      if (editingTransactionId) {
        await apiClient.put(
          `/transactions/${editingTransactionId}`,
          transactionPayload
        );
      } else {
        await apiClient.post("/transactions/", transactionPayload);
      }

      resetTransactionForm();
      fetchTransactions();
      fetchDashboardSummary();
    } catch (err) {
      setError(
        editingTransactionId
          ? "Could not update transaction."
          : "Could not create transaction."
      );
    }
  }

  function handleEditTransaction(transaction) {
    setEditingTransactionId(transaction.transaction_id);

    setNewTransaction({
      account_id: transaction.account_id,
      amount: transaction.amount,
      merchant_name: transaction.merchant_name,
      merchant_category: transaction.merchant_category,
      transaction_location: transaction.transaction_location,
      transaction_time: transaction.transaction_time.slice(0, 16),
      transaction_type: transaction.transaction_type,
      fraud_score: transaction.fraud_score,
      risk_level: transaction.risk_level,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteTransaction(transactionId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");

      await apiClient.delete(`/transactions/${transactionId}`);

      if (editingTransactionId === transactionId) {
        resetTransactionForm();
      }

      fetchTransactions();
      fetchDashboardSummary();
    } catch (err) {
      setError("Could not delete transaction.");
    }
  }

  const spendingByCategory = transactions.reduce((acc, transaction) => {
    const categoryName = transaction.merchant_category || "Other";
    const amount = Number(transaction.amount);

    const existingCategory = acc.find(
      (item) => item.category === categoryName
    );

    if (existingCategory) {
      existingCategory.total += amount;
    } else {
      acc.push({
        category: categoryName,
        total: amount,
      });
    }

    return acc;
  }, []);

  const transactionsByRisk = transactions.reduce((acc, transaction) => {
    const riskLevel = transaction.risk_level || "unknown";

    const existingRisk = acc.find((item) => item.risk === riskLevel);

    if (existingRisk) {
      existingRisk.count += 1;
    } else {
      acc.push({
        risk: riskLevel,
        count: 1,
      });
    }

    return acc;
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Bank Fraud Detection Application</h1>
      <p>Dashboard connected to Flask backend successfully.</p>

      <button
        onClick={downloadTransactionsCsv}
        style={{ padding: "0.7rem 1rem", marginBottom: "1rem" }}
      >
        Download Transactions CSV
      </button>

      {summary && (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            margin: "1.5rem 0",
          }}
        >
          <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>Total Transactions</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {summary.total_transactions}
            </p>
          </div>

          <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>Total Spending</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              ${summary.total_spending.toFixed(2)}
            </p>
          </div>

          <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>High-Risk Transactions</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {summary.high_risk_transactions}
            </p>
          </div>

          <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>Pending Fraud Alerts</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {summary.pending_fraud_alerts}
            </p>
          </div>

          <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>Average Fraud Score</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {summary.average_fraud_score}
            </p>
          </div>
        </section>
      )}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            height: "350px",
          }}
        >
          <h2>Spending by Category</h2>

          {spendingByCategory.length === 0 ? (
            <p>No spending data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={spendingByCategory}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div
          style={{
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            height: "350px",
          }}
        >
          <h2>Transactions by Risk Level</h2>

          {transactionsByRisk.length === 0 ? (
            <p>No risk data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={transactionsByRisk}
                  dataKey="count"
                  nameKey="risk"
                  outerRadius={100}
                  label
                >
                  {transactionsByRisk.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <h2>{editingTransactionId ? "Edit Transaction" : "Add New Transaction"}</h2>

      <form
        onSubmit={handleCreateTransaction}
        style={{
          display: "grid",
          gap: "1rem",
          maxWidth: "700px",
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newTransaction.amount}
          onChange={handleNewTransactionChange}
          required
          style={{ padding: "0.5rem" }}
        />

        <input
          type="text"
          name="merchant_name"
          placeholder="Merchant Name"
          value={newTransaction.merchant_name}
          onChange={handleNewTransactionChange}
          required
          style={{ padding: "0.5rem" }}
        />

        <input
          type="text"
          name="merchant_category"
          placeholder="Merchant Category"
          value={newTransaction.merchant_category}
          onChange={handleNewTransactionChange}
          required
          style={{ padding: "0.5rem" }}
        />

        <input
          type="text"
          name="transaction_location"
          placeholder="Transaction Location"
          value={newTransaction.transaction_location}
          onChange={handleNewTransactionChange}
          required
          style={{ padding: "0.5rem" }}
        />

        <input
          type="datetime-local"
          name="transaction_time"
          value={newTransaction.transaction_time}
          onChange={handleNewTransactionChange}
          required
          style={{ padding: "0.5rem" }}
        />

        <select
          name="transaction_type"
          value={newTransaction.transaction_type}
          onChange={handleNewTransactionChange}
          style={{ padding: "0.5rem" }}
        >
          <option value="purchase">Purchase</option>
          <option value="transfer">Transfer</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="deposit">Deposit</option>
        </select>

        <select
          name="risk_level"
          value={newTransaction.risk_level}
          onChange={handleNewTransactionChange}
          style={{ padding: "0.5rem" }}
        >
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>

        <input
          type="number"
          name="fraud_score"
          placeholder="Fraud Score"
          value={newTransaction.fraud_score}
          onChange={handleNewTransactionChange}
          min="0"
          max="100"
          style={{ padding: "0.5rem" }}
        />

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" style={{ padding: "0.7rem 1rem" }}>
            {editingTransactionId ? "Save Changes" : "Add Transaction"}
          </button>

          {editingTransactionId && (
            <button
              type="button"
              onClick={resetTransactionForm}
              style={{ padding: "0.7rem 1rem" }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h2>Transaction Filters</h2>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Search merchant..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ padding: "0.5rem", minWidth: "200px" }}
        />

        <select
          value={risk}
          onChange={(event) => setRisk(event.target.value)}
          style={{ padding: "0.5rem" }}
        >
          <option value="">All Risks</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={{ padding: "0.5rem" }}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Groceries">Groceries</option>
          <option value="Transportation">Transportation</option>
          <option value="Transfer">Transfer</option>
          <option value="Crypto">Crypto</option>
          <option value="Shopping">Shopping</option>
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          style={{ padding: "0.5rem" }}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="amount_desc">Amount: High to Low</option>
          <option value="amount_asc">Amount: Low to High</option>
          <option value="fraud_score_desc">Fraud Score: High to Low</option>
          <option value="fraud_score_asc">Fraud Score: Low to High</option>
        </select>

        <button onClick={clearFilters} style={{ padding: "0.5rem 1rem" }}>
          Clear Filters
        </button>
      </div>

      <h2>Transactions</h2>

      {loading && <p>Loading transactions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <p>Total transactions shown: {transactions.length}</p>

          <table
            border="1"
            cellPadding="10"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Location</th>
                <th>Risk</th>
                <th>Fraud Score</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.transaction_id}>
                  <td>{transaction.transaction_id}</td>
                  <td>{transaction.merchant_name}</td>
                  <td>{transaction.merchant_category}</td>
                  <td>${transaction.amount}</td>
                  <td>{transaction.transaction_location}</td>
                  <td>
                    <span className={`risk-badge risk-${transaction.risk_level}`}>
                     {transaction.risk_level}
                    </span>
                  </td>
                  <td>{transaction.fraud_score}</td>
                  <td>
                    {new Date(transaction.transaction_time).toLocaleString()}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditTransaction(transaction)}
                      style={{
                        padding: "0.4rem 0.7rem",
                        cursor: "pointer",
                        marginRight: "0.5rem",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteTransaction(transaction.transaction_id)
                      }
                      style={{
                        padding: "0.4rem 0.7rem",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <p>No transactions match your current filters.</p>
          )}
        </>
      )}
    </main>
  );
}

export default Dashboard;