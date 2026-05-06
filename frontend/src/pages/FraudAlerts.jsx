import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function FraudAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  function downloadFraudAlertsCsv() {
    window.open("http://127.0.0.1:5000/api/export/fraud-alerts-csv", "_blank");
  }

  function handleAlertChange(alertId, field, value) {
    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) =>
        alert.alert_id === alertId
          ? {
              ...alert,
              [field]: value,
            }
          : alert
      )
    );
  }

  async function handleSaveReview(alert) {
    try {
      setError("");
      setSuccessMessage("");

      await apiClient.put(`/fraud/alerts/${alert.alert_id}/review`, {
        status: alert.status,
        review_notes: alert.review_notes || "",
        reviewed_by: 1,
      });

      setSuccessMessage(`Alert ${alert.alert_id} reviewed successfully.`);
      fetchFraudAlerts();
    } catch (err) {
      setError("Could not save fraud alert review.");
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Fraud Alerts</h1>

      <p>
        Review high-risk transactions automatically flagged by the fraud scoring
        engine.
      </p>

      <button
        onClick={downloadFraudAlertsCsv}
        style={{ padding: "0.7rem 1rem", marginBottom: "1rem" }}
      >
        Download Fraud Alerts CSV
      </button>

      {loading && <p>Loading fraud alerts...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

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
                  <th>Review Notes</th>
                  <th>Reviewed At</th>
                  <th>Action</th>
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

                    <td>
                      <span
                        className={`risk-badge risk-${alert.transaction?.risk_level}`}
                      >
                        {alert.transaction?.risk_level}
                      </span>
                    </td>

                    <td>{alert.transaction?.fraud_score}</td>
                    <td>{alert.alert_reason}</td>

                    <td>
                      <div style={{ display: "grid", gap: "0.5rem" }}>
                        <span
                          className={`status-badge status-${alert.status.replaceAll(
                            " ",
                            "-"
                          )}`}
                        >
                          {alert.status}
                        </span>

                        <select
                          value={alert.status}
                          onChange={(event) =>
                            handleAlertChange(
                              alert.alert_id,
                              "status",
                              event.target.value
                            )
                          }
                          style={{ padding: "0.5rem" }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed fraud">
                            Confirmed Fraud
                          </option>
                          <option value="false positive">False Positive</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </td>

                    <td>
                      <textarea
                        value={alert.review_notes || ""}
                        onChange={(event) =>
                          handleAlertChange(
                            alert.alert_id,
                            "review_notes",
                            event.target.value
                          )
                        }
                        placeholder="Add review notes..."
                        rows="3"
                        style={{ width: "220px", padding: "0.5rem" }}
                      />
                    </td>

                    <td>
                      {alert.reviewed_at
                        ? new Date(alert.reviewed_at).toLocaleString()
                        : "Not reviewed"}
                    </td>

                    <td>
                      <button
                        onClick={() => handleSaveReview(alert)}
                        style={{
                          padding: "0.5rem 0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        Save Review
                      </button>
                    </td>
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