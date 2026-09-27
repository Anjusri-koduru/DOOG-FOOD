import { useEffect, useState } from "react";

import judgeService from "../../services/judgeService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function AdminJudges() {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadJudges();
  }, []);

  const loadJudges = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await judgeService.getAllJudges();

      const data =
        response?.data?.judges ||
        response?.data ||
        response?.judges ||
        [];

      setJudges(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load judges."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Manage Judges</h1>

          <p>
            View and monitor judges registered on the
            DOGFOOD platform.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadJudges}
        >
          Refresh
        </button>
      </div>

      {error && (
        <ErrorMessage message={error} />
      )}

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Judges</h2>

            <p>
              Total judges: {judges.length}
            </p>
          </div>
        </div>

        {judges.length === 0 ? (
          <div className="empty-state">
            <h3>No judges found</h3>

            <p>
              There are currently no judges available.
            </p>
          </div>
        ) : (
          <div className="dashboard-card-grid">
            {judges.map((judge) => (
              <div
                key={judge._id}
                className="dashboard-card"
              >
                <div className="dashboard-card-icon">
                  👨‍⚖️
                </div>

                <div className="dashboard-card-content">
                  <h3>
                    {judge.name || "Unnamed Judge"}
                  </h3>

                  <p>
                    <strong>Email:</strong>{" "}
                    {judge.email || "Not available"}
                  </p>

                  <p>
                    <strong>Role:</strong>{" "}
                    {judge.role || "judge"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {judge.isActive
                      ? "Active"
                      : "Inactive"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminJudges;