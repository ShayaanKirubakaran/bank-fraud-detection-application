import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date_desc");

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

  useEffect(() => {
    fetchTransactions();
  }, [search, risk, category, sort]);

  function clearFilters() {
    setSearch("");
    setRisk("");
    setCategory("");
    setSort("date_desc");
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Bank Fraud Detection Application</h1>
      <p>Dashboard connected to Flask backend successfully.</p>

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
                  <td>{transaction.risk_level}</td>
                  <td>{transaction.fraud_score}</td>
                  <td>{new Date(transaction.transaction_time).toLocaleString()}</td>
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