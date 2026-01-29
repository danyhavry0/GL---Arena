"use client";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/contexts/LocaleContext";

export default function TournamentsPage() {
  const { t } = useTranslation();
  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {t("tournaments.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("tournaments.description")}
        </p>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            {t("tournaments.comingSoon")}
          </p>
          <CardDescription className="mt-2">
            {t("tournaments.phase2")}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
