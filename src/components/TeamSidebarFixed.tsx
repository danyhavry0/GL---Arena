"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  UserPlus,
  Settings,
  Crown,
  Copy,
  Check,
  ChevronRight,
  Shield,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { fetchUserTeams } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Team {
  id: string;
  name: string;
  tournament_id: string;
  captain_id: string;
  status: string;
  created_at: string;
  members_count?: number;
  members?: TeamMember[];
}

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  riot_summoner_name: string;
}

interface TeamSidebarFixedProps {
  userId?: string;
  isExpanded: boolean;
  onToggle: () => void;
}

// Gaming-style input
const GamingInput = ({
  icon: Icon,
  ...props
}: {
  icon?: React.ElementType;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative group">
    {Icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/60 group-focus-within:text-cyan-400 transition-colors">
        <Icon className="w-4 h-4" />
      </div>
    )}
    <input
      {...props}
      className={`
        w-full rounded-lg border-2 border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm
        px-3 py-2 text-sm text-foreground
        placeholder:text-cyan-300/40
        outline-none transition-all duration-300
        focus:border-cyan-400 focus:bg-cyan-500/10
        focus:shadow-[0_0_0_3px_hsl(190,95%,55%,0.15),0_0_20px_hsl(190,95%,55%,0.1)]
        hover:border-cyan-400/50
        ${Icon ? "pl-10" : ""}
        ${props.className ?? ""}
      `}
    />
  </div>
);

