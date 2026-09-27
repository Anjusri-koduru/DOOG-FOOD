import React, { useEffect, useState } from "react";

import certificateService from "../../services/certificateService";
import CertificateCard from "../../components/certificates/CertificateCard";

function getCertificates(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.certificates)) {
    return response.certificates;
  }

  if (Array.isArray(response?.data?.certificates)) {
    return response.data.certificates;
  }

  return [];
}

function AdminCertificates() {
  const [eventId, setEventId] = useState("");

  const [certificates, setCertificates] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const loadCertificates = async () => {
    if (!eventId.trim()) {
      setError("Please enter an event ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response =
        await certificateService.getEventCertificates(
          eventId.trim()
        );

      setCertificates(getCertificates(response));
    } catch (err) {
      console.error(
        "Failed to load certificates:",
        err
      );

      setCertificates([]);

      setError(
        err?.response?.data?.message ||
          "Failed to load certificates."
      );
    } finally {
      setLoading(false);
    }
  };

  const revokeCertificate = async (
    certificate
  ) => {
    const certificateId =
      certificate?.certificateId;

    if (!certificateId) {
      setError(
        "Certificate ID is missing."
      );
      return;
    }

    const reason = window.prompt(
      "Enter reason for revoking this certificate:"
    );

    if (reason === null) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await certificateService.revokeCertificate(
        certificateId,
        {
          reason: reason.trim(),
        }
      );

      setMessage(
        "Certificate revoked successfully."
      );

      await loadCertificates();
    } catch (err) {
      console.error(
        "Failed to revoke certificate:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to revoke certificate."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container certificates-page">
      <div className="page-header">
        <div>
          <h1>Certificate Management</h1>

          <p>
            Admin certificate verification and
            management.
          </p>
        </div>
      </div>

      <div className="certificate-management-card">
        <div className="card-header">
          <div>
            <h2>Load Event Certificates</h2>

            <p>
              Enter an event ID to view its
              certificates.
            </p>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="eventId">
            Event ID
          </label>

          <input
            id="eventId"
            type="text"
            value={eventId}
            onChange={(e) =>
              setEventId(e.target.value)
            }
            placeholder="Enter event ID"
          />
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={loadCertificates}
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : "Load Certificates"}
        </button>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="certificate-management-card">
        <div className="card-header">
          <div>
            <h2>Certificates</h2>

            <p>
              {certificates.length} certificate
              {certificates.length === 1
                ? ""
                : "s"} found.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="certificate-page-state">
            <div className="loading-spinner" />
            <p>Loading certificates...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="certificate-page-state">
            <h3>No certificates found</h3>

            <p>
              Load an event to view its
              certificates.
            </p>
          </div>
        ) : (
          <div className="certificate-grid">
            {certificates.map(
              (certificate) => (
                <CertificateCard
                  key={
                    certificate._id ||
                    certificate.certificateId
                  }
                  certificate={certificate}
                  showActions
                  onRevoke={
                    revokeCertificate
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCertificates;