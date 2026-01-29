"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, User, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);

        // Recupera dati aggiuntivi dalla tabella users per lo username
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("id", session.user.id)
          .single();

        if (!error && data) {
          setUserData(data);
        }
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/tournaments", label: "Tornei", icon: Trophy },
    { href: "/dashboard/profile", label: "Profilo", icon: User },
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2.5 group">
                <Trophy className="w-6 h-6 text-primary" />
                <span className="text-xl font-semibold text-foreground tracking-tight">
                  GL-Arena
                </span>
              </Link>
              <nav className="hidden gap-2 sm:flex">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className="gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <Link href="/dashboard/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <User className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {userData?.username || user.email?.split("@")[0] || "Utente"}
                  </span>
                </Link>
              ) : (
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Accedi
                  </span>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50">
          <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs text-muted-foreground">
              © 2026 GL-Arena. Piattaforma competitiva per tornei esports.
            </p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
