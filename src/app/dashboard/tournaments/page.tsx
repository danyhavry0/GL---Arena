"use client";

import { Card, CardContent, CardDescription } from "@/components/ui/card";

export default function TournamentsPage() {
  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Tournaments
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View and participate in available tournaments
        </p>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Tournament management will be available soon.
          </p>
          <CardDescription className="mt-2">
            This section will be implemented in Phase 2 of development.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
