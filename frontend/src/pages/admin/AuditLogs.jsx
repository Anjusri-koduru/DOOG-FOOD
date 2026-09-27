import { useEffect, useState } from "react";

import auditService from "../../services/auditService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import AuditLogList from "../../components/audit/AuditLogList";

function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (action.trim()) {
        params.action = action.trim();
      }

      if (entityType.trim()) {
        params.entityType = entityType.trim();
      }

      const response = await auditService.getLogs(params);

      const data =
        response?.data?.logs ||
        response?.data ||
        response?.logs ||
        [];

      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load audit logs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (event) => {
    event.preventDefault();
    loadLogs();
  };

  const handleClear = () => {
    setAction("");
    setEntityType("");

    setTimeout(() => {
      loadLogs();
    }, 0);
  };

  return (
    <div className="page-container">
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Admin Audit Logs</h1>

          <p>
            Monitor important activities performed across
            the DOGFOOD platform.
          </p>
        </div>
      </div>

      {/* =========================
          FILTERS
      ========================= */}

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Filter Logs</h2>

            <p>
              Search audit records by action or entity type.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleFilter}
          className="form-card"
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="audit-action">
                Action
              </label>

              <input
                id="audit-action"
                type="text"
                value={action}
                onChange={(event) =>
                  setAction(event.target.value)
                }
                placeholder="Example: CREATE, UPDATE, DELETE"
              />
            </div>

            <div className="form-group">
              <label htmlFor="audit-entity">
                Entity Type
              </label>

              <input
                id="audit-entity"
                type="text"
                value={entityType}
                onChange={(event) =>
                  setEntityType(event.target.value)
                }
                placeholder="Example: User, Event, Project"
              />
            </div>
          </div>

          <div
            className="form-actions"
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <button
              type="submit"
              className="btn btn-primary"
            >
              Search
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div style={{ marginTop: "20px" }}>
          <ErrorMessage message={error} />
        </div>
      )}

      {/* =========================
          LOGS
      ========================= */}

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Platform Activity</h2>

            <p>
              Total logs loaded: {logs.length}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadLogs}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <AuditLogList logs={logs} />
        )}
      </div>
    </div>
  );
}

export default AdminAuditLogs;