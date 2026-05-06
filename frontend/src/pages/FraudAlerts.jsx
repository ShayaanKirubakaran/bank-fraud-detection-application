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
    <main>
      <section
        className="card-lg"
        style={{
          padding: "1.5rem",
          marginBottom: "1.5rem",
          background: "linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <h1 className="page-title">Fraud Alerts</h1>
            <p className="page-subtitle">
              Review high-risk transactions automatically flagged by the fraud
              scoring engine.
            </p>
          </div>

          <button
            onClick={downloadFraudAlertsCsv}
            style={{ padding: "0.8rem 1.1rem" }}
          >
            Download Fraud Alerts CSV
          </button>
        </div>
      </section>

      {loading && (
        <section className="card" style={{ padding: "1.25rem" }}>
          <p className="muted">Loading fraud alerts...</p>
        </section>
      )}

      {error && (
        <section className="card" style={{ padding: "1.25rem" }}>
          <p style={{ color: "#991b1b", margin: 0 }}>{error}</p>
        </section>
      )}

      {successMessage && (
        <section
          className="card"
          style={{
            padding: "1rem 1.25rem",
            marginBottom: "1rem",
            background: "#f0fdf4",
            borderColor: "#bbf7d0",
          }}
        >
          <p style={{ color: "#166534", margin: 0 }}>{successMessage}</p>
        </section>
      )}

      {!loading && !error && (
        <section className="card-lg" style={{ padding: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>Alert Review Queue</h2>
              <p className="muted" style={{ marginBottom: 0 }}>
                Total alerts: {alerts.length}
              </p>
            </div>
          </div>

          {alerts.length === 0 ? (
            <p className="muted">No fraud alerts found.</p>
          ) : (
            <div className="table-wrapper">
              <table cellPadding="12" style={{ width: "100%" }}>
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

                      <td style={{ maxWidth: "320px" }}>
                        <span className="muted">{alert.alert_reason}</span>
                      </td>

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
                            style={{ padding: "0.65rem", minWidth: "150px" }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed fraud">
                              Confirmed Fraud
                            </option>
                            <option value="false positive">
                              False Positive
                            </option>
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
                          style={{
                            width: "240px",
                            padding: "0.65rem",
                            resize: "vertical",
                          }}
                        />
                      </td>

                      <td>
                        <span className="muted">
                          {alert.reviewed_at
                            ? new Date(alert.reviewed_at).toLocaleString()
                            : "Not reviewed"}
                        </span>
                      </td>

                      <td>
                        <button
                          onClick={() => handleSaveReview(alert)}
                          style={{
                            padding: "0.55rem 0.85rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Save Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default FraudAlerts;