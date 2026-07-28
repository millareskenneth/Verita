import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SUBMISSION_COMPLIANCE_NOTE } from "@/lib/constants/legal";

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Suggest an API</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Phase 2 feature: submissions enter a private review queue and run
          through the same security pipeline before publication.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
        {SUBMISSION_COMPLIANCE_NOTE}{" "}
        <Link
          href="/terms#data-sources-and-scraping-compliance"
          className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
        >
          Read our sourcing policy
        </Link>
        .
      </div>

      <Card>
        <form className="space-y-4">
          <Input label="API name" name="name" placeholder="Open-Meteo" disabled />
          <Input
            label="Repository or documentation URL"
            name="sourceUrl"
            placeholder="https://github.com/example/api"
            disabled
          />
          <Input
            label="Why should we list it?"
            name="reason"
            placeholder="Brief use case and why it is free/open-source"
            disabled
          />
          <Button type="button" disabled>
            Submit for review (coming soon)
          </Button>
        </form>
      </Card>
    </div>
  );
}
