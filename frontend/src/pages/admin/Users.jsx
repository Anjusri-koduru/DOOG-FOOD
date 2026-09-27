import { useEffect, useState } from "react";
import userService from "../../services/userService";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await userService.getUsers();

      const userList =
        response?.data?.users ||
        response?.data ||
        response?.users ||
        [];

      setUsers(Array.isArray(userList) ? userList : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleStatusChange = async (user) => {
    try {
      setError("");

      await userService.updateUserStatus(
        user._id,
        !user.isActive
      );

      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update user status"
      );
    }
  };

  const handleRoleChange = async (user, role) => {
    if (!role || role === user.role) {
      return;
    }

    try {
      setError("");

      await userService.updateUserRole(user._id, role);

      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update user role"
      );
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="page-container">
      <div className="profile-header">
        <div>
          <p className="page-eyebrow">ADMIN</p>
          <h1>User Management</h1>
          <p className="page-description">
            Manage DOGFOOD participants, judges and organizers.
          </p>
        </div>

        <div className="user-count">
          {users.length} Users
        </div>
      </div>

      <div className="users-card">
        <div className="users-toolbar">
          <div className="search-wrapper">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or role..."
              className="user-search"
            />
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={loadUsers}
          >
            Refresh
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <h3>No users found</h3>
            <p>
              {search
                ? "Try a different search."
                : "No users are available yet."}
            </p>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>College</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info-cell">
                        <div className="user-avatar-small">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                            />
                          ) : (
                            <span>
                              {(user.name || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div>
                          <strong>
                            {user.name || "Unnamed User"}
                          </strong>

                          <span>{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <select
                        value={user.role}
                        onChange={(event) =>
                          handleRoleChange(
                            user,
                            event.target.value
                          )
                        }
                        className="role-select"
                      >
                        <option value="participant">
                          Participant
                        </option>
                        <option value="judge">Judge</option>
                        <option value="organizer">
                          Organizer
                        </option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td>
                      <span
                        className={
                          user.isActive
                            ? "status-badge status-active"
                            : "status-badge status-inactive"
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      {user.college || "—"}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={
                          user.isActive
                            ? "danger-button"
                            : "success-button"
                        }
                        onClick={() =>
                          handleStatusChange(user)
                        }
                      >
                        {user.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;