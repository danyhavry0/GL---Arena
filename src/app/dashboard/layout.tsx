"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, User, LayoutDashboard, Settings, LogOut, Key, Link2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/contexts/LocaleContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
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
    { href: "/dashboard", label: t("layout.navDashboard"), icon: LayoutDashboard },
    { href: "/dashboard/tournaments", label: t("layout.navTournaments"), icon: Trophy },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleChangePassword = () => {
    // TODO: Implement change password functionality
    alert("Change password functionality will be implemented soon.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
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
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
                      <User className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {userData?.username || user.email?.split("@")[0] || t("common.user")}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{t("layout.myAccount")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{t("layout.profileSettings")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/links" className="flex items-center cursor-pointer">
                        <Link2 className="mr-2 h-4 w-4" />
                        <span>{t("layout.navLinks")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleChangePassword} className="cursor-pointer">
                      <Key className="mr-2 h-4 w-4" />
                      <span>{t("layout.changePassword")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t("layout.logout")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("common.signIn")}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main Content - slightly lighter than top bar */}
        <main className="flex-1 bg-content">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50">
          <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs text-muted-foreground">
              {t("layout.footer")}
            </p>
          </div>
        </footer>
      </div>
  );
}
