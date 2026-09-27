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

function Certificates() {
  const [eventId, setEventId] = useState("");

  const [certificates, setCertificates] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
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
        "Failed to load event certificates:",
        err
      );

      setCertificates([]);

      setError(
        err?.response?.data?.message ||
          "Failed to load event certificates."
      );
    } finally {
      setLoading(false);
    }
  };

  const generateParticipation =
    async () => {
      if (!eventId.trim()) {
        setError("Please enter an event ID.");
        return;
      }

      try {
        setLoading(true);
        setError("");
        setMessage("");

        const response =
          await certificateService.generateParticipationCertificates(
            eventId.trim()
          );

        setMessage(
          response?.message ||
            "Participation certificates generated successfully."
        );

        await loadCertificates();
      } catch (err) {
        console.error(
          "Failed to generate participation certificates:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to generate participation certificates."
        );
      } finally {
        setLoading(false);
      }
    };

  const previewWinners = async () => {
    if (!eventId.trim()) {
      setError("Please enter an event ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response =
        await certificateService.previewWinnerCertificates(
          eventId.trim()
        );

      const preview =
        response?.data ||
        response?.projects ||
        response?.preview ||
        [];

      if (Array.isArray(preview)) {
        setMessage(
          `Winner preview loaded: ${preview.length} project(s).`
        );
      } else {
        setMessage(
          response?.message ||
            "Winner certificate preview generated."
        );
      }
    } catch (err) {
      console.error(
        "Failed to preview winners:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to preview winner certificates."
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
          <h1>Certificates</h1>

          <p>
            Generate, review and manage certificates
            for your hackathon events.
          </p>
        </div>
      </div>

      {/* Event Selection */}
      <div className="certificate-management-card">
        <div className="card-header">
          <div>
            <h2>Select Event</h2>

            <p>
              Enter the event ID to manage its
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

        <div className="certificate-management-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={loadCertificates}
            disabled={loading}
          >
            Load Certificates
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={generateParticipation}
            disabled={loading}
          >
            Generate Participation
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={previewWinners}
            disabled={loading}
          >
            Preview Winners
          </button>
        </div>
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

      {/* Certificates */}
      <div className="certificate-management-card">
        <div className="card-header">
          <div>
            <h2>Event Certificates</h2>

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
            <p>Loading...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="certificate-page-state">
            <h3>No certificates loaded</h3>

            <p>
              Enter an event ID and load its
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

export default Certificates;