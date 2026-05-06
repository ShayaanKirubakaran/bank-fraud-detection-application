import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function FraudAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchFraudAlerts() {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get("/fraud/alerts");
      setAlerts(response.data);
    } catch (err) {
      setError("Could not load fraud alerts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFraudAlerts();
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Fraud Alerts</h1>
      <p>Review high-risk transactions automatically flagged by the fraud scoring engine.</p>

      {loading && <p>Loading fraud alerts...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <p>Total alerts: {alerts.length}</p>

          {alerts.length === 0 ? (
            <p>No fraud alerts found.</p>
          ) : (
            <table
              border="1"
              cellPadding="10"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th>Alert ID</th>
                  <th>Merchant</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Risk</th>
                  <th>Fraud Score</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>

              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.alert_id}>
                    <td>{alert.alert_id}</td>
                    <td>{alert.transaction?.merchant_name}</td>
                    <td>${alert.transaction?.amount}</td>
                    <td>{alert.transaction?.merchant_category}</td>
                    <td>{alert.transaction?.transaction_location}</td>
                    <td>{alert.transaction?.risk_level}</td>
                    <td>{alert.transaction?.fraud_score}</td>
                    <td>{alert.alert_reason}</td>
                    <td>{alert.status}</td>
                    <td>{new Date(alert.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </main>
  );
}

export default FraudAlerts;