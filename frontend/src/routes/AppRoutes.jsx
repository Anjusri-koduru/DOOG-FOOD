import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import useAuth from "../hooks/useAuth";

/* =========================
   AUTH PAGES
========================= */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

/* =========================
   PUBLIC PAGES
========================= */
import Home from "../pages/public/Home";
import Events from "../pages/public/Events";
import EventDetails from "../pages/public/EventDetails";
import VerifyCertificate from "../pages/public/VerifyCertificate";

/* =========================
   PARTICIPANT PAGES
========================= */
import ParticipantDashboard from "../pages/participant/Dashboard";
import MyProfile from "../pages/participant/MyProfile";
import MyTeams from "../pages/participant/MyTeams";
import TeamDetails from "../pages/participant/TeamDetails";

import MyProjects from "../pages/participant/MyProjects";
import CreateProject from "../pages/participant/CreateProject";
import EditProject from "../pages/participant/EditProject";
import ParticipantProjectDetails from "../pages/participant/ProjectDetails";

import MyVotes from "../pages/participant/MyVotes";
import MyCertificates from "../pages/participant/MyCertificates";

/* =========================
   JUDGE PAGES
========================= */
import JudgeDashboard from "../pages/judge/Dashboard";
import MyAssignments from "../pages/judge/MyAssignments";
import AssignmentDetails from "../pages/judge/AssignmentDetails";
import EvaluateProject from "../pages/judge/EvaluateProject";
import MyScores from "../pages/judge/MyScores";

/* =========================
   ORGANIZER PAGES
========================= */
import OrganizerDashboard from "../pages/organizer/Dashboard";
import CreateEvent from "../pages/organizer/CreateEvent";
import ManageEvents from "../pages/organizer/ManageEvents";
import EventManagement from "../pages/organizer/EventManagement";
import ManageTracks from "../pages/organizer/ManageTracks";
import ManagePrizes from "../pages/organizer/ManagePrizes";
import ManageTeams from "../pages/organizer/ManageTeams";
import ManageProjects from "../pages/organizer/ManageProjects";
import ManageJudges from "../pages/organizer/ManageJudges";
import ManageRubrics from "../pages/organizer/ManageRubrics";
import Scores from "../pages/organizer/Scores";
import Normalization from "../pages/organizer/Normalization";
import VotingResults from "../pages/organizer/VotingResults";
import AuditLogs from "../pages/organizer/AuditLogs";
import Certificates from "../pages/organizer/Certificates";

/* =========================
   ADMIN PAGES
========================= */
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminEvents from "../pages/admin/Events";
import AdminJudges from "../pages/admin/Judges";
import AdminProjects from "../pages/admin/Projects";
import AdminAuditLogs from "../pages/admin/AuditLogs";
import AdminCertificates from "../pages/admin/Certificates";


/* =========================================================
   ROLE BASED DASHBOARD
========================================================= */

function RoleBasedDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  const role = user?.role;

  if (role === "judge") {
    return <JudgeDashboard />;
  }

  if (role === "organizer") {
    return <OrganizerDashboard />;
  }

  if (role === "admin") {
    return <AdminDashboard />;
  }

  return <ParticipantDashboard />;
}


/* =========================================================
   APP ROUTES
========================================================= */

