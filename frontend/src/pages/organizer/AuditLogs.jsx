import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";

import auditService from "../../services/auditService";
import AuditLogList from "../../components/audit/AuditLogList";

function getArrayFromResponse(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.logs)) {
    return response.logs;
  }

  if (Array.isArray(response?.data?.logs)) {
    return response.data.logs;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  if (
    Array.isArray(
      response?.data?.results
    )
  ) {
    return response.data.results;
  }

  return [];
}

function getPaginationFromResponse(
  response
) {
  return (
    response?.data?.pagination ||
    response?.pagination ||
    null
  );
}

function AuditLogs() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const initialEventId =
    searchParams.get("eventId") || "";

  const [
    logs,
    setLogs,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    eventId,
    setEventId,
  ] = useState(initialEventId);

  const [
    action,
    setAction,
  ] = useState("");

  const [
    entityType,
    setEntityType,
  ] = useState("");

  const [
    selectedLog,
    setSelectedLog,
  ] = useState(null);

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    pagination,
    setPagination,
  ] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const loadLogs = async (
    requestedPage = page
  ) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: requestedPage,
        limit: 20,
      };

      /*
       * eventId is OPTIONAL for organizer.
       *
       * If eventId exists:
       *   backend filters by that event.
       *
       * If eventId does not exist:
       *   backend automatically finds
       *   all events belonging to organizer.
       */

      if (
        eventId &&
        eventId.trim() &&
        eventId !== "undefined" &&
        eventId !== "null"
      ) {
        params.eventId =
          eventId.trim();
      }

      if (
        action &&
        action.trim()
      ) {
        params.action =
          action.trim();
      }

      if (
        entityType &&
        entityType.trim()
      ) {
        params.entityType =
          entityType.trim();
      }

      const response =
        await auditService.getLogs(
          params
        );

      const receivedLogs =
        getArrayFromResponse(
          response
        );

      const receivedPagination =
        getPaginationFromResponse(
          response
        );

      setLogs(
        Array.isArray(receivedLogs)
          ? receivedLogs
          : []
      );

      if (receivedPagination) {
        setPagination(
          receivedPagination
        );

        setPage(
          Number(
            receivedPagination.page
          ) || requestedPage
        );
      } else {
        setPagination({
          page: requestedPage,
          limit: 20,
          total: receivedLogs.length,
          pages:
            receivedLogs.length > 0
              ? 1
              : 0,
        });

        setPage(requestedPage);
      }
    } catch (err) {
      console.error(
        "Failed to load audit logs:",
        err
      );

      setLogs([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load audit logs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(1);
  }, []);

  const handleSearch = async (
    event
  ) => {
    event.preventDefault();

    const params = {};

    if (
      eventId &&
      eventId.trim() &&
      eventId !== "undefined" &&
      eventId !== "null"
    ) {
      params.eventId =
        eventId.trim();
    }

    if (
      action &&
      action.trim()
    ) {
      params.action =
        action.trim();
    }

    if (
      entityType &&
      entityType.trim()
    ) {
      params.entityType =
        entityType.trim();
    }

    setSearchParams(params);

    setPage(1);

    await loadLogs(1);
  };

  const handleClearFilters =
    async () => {
      setEventId("");
      setAction("");
      setEntityType("");

      setSearchParams({});

      setPage(1);

      try {
        setLoading(true);
        setError("");

        /*
         * No eventId here.
         *
         * Backend will automatically
         * load organizer's own event logs.
         */

        const response =
          await auditService.getLogs({
            page: 1,
            limit: 20,
          });

        setLogs(
          getArrayFromResponse(
            response
          )
        );

        const receivedPagination =
          getPaginationFromResponse(
            response
          );

        if (receivedPagination) {
          setPagination(
            receivedPagination
          );
        } else {
          setPagination({
            page: 1,
            limit: 20,
            total: getArrayFromResponse(
              response
            ).length,
            pages: 1,
          });
        }
      } catch (err) {
        console.error(
          "Failed to load audit logs:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Failed to load audit logs."
        );

        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

  const handlePrevious =
    async () => {
      if (page <= 1) {
        return;
      }

      await loadLogs(
        page - 1
      );
    };

  const handleNext =
    async () => {
      if (
        pagination.pages &&
        page >= pagination.pages
      ) {
        return;
      }

      await loadLogs(
        page + 1
      );
    };

  const statistics =
    useMemo(() => {
      const total =
        pagination.total ||
        logs.length;

      const actionCounts = {};

      logs.forEach((log) => {
        const currentAction =
          log?.action ||
          "Unknown";

        actionCounts[
          currentAction
        ] =
          (actionCounts[
            currentAction
          ] || 0) + 1;
      });

      const uniqueActors =
        new Set();

      logs.forEach((log) => {
        const actor =
          log?.actor;

        if (!actor) {
          return;
        }

        const actorId =
          typeof actor ===
          "object"
            ? actor._id ||
              actor.id ||
              actor.email
            : actor;

        if (actorId) {
          uniqueActors.add(
            String(actorId)
          );
        }
      });

      return {
        total,
        uniqueActors:
          uniqueActors.size,
        actionTypes:
          Object.keys(
            actionCounts
          ).length,
      };
    }, [
      logs,
      pagination.total,
    ]);

  return (
    <div className="page-container audit-logs-page">
      <div className="page-header">
        <div>
          <h1>
            Audit Logs
          </h1>

          <p>
            Track important
            activities and changes
            performed in the
            platform.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            loadLogs(page)
          }
          disabled={loading}
        >
          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {error && (
        <div
          className="form-error"
          style={{
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="audit-statistics">
        <div className="audit-stat-card">
          <span className="audit-stat-label">
            Total Logs
          </span>

          <strong>
            {statistics.total}
          </strong>
        </div>

        <div className="audit-stat-card">
          <span className="audit-stat-label">
            Unique Actors
          </span>

          <strong>
            {statistics.uniqueActors}
          </strong>
        </div>

        <div className="audit-stat-card">
          <span className="audit-stat-label">
            Action Types
          </span>

          <strong>
            {statistics.actionTypes}
          </strong>
        </div>
      </div>

      {/* Filters */}
      <div className="audit-filter-card">
        <div className="card-header">
          <div>
            <h2>
              Filter Logs
            </h2>

            <p>
              Search audit activity
              using the available
              filters.
            </p>
          </div>
        </div>

        <form
          onSubmit={
            handleSearch
          }
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="eventId">
                Event ID
              </label>

              <input
                id="eventId"
                type="text"
                value={eventId}
                onChange={(e) =>
                  setEventId(
                    e.target.value
                  )
                }
                placeholder="Enter event ID"
              />
            </div>

            <div className="form-group">
              <label htmlFor="action">
                Action
              </label>

              <input
                id="action"
                type="text"
                value={action}
                onChange={(e) =>
                  setAction(
                    e.target.value
                  )
                }
                placeholder="Example: CREATE_PROJECT"
              />
            </div>

            <div className="form-group">
              <label htmlFor="entityType">
                Entity Type
              </label>

              <input
                id="entityType"
                type="text"
                value={entityType}
                onChange={(e) =>
                  setEntityType(
                    e.target.value
                  )
                }
                placeholder="Example: Project"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              Apply Filters
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={
                handleClearFilters
              }
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Logs */}
      <div className="audit-content-card">
        <div className="card-header">
          <div>
            <h2>
              Activity History
            </h2>

            <p>
              {pagination.total ||
                logs.length}{" "}
              log
              {(pagination.total ||
                logs.length) ===
              1
                ? ""
                : "s"}{" "}
              found.
            </p>
          </div>
        </div>

        <AuditLogList
          logs={logs}
          loading={loading}
          error={error}
          onViewDetails={
            setSelectedLog
          }
        />

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div
            className="filter-actions"
            style={{
              justifyContent:
                "center",
              marginTop:
                "24px",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={
                handlePrevious
              }
              disabled={
                loading ||
                page <= 1
              }
            >
              Previous
            </button>

            <span
              style={{
                display:
                  "inline-flex",
                alignItems:
                  "center",
                padding:
                  "0 12px",
                fontWeight:
                  "600",
              }}
            >
              Page {page} of{" "}
              {pagination.pages}
            </span>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={
                handleNext
              }
              disabled={
                loading ||
                page >=
                  pagination.pages
              }
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedLog(null)
          }
        >
          <div
            className="modal-card audit-detail-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  Audit Log Details
                </h2>

                <p>
                  Detailed information
                  about this activity.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setSelectedLog(
                    null
                  )
                }
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="audit-detail-content">
              <div className="detail-row">
                <span>
                  Action
                </span>

                <strong>
                  {selectedLog.action ||
                    "—"}
                </strong>
              </div>

              <div className="detail-row">
                <span>
                  Description
                </span>

                <strong>
                  {selectedLog.description ||
                    "—"}
                </strong>
              </div>

              <div className="detail-row">
                <span>
                  Entity Type
                </span>

                <strong>
                  {selectedLog.entityType ||
                    "—"}
                </strong>
              </div>

              <div className="detail-row">
                <span>
                  Entity ID
                </span>

                <strong>
                  {selectedLog.entityId
                    ? String(
                        selectedLog.entityId
                      )
                    : "—"}
                </strong>
              </div>

              <div className="detail-row">
                <span>
                  Actor
                </span>

                <strong>
                  {typeof selectedLog.actor ===
                  "object"
                    ? selectedLog.actor
                        ?.name ||
                      selectedLog.actor
                        ?.email ||
                      "Unknown"
                    : selectedLog.actor ||
                      "System"}
                </strong>
              </div>

              <div className="detail-row">
                <span>
                  Date
                </span>

                <strong>
                  {selectedLog.createdAt
                    ? new Date(
                        selectedLog.createdAt
                      ).toLocaleString()
                    : "—"}
                </strong>
              </div>

              {selectedLog.ipAddress && (
                <div className="detail-row">
                  <span>
                    IP Address
                  </span>

                  <strong>
                    {
                      selectedLog.ipAddress
                    }
                  </strong>
                </div>
              )}

              {selectedLog.userAgent && (
                <div className="detail-row">
                  <span>
                    User Agent
                  </span>

                  <strong>
                    {
                      selectedLog.userAgent
                    }
                  </strong>
                </div>
              )}

              {selectedLog.metadata &&
                Object.keys(
                  selectedLog.metadata
                ).length > 0 && (
                  <div className="audit-detail-metadata">
                    <h3>
                      Metadata
                    </h3>

                    <pre>
                      {JSON.stringify(
                        selectedLog.metadata,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setSelectedLog(
                    null
                  )
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditLogs;