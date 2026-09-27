import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import userService from "../../services/userService";

function MyProfile() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    college: "",
    skills: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await userService.getMyProfile();

      const profile =
        response?.data?.user ||
        response?.data ||
        response?.user ||
        user ||
        {};

      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        college: profile.college || "",
        skills: Array.isArray(profile.skills)
          ? profile.skills.join(", ")
          : profile.skills || "",
        avatar: profile.avatar || "",
      });

      if (profile._id || profile.id) {
        updateUser(profile);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        college: formData.college.trim(),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        avatar: formData.avatar.trim(),
      };

      const response = await userService.updateMyProfile(payload);

      const updatedUser =
        response?.data?.user ||
        response?.data ||
        response?.user ||
        null;

      if (updatedUser) {
        updateUser(updatedUser);
      }

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="profile-card">
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="profile-header">
        <div>
          <p className="page-eyebrow">ACCOUNT</p>
          <h1>My Profile</h1>
          <p className="page-description">
            View and update your DOGFOOD profile information.
          </p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Profile Preview */}
        <div className="profile-card profile-preview-card">
          <div className="profile-avatar">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt={formData.name || "Profile"}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span>
                {(formData.name || "U").charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <h2>{formData.name || "Your Name"}</h2>

          <p className="profile-email">
            {user?.email || "No email"}
          </p>

          <span className="role-badge">
            {user?.role || "participant"}
          </span>

          {formData.college && (
            <p className="profile-college">
              🎓 {formData.college}
            </p>
          )}

          {formData.bio && (
            <p className="profile-bio">{formData.bio}</p>
          )}
        </div>

        {/* Edit Profile */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Edit Profile</h2>
            <p>Update your personal information.</p>
          </div>

          {error && <div className="form-error">{error}</div>}

          {success && (
            <div className="form-success">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                value={user?.email || ""}
                disabled
              />

              <small>
                Email cannot be changed from this page.
              </small>
            </div>

            <div className="form-group">
              <label>Role</label>

              <input
                type="text"
                value={user?.role || "participant"}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="college">College</label>

              <input
                id="college"
                name="college"
                type="text"
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter your college name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="skills">Skills</label>

              <input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, Python"
              />

              <small>
                Separate multiple skills with commas.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="avatar">Avatar URL</label>

              <input
                id="avatar"
                name="avatar"
                type="url"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>

              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us something about yourself..."
                rows="5"
                maxLength="500"
              />
            </div>

            <button
              type="submit"
              className="auth-submit profile-save-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;