function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ====================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/events"
        element={<Events />}
      />

      <Route
        path="/events/:eventId"
        element={<EventDetails />}
      />

      <Route
        path="/verify-certificate"
        element={<VerifyCertificate />}
      />


      {/* =====================================================
          AUTH ROUTES
      ====================================================== */}

      <Route element={<AuthLayout />}>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

      </Route>


      {/* =====================================================
          PROTECTED ROUTES
      ====================================================== */}

      <Route element={<ProtectedRoute />}>

        <Route element={<MainLayout />}>

          {/* =================================================
              ROLE BASED DASHBOARD
          ================================================= */}

          <Route
            path="/dashboard"
            element={
              <RoleRoute
                allowedRoles={[
                  "participant",
                  "judge",
                  "organizer",
                  "admin",
                ]}
              >
                <RoleBasedDashboard />
              </RoleRoute>
            }
          />


          {/* =================================================
              PROFILE
          ================================================= */}

          <Route
            path="/profile"
            element={<MyProfile />}
          />


          {/* =================================================
              PARTICIPANT - TEAMS
          ================================================= */}

          <Route
            path="/my-teams"
            element={
              <RoleRoute allowedRoles={["participant"]}>
                <MyTeams />
              </RoleRoute>
            }
          />

          <Route
            path="/teams/:teamId"
            element={
              <RoleRoute allowedRoles={["participant"]}>
                <TeamDetails />
              </RoleRoute>
            }
          />


          {/* =================================================
              PARTICIPANT - PROJECTS
          ================================================= */}

          <Route
            path="/my-projects"
            element={
              <RoleRoute allowedRoles={["participant"]}>
                <MyProjects />
              </RoleRoute>
            }
          />

          <Route
            path="/projects/create"
            element={
              <RoleRoute allowedRoles={["participant"]}>
                <CreateProject />
              </RoleRoute>
            }
          />

          <Route
            path="/projects/:projectId"
            element={
              <RoleRoute
                allowedRoles={[
                  "participant",
                  "judge",
                  "organizer",
                  "admin",
                ]}
              >
                <ParticipantProjectDetails />
              </RoleRoute>
            }
          />

          <Route
            path="/projects/:projectId/edit"
            element={
              <RoleRoute allowedRoles={["participant"]}>
                <EditProject />
              </RoleRoute>
            }
          />


          {/* =================================================
              PARTICIPANT - VOTES
          ================================================= */}

          <Route
            path="/my-votes"
            element={
              <RoleRoute allowedRoles={["participant"]}>
                <MyVotes />
              </RoleRoute>
            }
          />


          {/* =================================================
              PARTICIPANT - CERTIFICATES
          ================================================= */}

          <Route
            path="/my-certificates"
            element={
              <RoleRoute allowedRoles={["participant"]}>
                <MyCertificates />
              </RoleRoute>
            }
          />


          {/* =================================================
              JUDGE
          ================================================= */}

          <Route
            path="/judge/dashboard"
            element={
              <RoleRoute allowedRoles={["judge"]}>
                <JudgeDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/judge/assignments"
            element={
              <RoleRoute allowedRoles={["judge"]}>
                <MyAssignments />
              </RoleRoute>
            }
          />

          <Route
            path="/judge/assignments/:assignmentId"
            element={
              <RoleRoute allowedRoles={["judge"]}>
                <AssignmentDetails />
              </RoleRoute>
            }
          />

          <Route
            path="/judge/evaluate/:projectId"
            element={
              <RoleRoute allowedRoles={["judge"]}>
                <EvaluateProject />
              </RoleRoute>
            }
          />

          <Route
            path="/judge/scores"
            element={
              <RoleRoute allowedRoles={["judge"]}>
                <MyScores />
              </RoleRoute>
            }
          />


          {/* =================================================
              ORGANIZER
          ================================================= */}

          <Route
            path="/organizer/dashboard"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <OrganizerDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/organizer/events/create"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <CreateEvent />
              </RoleRoute>
            }
          />

          <Route
            path="/organizer/events"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <ManageEvents />
              </RoleRoute>
            }
          />

          {/* Event Management */}
          <Route
            path="/organizer/events/:eventId"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <EventManagement />
              </RoleRoute>
            }
          />

          {/* Event-specific Tracks */}
          <Route
            path="/organizer/events/:eventId/tracks"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <ManageTracks />
              </RoleRoute>
            }
          />

          {/* Event-specific Prizes */}
          <Route
            path="/organizer/events/:eventId/prizes"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <ManagePrizes />
              </RoleRoute>
            }
          />

          <Route
            path="/organizer/teams"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <ManageTeams />
              </RoleRoute>
            }
          />

          <Route
            path="/organizer/projects"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <ManageProjects />
              </RoleRoute>
            }
          />

          <Route
            path="/organizer/judges"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <ManageJudges />
              </RoleRoute>
            }
          />

          <Route
            path="/organizer/rubrics"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <ManageRubrics />
              </RoleRoute>
            }
          />

          <Route
            path="/organizer/scores"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <Scores />
              </RoleRoute>
            }
          />

          <Route
            path="/organizer/normalization"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <Normalization />
              </RoleRoute>
            }
          />

          <Route
            path="/organizer/voting"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <VotingResults />
              </RoleRoute>
            }
          />

          <Route
            path="/organizer/audit-logs"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <AuditLogs />
              </RoleRoute>
            }
          />

          <Route
            path="/organizer/certificates"
            element={
              <RoleRoute allowedRoles={["organizer", "admin"]}>
                <Certificates />
              </RoleRoute>
            }
          />


          {/* =================================================
              ADMIN
          ================================================= */}

          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/events"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminEvents />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/judges"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminJudges />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/projects"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminProjects />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/audit-logs"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminAuditLogs />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/certificates"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminCertificates />
              </RoleRoute>
            }
          />

        </Route>

      </Route>


      {/* =====================================================
          FALLBACK
      ====================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default AppRoutes;