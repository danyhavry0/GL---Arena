"use client";

import { Card, CardContent, CardDescription } from "@/components/ui/card";

export default function TournamentsPage() {
  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Tornei
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Visualizza e partecipa ai tornei disponibili
        </p>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            La gestione dei tornei sarà disponibile a breve.
          </p>
          <CardDescription className="mt-2">
            Questa sezione verrà implementata nella Fase 2 dello sviluppo.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
