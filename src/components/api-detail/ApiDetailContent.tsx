"use client";

import { useState } from "react";

import { ApiOverview } from "@/components/api-detail/ApiOverview";
import { ApiIntegrationGuide } from "@/components/api-detail/ApiIntegrationGuide";
import { EndpointList } from "@/components/api-detail/EndpointList";
import { SecurityScoreBadge } from "@/components/api-detail/SecurityScoreBadge";
import { SecuritySummary } from "@/components/api-detail/SecuritySummary";
import { TrustScoreBreakdownPanel } from "@/components/api-detail/TrustScoreBreakdown";
import { TrustScoreDisclaimer } from "@/components/api-detail/TrustScoreDisclaimer";
import { ReadinessBadge } from "@/components/catalog/ReadinessBadge";
import { FadeIn } from "@/components/motion/Reveal";
import { AnimatedTabTrigger, TabPanelMotion } from "@/components/motion/TabMotion";
import { ApiTester } from "@/components/tester/ApiTester";
import { Tabs, TabsList } from "@/components/ui/shadcn/tabs";
import type { ApiCatalogEntry } from "@/types/api";
import type { TrustScoreBreakdown } from "@/types/security";

interface ApiDetailContentProps {
  api: ApiCatalogEntry;
  trustScore: TrustScoreBreakdown | null;
}

export function ApiDetailContent({ api, trustScore }: ApiDetailContentProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-5">
      <FadeIn>
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {api.category}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {api.name}
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {api.description}
            </p>
            <ReadinessBadge api={api} showHint className="mt-3" />
          </div>

          <div className="flex shrink-0 flex-row flex-wrap items-stretch gap-2">
            <SecurityScoreBadge
              score={trustScore?.overall ?? api.trustScore}
              trustLabel={trustScore?.trustLabel ?? api.trustLabel}
              inline
            />
            {trustScore ? (
              <SecuritySummary
                breakdown={trustScore}
                onViewBreakdown={() => setActiveTab("security")}
              />
            ) : null}
          </div>
        </header>
      </FadeIn>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
        <FadeIn delay={0.05}>
          <div className="border-b border-border">
            <TabsList className="flex h-auto w-full flex-wrap items-end justify-start gap-0 rounded-none bg-transparent p-0">
              <AnimatedTabTrigger value="overview" activeTab={activeTab}>
                Overview
              </AnimatedTabTrigger>
              <AnimatedTabTrigger value="endpoints" activeTab={activeTab}>
                Endpoints
              </AnimatedTabTrigger>
              <AnimatedTabTrigger value="security" activeTab={activeTab}>
                Security
              </AnimatedTabTrigger>
              <AnimatedTabTrigger value="integration" activeTab={activeTab}>
                Integration
              </AnimatedTabTrigger>
              <AnimatedTabTrigger value="try" activeTab={activeTab} accent>
                Try it now
              </AnimatedTabTrigger>
            </TabsList>
          </div>
        </FadeIn>

        <TabPanelMotion tabKey={activeTab} className="mt-6 min-w-0">
          {activeTab === "overview" ? <ApiOverview api={api} /> : null}
          {activeTab === "endpoints" ? (
            <EndpointList endpoints={api.endpoints} />
          ) : null}
          {activeTab === "security" ? (
            <div className="space-y-5">
              <TrustScoreDisclaimer />
              {trustScore ? (
                <TrustScoreBreakdownPanel breakdown={trustScore} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Security scan results are not available for this API yet.
                </p>
              )}
            </div>
          ) : null}
          {activeTab === "integration" ? <ApiIntegrationGuide api={api} /> : null}
          {activeTab === "try" ? <ApiTester api={api} layout="page" /> : null}
        </TabPanelMotion>
      </Tabs>
    </div>
  );
}
