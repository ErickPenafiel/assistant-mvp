import { QuotesTable } from "@/components/quotes/QuotesTable";

export default function QuotesPage() {
  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-muted/70 via-background to-muted p-4 md:p-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        <QuotesTable />
      </div>
    </div>
  );
}
