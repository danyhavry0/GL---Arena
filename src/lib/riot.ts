const defaultRegion = "euw1";

type RegionalRoute = "europe" | "americas" | "asia-pacific" | "sea";

function getRegionalRoute(region: string): RegionalRoute {
  const r = region.toLowerCase();

  if (["euw1", "eune1", "ru", "tr1", "me1"].includes(r)) return "europe";
  if (["na1", "br1", "la1", "la2"].includes(r)) return "americas";
  if (["kr", "jp1"].includes(r)) return "asia-pacific";
  if (["sg2", "ph2", "th2", "vn2"].includes(r)) return "sea";

  // Default fallback for unknown platforms: europe
  return "europe";
}

export type RiotSummonerProfile = {
  puuid: string;
  summonerId: string;
  summonerName: string; // Riot gameName
  tagLine: string;
  summonerLevel: number;
  profileIconId: number;
  revisionDate: number;
};

export async function getSummonerByName(
  gameName: string,
  tagLine: string,
  region: string = defaultRegion
): Promise<RiotSummonerProfile> {
  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    throw new Error("Missing RIOT_API_KEY environment variable.");
  }

  const regionalRoute = getRegionalRoute(region);

  // STEP 1: Riot Account-V1 → get PUUID from Riot ID (gameName#tagLine)
  const accountRes = await fetch(
    `https://${regionalRoute}.api.riotgames.com/riot/account/v1/accounts/by-game-name/${encodeURIComponent(
      gameName
    )}/${encodeURIComponent(tagLine)}`,
    {
      method: "GET",
      headers: {
        "X-Riot-Token": apiKey,
      },
      cache: "no-store",
    }
  );

  if (!accountRes.ok) {
    if (accountRes.status === 404) {
      const error = new Error("Summoner not found");
      // @ts-expect-error add status for upstream handling
      error.status = 404;
      throw error;
    }
    throw new Error(`Riot Account API error: ${accountRes.status}`);
  }

  const accountJson = (await accountRes.json()) as {
    puuid: string;
    gameName: string;
    tagLine: string;
  };

  if (!accountJson?.puuid) {
    const error = new Error("Summoner not found");
    // @ts-expect-error add status for upstream handling
    error.status = 404;
    throw error;
  }

  const puuid = accountJson.puuid;

  // STEP 2: Summoner-V4 by PUUID → get LoL profile data
  const summonerRes = await fetch(
    `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(
      puuid
    )}`,
    {
      method: "GET",
      headers: {
        "X-Riot-Token": apiKey,
      },
      cache: "no-store",
    }
  );

  if (!summonerRes.ok) {
    if (summonerRes.status === 404) {
      const error = new Error("Summoner not found");
      // @ts-expect-error add status for upstream handling
      error.status = 404;
      throw error;
    }
    throw new Error(`Riot Summoner API error: ${summonerRes.status}`);
  }

  const summonerJson = (await summonerRes.json()) as {
    id: string;
    accountId: string;
    puuid: string;
    name: string;
    profileIconId: number;
    revisionDate: number;
    summonerLevel: number;
  };

  return {
    puuid,
    summonerId: summonerJson.id,
    summonerName: accountJson.gameName,
    tagLine: accountJson.tagLine,
    summonerLevel: summonerJson.summonerLevel,
    profileIconId: summonerJson.profileIconId,
    revisionDate: summonerJson.revisionDate,
  };
}

