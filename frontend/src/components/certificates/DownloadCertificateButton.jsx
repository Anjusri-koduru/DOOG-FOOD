import { useState } from "react";
import certificateService from "../../services/certificateService";

function DownloadCertificateButton({ certificateId }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!certificateId) {
      setError("Certificate ID is missing.");
      return;
    }

    try {
      setDownloading(true);
      setError("");

      const response =
        await certificateService.downloadCertificate(certificateId);

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `DOGFOOD-Certificate-${certificateId}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Certificate download failed:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to download certificate."
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="certificate-download-wrapper">
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading ? "Downloading..." : "Download Certificate"}
      </button>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default DownloadCertificateButton;