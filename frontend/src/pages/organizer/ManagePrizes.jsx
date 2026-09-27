import {
  Link,
  useParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../../services/api";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function normalizeEventId(value) {
  if (!value) return null;

  const id = String(value).trim();

  if (
    !id ||
    id === "null" ||
    id === "undefined"
  ) {
    return null;
  }

  return id;
}

function ManagePrizes() {
  const { eventId: routeEventId } =
    useParams();

  const eventId =
    normalizeEventId(routeEventId);

  const [prizes, setPrizes] =
    useState([]);

  const [tracks, setTracks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [form, setForm] = useState({
    title: "",
    track: "",
    description: "",
    rank: 1,
    quantity: 1,
    amount: 0,
    currency: "INR",
    isActive: true,
  });


  useEffect(() => {
    if (!eventId) {
      setError(
        "Event ID is missing. Please open Manage Prizes from a specific event."
      );

      setLoading(false);

      return;
    }

    localStorage.setItem(
      "dogfood_current_event_id",
      eventId
    );

    loadData();
  }, [eventId]);


  const loadData = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      setError("");

      const [
        prizeResponse,
        trackResponse,
      ] = await Promise.all([
        api.get(
          `/prizes/event/${eventId}`
        ),

        api.get(
          `/tracks/event/${eventId}`
        ),
      ]);


      const prizeData =
        prizeResponse?.data?.data
          ?.prizes ||
        prizeResponse?.data?.prizes ||
        prizeResponse?.data?.data ||
        prizeResponse?.data ||
        [];


      const trackData =
        trackResponse?.data?.data
          ?.tracks ||
        trackResponse?.data?.tracks ||
        trackResponse?.data?.data ||
        trackResponse?.data ||
        [];


      setPrizes(
        Array.isArray(prizeData)
          ? prizeData
          : []
      );


      setTracks(
        Array.isArray(trackData)
          ? trackData
          : []
      );

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load prizes."
      );
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!eventId) {
      setError("Event ID is missing.");
      return;
    }

    if (!form.title.trim()) {
      setError(
        "Prize title is required."
      );

      return;
    }


    try {
      setSaving(true);
      setError("");
      setSuccess("");


      await api.post("/prizes", {
        event: eventId,

        title:
          form.title.trim(),

        track:
          form.track || null,

        description:
          form.description.trim(),

        rank:
          Number(form.rank),

        quantity:
          Number(form.quantity),

        amount:
          Number(form.amount),

        currency:
          form.currency,

        isActive:
          form.isActive,
      });


      setForm({
        title: "",
        track: "",
        description: "",
        rank: 1,
        quantity: 1,
        amount: 0,
        currency: "INR",
        isActive: true,
      });


      setSuccess(
        "Prize created successfully."
      );


      await loadData();

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create prize."
      );
    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async (
    prizeId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this prize?"
      );

    if (!confirmed) {
      return;
    }


    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/prizes/${prizeId}`
      );


      setSuccess(
        "Prize deleted successfully."
      );


      await loadData();

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete prize."
      );
    }
  };


  if (loading) {
    return <Loader />;
  }


  return (
    <div className="page-container">

      <Link
        to={`/organizer/events/${encodeURIComponent(
          eventId || ""
        )}`}
        className="back-link"
      >
        ← Back to Event Management
      </Link>


      <div className="page-header">

        <div>

          <span className="page-label">
            EVENT MANAGEMENT
          </span>

          <h1>
            Manage Prizes
          </h1>

          <p>
            Configure prizes and awards for
            this hackathon.
          </p>

        </div>

      </div>


      {error && (
        <ErrorMessage
          message={error}
        />
      )}


      {success && (
        <div className="success-message">
          {success}
        </div>
      )}


      {!eventId ? (
        <div className="empty-state">

          <div className="empty-state-icon">
            ⚠️
          </div>

          <h2>
            Event ID missing
          </h2>

          <p>
            Please open this page from Event
            Management.
          </p>

        </div>
      ) : (
        <>

          {/* CREATE PRIZE */}

          <div className="form-card">

            <div className="card-header">

              <h2>
                Create Prize
              </h2>

              <p>
                Add a prize to the event.
              </p>

            </div>


            <form
              className="module-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label htmlFor="prize-title">
                  Prize Title *
                </label>

                <input
                  id="prize-title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: First Prize"
                  disabled={saving}
                />

              </div>


              <div className="form-group">

                <label htmlFor="prize-track">
                  Track
                </label>

                <select
                  id="prize-track"
                  name="track"
                  value={form.track}
                  onChange={handleChange}
                  disabled={saving}
                >

                  <option value="">
                    Overall Event Prize
                  </option>


                  {tracks.map((track) => (

                    <option
                      key={
                        track._id ||
                        track.id
                      }
                      value={
                        track._id ||
                        track.id
                      }
                    >
                      {track.name ||
                        track.title}
                    </option>

                  ))}

                </select>

              </div>


              <div className="form-group">

                <label htmlFor="prize-description">
                  Description
                </label>

                <textarea
                  id="prize-description"
                  name="description"
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  placeholder="Describe the prize."
                  rows="4"
                  disabled={saving}
                />

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="prize-rank">
                    Rank *
                  </label>

                  <input
                    id="prize-rank"
                    name="rank"
                    type="number"
                    min="1"
                    value={form.rank}
                    onChange={handleChange}
                    disabled={saving}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="prize-quantity">
                    Quantity *
                  </label>

                  <input
                    id="prize-quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={handleChange}
                    disabled={saving}
                  />

                </div>

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="prize-amount">
                    Amount *
                  </label>

                  <input
                    id="prize-amount"
                    name="amount"
                    type="number"
                    min="0"
                    value={form.amount}
                    onChange={handleChange}
                    disabled={saving}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="prize-currency">
                    Currency
                  </label>

                  <select
                    id="prize-currency"
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    disabled={saving}
                  >

                    <option value="INR">
                      INR - ₹
                    </option>

                    <option value="USD">
                      USD - $
                    </option>

                    <option value="EUR">
                      EUR - €
                    </option>

                    <option value="GBP">
                      GBP - £
                    </option>

                  </select>

                </div>

              </div>


              <label className="checkbox-label">

                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  disabled={saving}
                />

                Prize is active

              </label>


              <div className="form-actions">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Creating..."
                    : "Create Prize"}
                </button>

              </div>

            </form>

          </div>


          {/* PRIZE LIST */}

          <div className="dashboard-section">

            <div className="section-header">

              <h2>
                Prizes
              </h2>

              <strong>
                {prizes.length} Prizes
              </strong>

            </div>


            {prizes.length === 0 ? (

              <div className="empty-state">

                <div className="empty-state-icon">
                  🏆
                </div>

                <h3>
                  No prizes yet
                </h3>

                <p>
                  Create the first prize for
                  this event.
                </p>

              </div>

            ) : (

              <div className="card-grid">

                {prizes.map((prize) => (

                  <div
                    className="dashboard-card"
                    key={
                      prize._id ||
                      prize.id
                    }
                  >

                    <div className="dashboard-card-header">

                      <div>

                        <h3>
                          {prize.title ||
                            "Prize"}
                        </h3>

                        <p>
                          {prize.description ||
                            "No description"}
                        </p>

                      </div>

                      <span>
                        🏆
                      </span>

                    </div>


                    <p>
                      <strong>
                        Rank:
                      </strong>{" "}
                      {prize.rank || "-"}
                    </p>


                    <p>
                      <strong>
                        Quantity:
                      </strong>{" "}
                      {prize.quantity || 0}
                    </p>


                    <p>
                      <strong>
                        Amount:
                      </strong>{" "}
                      {prize.currency ||
                        "INR"}{" "}
                      {prize.amount || 0}
                    </p>


                    <div className="form-actions">

                      <span
                        className={
                          prize.isActive ===
                          false
                            ? "status-badge inactive"
                            : "status-badge active"
                        }
                      >
                        {prize.isActive ===
                        false
                          ? "Inactive"
                          : "Active"}
                      </span>


                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() =>
                          handleDelete(
                            prize._id ||
                              prize.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </>
      )}

    </div>
  );
}

export default ManagePrizes;