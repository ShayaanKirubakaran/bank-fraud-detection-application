import { useEffect, useState } from "react";
import apiClient from "./api/apiClient";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await apiClient.get("/transactions/");
        setTransactions(response.data);
      } catch (err) {
        setError("Could not load transactions from backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  if (loading) {
    return <h1>Loading transactions...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Bank Fraud Detection Application</h1>
      <p>Frontend connected to Flask backend successfully.</p>

      <h2>Transactions</h2>

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Merchant</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Location</th>
            <th>Risk</th>
            <th>Fraud Score</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;