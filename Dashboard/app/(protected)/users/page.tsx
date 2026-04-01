"use client";

import { useEffect, useState } from "react";

import { getUsers } from "@/lib/api";
import type { AuthUser } from "@/lib/types";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";

export default function UsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers().then(setUsers).catch((err) => setError(err.message));
  }, []);

  return (
    <Panel title="Users & roles" subtitle="Staff and super admin visibility from the live accounts system.">
      {error ? <EmptyState title="Users unavailable" message={error} /> : null}
      {!error && users.length === 0 ? <EmptyState title="No users found" message="Create staff users from Django Admin or the backend user layer." /> : null}
      <div className="table-shell">
        {users.map((user) => (
          <article key={user.id} className="table-row">
            <div>
              <strong>{user.display_name}</strong>
              <p>{user.email}</p>
            </div>
            <span>{user.role}</span>
            <span>{user.is_staff ? "Staff" : "Standard"}</span>
            <span>{user.is_active ? "Active" : "Disabled"}</span>
          </article>
        ))}
      </div>
    </Panel>
  );
}