export default function TeamSidebarFixed({ userId, isExpanded, onToggle }: TeamSidebarFixedProps) {
  const [activeTab, setActiveTab] = useState<"teams" | "create" | "invite">("teams");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  // Form states
  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("ABC123");
  const [copied, setCopied] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's teams
  useEffect(() => {
    if (userId) {
      fetchTeams();
    }
  }, [userId]);

  const fetchTeams = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const userTeams = await fetchUserTeams(userId);
      setTeams(
        userTeams.map((t: any) => ({
          id: t.id,
          name: t.name,
          tournament_id: t.tournament_id,
          captain_id: t.captain_id,
          status: t.status,
          created_at: t.created_at,
          members_count: t.members_count ?? 0,
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setInviteCode(code);
      
      const newTeam: Team = {
        id: Date.now().toString(),
        name: teamName,
        tournament_id: "",
        captain_id: userId || "",
        status: "active",
        created_at: new Date().toISOString(),
        members: []
      };
      
      setTeams([...teams, newTeam]);
      setTeamName("");
      setCreateSuccess(true);
      
      setTimeout(() => {
        setCreateSuccess(false);
        setActiveTab("teams");
      }, 2000);
    } catch (err) {
      setError("Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !selectedTeam) {
      setError("Select a team and enter an email");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Inviting ${inviteEmail} to team ${selectedTeam.name}`);
      setInviteEmail("");
    } catch (err) {
      setError("Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full flex">
      {/* Toggle Button - Always visible */}
      <button
        onClick={onToggle}
        className="absolute -left-10 top-4 z-10 p-2 rounded-l-lg bg-card/90 border border-r-0 border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all group"
        title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? (
          <PanelRightClose className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
        ) : (
          <PanelRightOpen className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
        )}
      </button>

      {/* Sidebar Content */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="h-full bg-card/50 backdrop-blur-sm border-l border-cyan-500/20 overflow-hidden"
          >
            <div className="w-[320px] h-full flex flex-col">
              {/* Gradient accent */}
              <div className="h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 flex-shrink-0" />
              
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border/50 flex-shrink-0">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/30 to-teal-500/20 border border-cyan-500/40">
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-cyan-400">Team Manager</h2>
                  <p className="text-xs text-muted-foreground">Create & manage teams</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border/50 flex-shrink-0">
                {[
                  { id: "teams", label: "Teams", icon: Users },
                  { id: "create", label: "New", icon: Plus },
                  { id: "invite", label: "Invite", icon: UserPlus },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`
                      flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all
                      ${activeTab === tab.id
                        ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }
                    `}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Teams Tab */}
                {activeTab === "teams" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
                      </div>
                    ) : teams.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-cyan-500/30 mx-auto mb-3" />
                        <p className="text-sm font-medium text-foreground/80">No teams yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Create your first team</p>
                        <Button
                          onClick={() => setActiveTab("create")}
                          size="sm"
                          className="mt-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-90"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1.5" />
                          Create Team
                        </Button>
                      </div>
                    ) : (
                      teams.map((team) => (
                        <motion.div
                          key={team.id}
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/10 to-teal-500/5 border border-cyan-500/30 hover:border-cyan-400/60 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-cyan-400" />
                                <span className="font-semibold text-sm text-cyan-300">{team.name}</span>
                              </div>
                              <Badge className="text-[9px] bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                                {team.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Crown className="w-3 h-3 text-amber-400" />
                                <span>Captain</span>
                                <span className="mx-1">•</span>
                                <span>{team.members_count ?? 0}/5</span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
                              >
                                <Settings className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}

                {/* Create Team Tab */}
                {activeTab === "create" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {createSuccess ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-6"
                      >
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
                          <Check className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-bold text-emerald-400">Created!</h3>
                        <p className="text-xs text-muted-foreground mt-1">Share code with teammates</p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <code className="px-3 py-1.5 rounded-lg bg-muted font-mono text-sm tracking-wider">
                            {inviteCode}
                          </code>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handleCopyCode}
                            className="h-8 w-8 border-cyan-500/50"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <>
                        <div className="text-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-cyan-500/40 flex items-center justify-center mx-auto mb-2">
                            <Plus className="w-5 h-5 text-cyan-400" />
                          </div>
                          <h3 className="text-sm font-bold text-foreground">Create New Team</h3>
                        </div>

                        <div className="space-y-3">
                          <label className="flex flex-col gap-1.5 text-xs font-semibold">
                            Team Name
                            <GamingInput
                              icon={Shield}
                              type="text"
                              value={teamName}
                              onChange={(e) => setTeamName(e.target.value)}
                              placeholder="Enter team name"
                            />
                          </label>

                          {error && (
                            <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-2">
                              <p className="text-xs text-destructive">{error}</p>
                            </div>
                          )}

                          <Button
                            onClick={handleCreateTeam}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90 font-bold uppercase tracking-wider text-xs"
                          >
                            {loading ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-1.5" />
                                Create Team
                              </>
                            )}
                          </Button>
                        </div>

                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                          <div className="flex items-start gap-2">
                            <Crown className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-300/80">
                              You&apos;ll be the Captain with full management rights.
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Invite Members Tab */}
                {activeTab === "invite" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/30 to-rose-500/30 border border-pink-500/40 flex items-center justify-center mx-auto mb-2">
                        <UserPlus className="w-5 h-5 text-pink-400" />
                      </div>
                      <h3 className="text-sm font-bold text-foreground">Invite Members</h3>
                    </div>

                    {teams.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-xs text-muted-foreground">Create a team first</p>
                        <Button
                          onClick={() => setActiveTab("create")}
                          variant="outline"
                          size="sm"
                          className="mt-3 border-cyan-500/50 text-xs"
                        >
                          Create Team
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="flex flex-col gap-1.5 text-xs font-semibold">
                          Select Team
                          <div className="space-y-1.5">
                            {teams.map((team) => (
                              <button
                                key={team.id}
                                onClick={() => setSelectedTeam(team)}
                                className={`
                                  w-full flex items-center justify-between p-2 rounded-lg border-2 transition-all text-left text-xs
                                  ${selectedTeam?.id === team.id
                                    ? "border-pink-500 bg-pink-500/10"
                                    : "border-border hover:border-pink-500/50"
                                  }
                                `}
                              >
                                <span className="font-medium">{team.name}</span>
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedTeam?.id === team.id ? "rotate-90 text-pink-400" : ""}`} />
                              </button>
                            ))}
                          </div>
                        </label>

                        <label className="flex flex-col gap-1.5 text-xs font-semibold">
                          Email Address
                          <GamingInput
                            icon={UserPlus}
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="teammate@example.com"
                          />
                        </label>

                        {error && (
                          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-2">
                            <p className="text-xs text-destructive">{error}</p>
                          </div>
                        )}

                        <Button
                          onClick={handleInviteMember}
                          disabled={loading || !selectedTeam}
                          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 font-bold uppercase tracking-wider text-xs"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-1.5" />
                              Send Invite
                            </>
                          )}
                        </Button>

                        {selectedTeam && (
                          <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
                            <p className="text-xs font-medium text-violet-300 mb-2">Or share code:</p>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 px-2 py-1.5 rounded-lg bg-muted font-mono text-xs tracking-wider text-center">
                                {inviteCode}
                              </code>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={handleCopyCode}
                                className="h-7 w-7 border-violet-500/50"
                              >
                                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed state indicator */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-12 h-full bg-card/30 border-l border-cyan-500/10 flex flex-col items-center py-4 gap-3"
        >
          <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex-1 flex flex-col items-center gap-2 mt-2">
            {[Users, Plus, UserPlus].map((Icon, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center opacity-50"
              >
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
