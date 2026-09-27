import api from "./api";

const certificateService = {
  getMyCertificates: async () => {
    const response = await api.get("/certificates/my");
    return response.data;
  },

  getCertificate: async (certificateId) => {
    const response = await api.get(`/certificates/${certificateId}`);
    return response.data;
  },

  verifyCertificate: async (certificateId) => {
    const response = await api.get(
      `/certificates/verify/${encodeURIComponent(certificateId)}`
    );
    return response.data;
  },

  getEventCertificates: async (eventId) => {
    const response = await api.get(`/certificates/event/${eventId}`);
    return response.data;
  },

  generateParticipationCertificates: async (eventId) => {
    const response = await api.post(
      `/certificates/event/${eventId}/participation`
    );
    return response.data;
  },

  previewWinnerCertificates: async (eventId) => {
    const response = await api.post(
      `/certificates/event/${eventId}/winners/preview`
    );
    return response.data;
  },

  generateWinnerCertificate: async (eventId, data) => {
    const response = await api.post(
      `/certificates/event/${eventId}/winners`,
      data
    );
    return response.data;
  },

  revokeCertificate: async (certificateId, data = {}) => {
    const response = await api.patch(
      `/certificates/${certificateId}/revoke`,
      data
    );
    return response.data;
  },

  downloadCertificate: async (certificateId) => {
    const response = await api.get(
      `/certificate-downloads/${encodeURIComponent(
        certificateId
      )}/download`,
      {
        responseType: "blob",
      }
    );

    return response;
  },
};

export default certificateService;