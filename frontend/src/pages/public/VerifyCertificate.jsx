import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import certificateService from "../../services/certificateService";
import CertificateVerification from "../../components/certificates/CertificateVerification";

function VerifyCertificate() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [certificateId, setCertificateId] =
    useState(searchParams.get("certificateId") || "");

  const [certificate, setCertificate] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const verifyCertificate = async (id) => {
    const value = String(id || "").trim();

    if (!value) {
      setCertificate(null);
      setError("Please enter a certificate ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCertificate(null);

      const response =
        await certificateService.verifyCertificate(
          value
        );

      const result =
        response?.data || response?.certificate || response;

      setCertificate(result);
    } catch (err) {
      console.error(
        "Certificate verification failed:",
        err
      );

      setCertificate(null);

      setError(
        err?.response?.data?.message ||
          "Certificate could not be verified."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id =
      searchParams.get("certificateId");

    if (id) {
      setCertificateId(id);
      verifyCertificate(id);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const value = certificateId.trim();

    if (!value) {
      setError("Please enter a certificate ID.");
      setCertificate(null);
      return;
    }

    setSearchParams({
      certificateId: value,
    });

    await verifyCertificate(value);
  };

  const handleClear = () => {
    setCertificateId("");
    setCertificate(null);
    setError("");
    setSearchParams({});
  };

  return (
    <div className="page-container verify-certificate-page">
      <div className="page-header">
        <div>
          <h1>Verify Certificate</h1>

          <p>
            Verify the authenticity and validity of a
            DOGFOOD certificate.
          </p>
        </div>
      </div>

      <div className="certificate-search-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="certificateId">
              Certificate ID
            </label>

            <input
              id="certificateId"
              type="text"
              value={certificateId}
              onChange={(e) =>
                setCertificateId(e.target.value)
              }
              placeholder="Example: DOG-2026-ABC123"
              autoComplete="off"
            />
          </div>

          <div className="certificate-search-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify Certificate"}
            </button>

            {(certificate || error) && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClear}
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {(loading || error || certificate) && (
        <div className="certificate-result">
          <CertificateVerification
            certificate={certificate}
            loading={loading}
            error={error}
          />
        </div>
      )}
    </div>
  );
}

export default VerifyCertificate;