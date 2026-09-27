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

function MyCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await certificateService.getMyCertificates();

      setCertificates(getCertificates(response));
    } catch (err) {
      console.error(
        "Failed to load certificates:",
        err
      );

      setCertificates([]);

      setError(
        err?.response?.data?.message ||
          "Failed to load your certificates."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  return (
    <div className="page-container certificates-page">
      <div className="page-header">
        <div>
          <h1>My Certificates</h1>

          <p>
            View and verify the certificates you have
            received through DOGFOOD events.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={loadCertificates}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="certificate-page-state">
          <div className="loading-spinner" />
          <p>Loading your certificates...</p>
        </div>
      ) : error ? (
        <div className="certificate-page-state certificate-error">
          <h3>Unable to load certificates</h3>
          <p>{error}</p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={loadCertificates}
          >
            Try Again
          </button>
        </div>
      ) : certificates.length === 0 ? (
        <div className="certificate-page-state">
          <h2>No Certificates Yet</h2>

          <p>
            Your participation or achievement certificates
            will appear here once they are issued.
          </p>
        </div>
      ) : (
        <div className="certificate-grid">
          {certificates.map((certificate) => (
            <CertificateCard
              key={
                certificate._id ||
                certificate.certificateId
              }
              certificate={certificate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCertificates;