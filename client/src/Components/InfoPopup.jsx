import { useState, useContext, useEffect } from "react";
import { appContext } from "../App";
import api from "../api";
import "./InfoPopup.css";

function Row({ label, fieldKey, editing, draft, view, onDraftChange }) {
  return (
    <div className="ip-row">
      <span className="ip-label">{label}</span>
      {editing ? (
        <input
          className="ip-input"
          value={draft[fieldKey] ?? ""}
          onChange={e => onDraftChange(fieldKey, e.target.value)}
        />
      ) : (
        <span className="ip-value">
          {view[fieldKey] !== "" && view[fieldKey] != null ? view[fieldKey] : <span className="ip-empty">—</span>}
        </span>
      )}
    </div>
  );
}

function normalize(u) {
  return {
    name:         u.name                              ?? "",
    email:        u.email                             ?? "",
    phoneNumber:  u.phone        ?? u.phoneNumber     ?? "",
    street:       u.street       ?? u.address?.street ?? "",
    city:         u.city         ?? u.address?.city   ?? "",
    zipcode:      u.zipcode                           ?? "",
    house_number: u.house_number ?? u.houseNumber     ?? "",
    username:     u.username                          ?? "",
  };
}

export default function InfoPopup({ onClose }) {
  const { userId } = useContext(appContext);
  const stored = JSON.parse(sessionStorage.getItem("current-user")) || {};
  const effectiveId = userId || stored.userId;

  const [view,    setView]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState({});
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!effectiveId) { setLoading(false); return; }
    api.get(`/api/users/${effectiveId}`)
      .then(res => setView(normalize(res.data)))
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, [effectiveId]);

  const [credOpen,   setCredOpen]   = useState(false);
  const [cred,       setCred]       = useState({ currentPassword: "", newUsername: "", newPassword: "", confirmPassword: "" });
  const [credError,  setCredError]  = useState(null);
  const [credSaving, setCredSaving] = useState(false);

  function startEdit() {
    setDraft({ ...view });
    setEditing(true);
    setError(null);
  }

  async function saveProfile() {
    if (!effectiveId) { setError("Session error — please log in again."); return; }
    setSaving(true);
    setError(null);
    try {
      console.log("saveProfile - draft being sent:", JSON.stringify(draft));
      const res = await api.put(`/api/users/${effectiveId}/profile`, draft);
      const updated = normalize(res.data);
      setView(updated);
      const session = JSON.parse(sessionStorage.getItem("current-user")) || {};
      sessionStorage.setItem("current-user", JSON.stringify({ ...session, name: updated.name }));
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function saveCredentials() {
    if (!cred.currentPassword) { setCredError("Current password is required."); return; }
    if (cred.newPassword && cred.newPassword !== cred.confirmPassword) {
      setCredError("New passwords don't match."); return;
    }
    if (!effectiveId) { setCredError("Session error — please log in again."); return; }
    setCredSaving(true);
    setCredError(null);
    try {
      await api.put(`/api/users/${effectiveId}/credentials`, {
        currentPassword: cred.currentPassword,
        newUsername:     cred.newUsername  || undefined,
        newPassword:     cred.newPassword  || undefined,
      });
      if (cred.newUsername) {
        setView(v => ({ ...v, username: cred.newUsername }));
      }
      setCredOpen(false);
      setCred({ currentPassword: "", newUsername: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setCredError(err.response?.data?.message || "Failed to update. Try again.");
    } finally {
      setCredSaving(false);
    }
  }

  function handleDraftChange(key, val) {
    setDraft(d => ({ ...d, [key]: val }));
  }

  if (loading || !view) {
    return (
      <div className="ip-overlay" onMouseDown={onClose}>
        <div className="ip-modal" onMouseDown={e => e.stopPropagation()}>
          <div style={{ padding: "2rem", textAlign: "center", color: loading ? "var(--text-muted)" : "var(--red)" }}>
            {loading ? "Loading…" : (error || "Could not load profile.")}
          </div>
        </div>
      </div>
    );
  }

  const initials = (view.name || "?")[0].toUpperCase();

  return (
    <div className="ip-overlay" onMouseDown={onClose}>
      <div className="ip-modal" onMouseDown={e => e.stopPropagation()}>

        <div className="ip-header">
          <div className="ip-header-left">
            <div className="ip-avatar">{initials}</div>
            <div>
              <div className="ip-header-name">{view.name || "User"}</div>
              <div className="ip-header-email">{view.email}</div>
            </div>
          </div>
          <button className="ip-close" onClick={onClose} title="Close">✕</button>
        </div>

        <div className="ip-body">

          {/* Personal Info */}
          <div className="ip-section">
            <div className="ip-section-head">
              <span className="ip-section-label">Personal Information</span>
              {!editing && (
                <button className="ip-edit-btn" onClick={startEdit}>Edit</button>
              )}
            </div>
            <Row label="Full Name"    fieldKey="name"        editing={editing} draft={draft} view={view} onDraftChange={handleDraftChange} />
            <Row label="Username"     fieldKey="username"    editing={editing} draft={draft} view={view} onDraftChange={handleDraftChange} />
            <Row label="Email"        fieldKey="email"       editing={false}   draft={draft} view={view} onDraftChange={handleDraftChange} />
            <Row label="Phone Number" fieldKey="phoneNumber" editing={editing} draft={draft} view={view} onDraftChange={handleDraftChange} />
            <Row label="Street"     fieldKey="street"       editing={editing} draft={draft} view={view} onDraftChange={handleDraftChange} />
            <Row label="City"       fieldKey="city"         editing={editing} draft={draft} view={view} onDraftChange={handleDraftChange} />
            <Row label="Zip Code"   fieldKey="zipcode"      editing={editing} draft={draft} view={view} onDraftChange={handleDraftChange} />
            <Row label="House No."  fieldKey="house_number" editing={editing} draft={draft} view={view} onDraftChange={handleDraftChange} />
            {editing && (
              <div className="ip-action-row">
                {error && <p className="ip-error">{error}</p>}
                <div className="ip-btns">
                  <button className="ip-btn-primary" onClick={saveProfile} disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                  <button className="ip-btn-ghost" onClick={() => { setEditing(false); setError(null); }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="ip-divider" />

          {/* Account */}
          <div className="ip-section">
            <div className="ip-section-head">
              <span className="ip-section-label">Account</span>
              {!credOpen && (
                <button className="ip-edit-btn" onClick={() => setCredOpen(true)}>Change</button>
              )}
            </div>
            <div className="ip-row">
              <span className="ip-label">Password</span>
              <span className="ip-value ip-dots">••••••••</span>
            </div>

            {credOpen && (
              <div className="ip-cred-box">
                <p className="ip-cred-hint">Enter your current password to make changes.</p>
                <div className="ip-cred-field">
                  <label>Current Password *</label>
                  <input type="password" value={cred.currentPassword}
                    onChange={e => setCred(c => ({ ...c, currentPassword: e.target.value }))} />
                </div>
                <div className="ip-cred-field">
                  <label>New Password (optional)</label>
                  <input type="password" value={cred.newPassword}
                    onChange={e => setCred(c => ({ ...c, newPassword: e.target.value }))} />
                </div>
                <div className="ip-cred-field">
                  <label>Confirm New Password</label>
                  <input type="password" value={cred.confirmPassword}
                    onChange={e => setCred(c => ({ ...c, confirmPassword: e.target.value }))} />
                </div>
                <div className="ip-action-row">
                  {credError && <p className="ip-error">{credError}</p>}
                  <div className="ip-btns">
                    <button className="ip-btn-primary" onClick={saveCredentials} disabled={credSaving}>
                      {credSaving ? "Updating…" : "Update Account"}
                    </button>
                    <button className="ip-btn-ghost" onClick={() => {
                      setCredOpen(false);
                      setCredError(null);
                      setCred({ currentPassword: "", newUsername: "", newPassword: "", confirmPassword: "" });
                    }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
