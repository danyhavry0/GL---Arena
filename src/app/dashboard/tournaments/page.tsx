"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Trophy,
  Calendar,
  Euro,
  Users,
  Swords,
  Target,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/LocaleContext";
import {
  fetchTournaments,
  fetchTournamentWithTeams,
  fetchMatchesByTournament,
} from "@/lib/data";
import type { Tournament } from "@/lib/data";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  open_registration: "Open Registration",
  in_progress: "In Progress",
  completed: "Completed",
};

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  open_registration: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  in_progress: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
};

export default function TournamentsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("t");

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const tours = await fetchTournaments(20);
      setTournaments(tours);
      if (selectedId) {
        const tour = await fetchTournamentWithTeams(selectedId);
        setSelectedTournament(tour);
        if (tour) {
          const m = await fetchMatchesByTournament(tour.id);
          setMatches(m);
        }
      } else {
        setSelectedTournament(null);
        setMatches([]);
      }
      setLoading(false);
    };
    load();
  }, [selectedId]);

  const handleSelectTournament = (id: string) => {
    router.push(`/dashboard/tournaments?t=${id}`);
  };

  if (loading && !tournaments.length) {
    return (
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8 min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <Trophy className="w-8 h-8 text-cyan-400" />
          {t("tournaments.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("tournaments.description")}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Tournament list */}
        <div className="lg:col-span-1">
          <Card className="bg-card/80 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-300">All Tournaments</CardTitle>
              <CardDescription>Select a tournament for details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {tournaments.map((tournament) => (
                  <button
                    key={tournament.id}
                    onClick={() => handleSelectTournament(tournament.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedId === tournament.id
                        ? "border-cyan-500 bg-cyan-500/10"
                        : "border-transparent hover:border-cyan-500/50 hover:bg-cyan-500/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{tournament.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(tournament.start_date || 0).toLocaleDateString()} •{" "}
                          {(tournament.teams_count ?? 0)}/{tournament.max_teams} teams
                        </p>
                      </div>
                      <Badge
                        className={`text-[9px] shrink-0 ${
                          statusColors[tournament.status] ?? "bg-muted"
                        }`}
                      >
                        {statusLabels[tournament.status] ?? tournament.status}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tournament details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTournament ? (
            <>
              <motion.div
                key={selectedTournament.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="bg-gradient-to-br from-cyan-500/10 to-violet-500/5 border-cyan-500/30">
                  <CardHeader>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-2xl text-cyan-300">
                            {selectedTournament.name}
                          </CardTitle>
                          <Badge
                            className={
                              statusColors[selectedTournament.status] ?? "bg-muted"
                            }
                          >
                            {statusLabels[selectedTournament.status] ??
                              selectedTournament.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-base text-cyan-200/70">
                          {selectedTournament.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-6 pt-4 text-sm">
                      <span className="flex items-center gap-2 text-cyan-300">
                        <Calendar className="w-4 h-4" />
                        {selectedTournament.start_date
                          ? new Date(selectedTournament.start_date).toLocaleDateString()
                          : "-"}{" "}
                        →{" "}
                        {selectedTournament.end_date
                          ? new Date(selectedTournament.end_date).toLocaleDateString()
                          : "-"}
                      </span>
                      <span className="flex items-center gap-2 text-cyan-300">
                        <Users className="w-4 h-4" />
                        {(selectedTournament.teams?.length ?? 0)}/{selectedTournament.max_teams}{" "}
                        teams
                      </span>
                      {selectedTournament.prize_pool && (
                        <span className="flex items-center gap-2 text-amber-400">
                          <Euro className="w-4 h-4" />
                          €{selectedTournament.prize_pool} prize pool
                        </span>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                {/* Teams */}
                <Card className="border-violet-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-violet-400" />
                      Teams
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(selectedTournament.teams || []).map((team: any) => (
                        <div
                          key={team.id}
                          className="p-4 rounded-lg bg-muted/30 border border-violet-500/20"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-violet-300">{team.name}</span>
                            <Badge
                              className={
                                team.status === "winner"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : team.status === "eliminated"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-emerald-500/20 text-emerald-400"
                              }
                            >
                              {team.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Seed {team.seed ?? "-"} • {team.members_count ?? 0}/5 members
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Matches */}
                {matches.length > 0 && (
                  <Card className="border-amber-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Swords className="w-5 h-5 text-amber-400" />
                        Matches
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {matches.map((match: any) => (
                          <div
                            key={match.id}
                            className="p-4 rounded-lg bg-muted/30 border border-amber-500/20"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div className="flex items-center gap-4">
                                <span className="font-medium text-foreground">
                                  {match.team1?.name ?? "TBD"} vs {match.team2?.name ?? "TBD"}
                                </span>
                                {match.winner && (
                                  <Badge className="bg-emerald-500/20 text-emerald-400">
                                    Winner: {match.winner.name}
                                  </Badge>
                                )}
                              </div>
                              <Badge
                                className={
                                  match.status === "disputed"
                                    ? "bg-red-500/20 text-red-400"
                                    : match.status === "completed"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-amber-500/20 text-amber-400"
                                }
                              >
                                {match.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              {match.scheduled_time
                                ? new Date(match.scheduled_time).toLocaleString()
                                : "TBD"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </>
          ) : (
            <Card className="border-cyan-500/20">
              <CardContent className="py-24 text-center">
                <Target className="w-16 h-16 text-cyan-500/30 mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Select a tournament from the list
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click on a tournament to view teams and matches
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
