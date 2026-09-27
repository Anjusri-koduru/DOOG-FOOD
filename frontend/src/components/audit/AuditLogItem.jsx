import React from "react";

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString();
}

function getActorName(actor) {
  if (!actor) return "System";

  if (typeof actor === "string") {
    return actor;
  }

  return actor.name || actor.email || "Unknown user";
}

function getEntityName(entityType) {
  if (!entityType) return "—";

  return entityType
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function AuditLogItem({ log, onViewDetails }) {
  if (!log) return null;

  return (
    <div className="audit-log-item">
      <div className="audit-log-item-header">
        <div>
          <h3>{log.action || "Action"}</h3>

          <p className="audit-log-description">
            {log.description || "No description available."}
          </p>
        </div>

        <span className="audit-log-date">
          {formatDate(log.createdAt || log.timestamp)}
        </span>
      </div>

      <div className="audit-log-meta">
        <div className="audit-log-meta-item">
          <span className="audit-log-label">Actor</span>
          <span className="audit-log-value">
            {getActorName(log.actor)}
          </span>
        </div>

        <div className="audit-log-meta-item">
          <span className="audit-log-label">Entity</span>
          <span className="audit-log-value">
            {getEntityName(log.entityType)}
          </span>
        </div>

        {log.entityId && (
          <div className="audit-log-meta-item">
            <span className="audit-log-label">Entity ID</span>
            <span className="audit-log-value audit-log-id">
              {String(log.entityId)}
            </span>
          </div>
        )}

        {log.event && (
          <div className="audit-log-meta-item">
            <span className="audit-log-label">Event</span>
            <span className="audit-log-value">
              {typeof log.event === "object"
                ? log.event.title || log.event.name || String(log.event._id || "")
                : String(log.event)}
            </span>
          </div>
        )}
      </div>

      {log.metadata &&
        typeof log.metadata === "object" &&
        Object.keys(log.metadata).length > 0 && (
          <div className="audit-log-metadata">
            <span className="audit-log-label">Metadata</span>

            <pre>
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        )}

      {onViewDetails && (
        <div className="audit-log-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onViewDetails(log)}
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
}

export default AuditLogItem;