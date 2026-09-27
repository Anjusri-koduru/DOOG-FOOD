import React from "react";
import AuditLogItem from "./AuditLogItem";

function AuditLogList({
  logs = [],
  loading = false,
  error = "",
  onViewDetails,
}) {
  if (loading) {
    return (
      <div className="audit-log-state">
        <div className="loading-spinner" />
        <p>Loading audit logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="audit-log-state audit-log-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="audit-log-state">
        <h3>No audit logs found</h3>
        <p>
          Audit activity will appear here when actions are recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="audit-log-list">
      {logs.map((log) => (
        <AuditLogItem
          key={log._id || log.id}
          log={log}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

export default AuditLogList;