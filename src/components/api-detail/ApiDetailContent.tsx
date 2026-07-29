"use client";

import { useState } from "react";

import { ApiOverview } from "@/components/api-detail/ApiOverview";
import { EndpointList } from "@/components/api-detail/EndpointList";
import { SecurityScoreBadge } from "@/components/api-detail/SecurityScoreBadge";
import { SecuritySummary } from "@/components/api-detail/SecuritySummary";
import { TrustScoreBreakdownPanel } from "@/components/api-detail/TrustScoreBreakdown";
import { TrustScoreDisclaimer } from "@/components/api-detail/TrustScoreDisclaimer";
import { ApiTester } from "@/components/tester/ApiTester";
import { ApiIntegrationGuide } from "@/components/api-detail/ApiIntegrationGuide";
import { ReadinessBadge } from "@/components/catalog/ReadinessBadge";
import { FadeIn } from "@/components/motion/Reveal";
import { AnimatedTabTrigger, TabPanelMotion } from "@/components/motion/TabMotion";
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
    <div>
      <FadeIn>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {api.category}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {api.name}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {api.description}
            </p>
            <ReadinessBadge api={api} showHint className="mt-3" />
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <SecurityScoreBadge
              score={trustScore?.overall ?? api.trustScore}
              trustLabel={trustScore?.trustLabel}
              inline
            />
            {trustScore ? (
              <SecuritySummary
                breakdown={trustScore}
                onViewBreakdown={() => setActiveTab("security")}
              />
            ) : null}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.06}>
        <div className="mb-4">
          <TrustScoreDisclaimer />
        </div>
      </FadeIn>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
        <FadeIn delay={0.1}>
          <div className="mb-4 border-b border-border pb-2">
            <TabsList className="h-auto w-full justify-start rounded-none bg-transparent p-0">
              <AnimatedTabTrigger value="overview" activeTab={activeTab} className="rounded-md">
                Overview
              </AnimatedTabTrigger>
              <AnimatedTabTrigger value="endpoints" activeTab={activeTab} className="rounded-md">
                Endpoints
              </AnimatedTabTrigger>
              <AnimatedTabTrigger value="security" activeTab={activeTab} className="rounded-md">
                Security
              </AnimatedTabTrigger>
              <AnimatedTabTrigger value="integration" activeTab={activeTab} className="rounded-md">
                Integration
              </AnimatedTabTrigger>
            </TabsList>
          </div>
        </FadeIn>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
          <div className="min-w-0 flex-1">
            <TabPanelMotion tabKey={activeTab}>
              {activeTab === "overview" ? <ApiOverview api={api} /> : null}
              {activeTab === "endpoints" ? (
                <EndpointList endpoints={api.endpoints} />
              ) : null}
              {activeTab === "security" ? (
                trustScore ? (
                  <TrustScoreBreakdownPanel breakdown={trustScore} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Security scan results are not available for this API yet.
                  </p>
                )
              ) : null}
              {activeTab === "integration" ? (
                <ApiIntegrationGuide api={api} />
              ) : null}
            </TabPanelMotion>
          </div>

          <FadeIn delay={0.14} className="min-w-0 xl:w-[min(100%,26rem)] xl:shrink-0">
            <aside>
              <div className="xl:sticky xl:top-20 xl:max-h-[calc(100svh-5.5rem)] xl:overflow-y-auto">
                <ApiTester api={api} />
              </div>
            </aside>
          </FadeIn>
        </div>
      </Tabs>
    </div>
  );
}
