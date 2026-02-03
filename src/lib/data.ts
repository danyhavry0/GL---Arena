import { supabase } from "./supabaseClient";

// =============================================================================
// TYPES
// =============================================================================

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  game_type: string;
  format: string;
  max_teams: number;
  prize_pool: number | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  teams_count?: number;
}

export interface TournamentTeam {
  id: string;
  tournament_id: string;
  name: string;
  captain_id: string;
  seed: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  members_count?: number;
  captain?: { username: string; full_name: string };
}

export interface Match {
  id: string;
  tournament_id: string;
  round: number;
  team1_id: string;
  team2_id: string;
  scheduled_time: string | null;
  status: string;
  winner_id: string | null;
  riot_match_id: string | null;
  referee_id: string | null;
  team1?: TournamentTeam;
  team2?: TournamentTeam;
  winner?: TournamentTeam;
}

// =============================================================================
// TOURNAMENTS
// =============================================================================

export async function fetchTournaments(limit = 10): Promise<Tournament[]> {
  const { data: tournaments, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching tournaments:", error);
    return [];
  }

  if (!tournaments?.length) return [];

  const { data: teams } = await supabase
    .from("tournament_teams")
    .select("tournament_id")
    .in("tournament_id", tournaments.map((t) => t.id));

  const countMap: Record<string, number> = {};
  (teams || []).forEach((t: { tournament_id: string }) => {
    countMap[t.tournament_id] = (countMap[t.tournament_id] ?? 0) + 1;
  });

  return tournaments.map((t) => ({
    ...t,
    teams_count: countMap[t.id] ?? 0,
  }));
}

export async function fetchTournamentById(id: string) {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching tournament:", error);
    return null;
  }

  return data;
}

export async function fetchTournamentWithTeams(id: string) {
  const { data: tournament, error: tError } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (tError || !tournament) return null;

  const { data: teams, error: teamsError } = await supabase
    .from("tournament_teams")
    .select("*")
    .eq("tournament_id", id)
    .order("seed", { ascending: true });

  if (teamsError) return { ...tournament, teams: [] };

  const teamIds = (teams || []).map((t: { id: string }) => t.id);
  const { data: memberCounts } = await supabase
    .from("team_members")
    .select("team_id")
    .in("team_id", teamIds);

  const countMap: Record<string, number> = {};
  (memberCounts || []).forEach((m: { team_id: string }) => {
    countMap[m.team_id] = (countMap[m.team_id] ?? 0) + 1;
  });

  return {
    ...tournament,
    teams: (teams || []).map((t: any) => ({
      ...t,
      members_count: countMap[t.id] ?? 0,
    })),
  };
}

// =============================================================================
// TEAMS (for logged-in user)
// =============================================================================

export async function fetchUserTeams(userId: string) {
  if (!userId) return [];

  // Teams where user is captain
  const { data: captainTeams, error: capError } = await supabase
    .from("tournament_teams")
    .select("*")
    .eq("captain_id", userId);

  if (capError) {
    console.error("Error fetching captain teams:", capError);
    return [];
  }

  const teams = captainTeams || [];
  if (!teams.length) return [];

  const teamIds = teams.map((t: { id: string }) => t.id);
  const { data: members } = await supabase
    .from("team_members")
    .select("team_id")
    .in("team_id", teamIds);

  const countMap: Record<string, number> = {};
  (members || []).forEach((m: { team_id: string }) => {
    countMap[m.team_id] = (countMap[m.team_id] ?? 0) + 1;
  });

  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("id, name, status, start_date")
    .in("id", teams.map((t: { tournament_id: string }) => t.tournament_id));

  const tourMap = Object.fromEntries((tournaments || []).map((t: any) => [t.id, t]));

  return teams.map((t: any) => ({
    ...t,
    role: "captain",
    members_count: countMap[t.id] ?? 0,
    tournament: tourMap[t.tournament_id] ?? { name: "-", status: "-", start_date: null },
  }));
}

// =============================================================================
// MATCHES
// =============================================================================

export async function fetchMatchesByTournament(tournamentId: string) {
  const { data: matches, error } = await supabase
    .from("matches")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("scheduled_time", { ascending: true });

  if (error) {
    console.error("Error fetching matches:", error);
    return [];
  }

  const matchList = matches || [];
  if (!matchList.length) return matchList;

  const teamIds = new Set<string>();
  matchList.forEach((m: any) => {
    if (m.team1_id) teamIds.add(m.team1_id);
    if (m.team2_id) teamIds.add(m.team2_id);
    if (m.winner_id) teamIds.add(m.winner_id);
  });

  const { data: teams } = await supabase
    .from("tournament_teams")
    .select("id, name, status")
    .in("id", Array.from(teamIds));

  const teamMap = Object.fromEntries((teams || []).map((t: any) => [t.id, t]));

  return matchList.map((m: any) => ({
    ...m,
    team1: teamMap[m.team1_id],
    team2: teamMap[m.team2_id],
    winner: m.winner_id ? teamMap[m.winner_id] : null,
  }));
}

export async function fetchUpcomingMatches(limit = 5) {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .in("status", ["scheduled", "in_progress"])
    .order("scheduled_time", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching upcoming matches:", error);
    return [];
  }

  return data || [];
}
