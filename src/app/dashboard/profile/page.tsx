"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!error && data) {
          setUserData(data);
          setUsername(data.username || "");
          setFullName(data.full_name || "");
          setAvatarUrl(data.avatar_url || "");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("Invalid session");
        return;
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({
          username: username || null,
          full_name: fullName || null,
          avatar_url: avatarUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess("Profile updated successfully!");
        // Aggiorna i dati locali
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (data) {
          setUserData(data);
        }
      }
    } catch (err) {
      setError("Error updating profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="text-sm text-muted-foreground">
              Loading...
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          User Profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your account information
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="mt-1 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Email cannot be modified
            </p>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-foreground">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="username"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Full Name"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-foreground">
              Avatar URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="https://example.com/avatar.png"
            />
            {avatarUrl && (
              <div className="mt-2">
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="h-20 w-20 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/50 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-success/10 border border-success/50 p-3 text-sm text-success">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              variant="default"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
        </CardContent>
      </Card>

      {/* Account Info */}
      {userData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-foreground">
                  Member since:
                </span>{" "}
                <span className="text-muted-foreground">
                  {userData.created_at
                    ? new Date(userData.created_at).toLocaleDateString("it-IT")
                    : "N/A"}
                </span>
              </div>
              {userData.is_admin && (
                <div className="rounded-md bg-primary/10 border border-primary/50 p-2 text-sm text-primary">
                  ⚡ Administrator Account
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
        </div>
      )}
    </ProtectedRoute>
  );
}
