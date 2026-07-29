import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";
import { APP_NAME } from "@/lib/constants/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${APP_NAME}.`,
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      description={`These terms govern your use of ${APP_NAME}, a free API discovery and security catalog.`}
    >
      <LegalSection title="Overview">
        <p>
          {APP_NAME} helps developers discover, document, and evaluate free and
          open-source APIs. By using this site, you agree to these terms. If you do
          not agree, please do not use the service.
        </p>
      </LegalSection>

      <LegalSection id="trust-scores" title="Trust scores and security information">
        <p>
          Trust scores, security scan results, and recommendation warnings are
          advisory only. They do not guarantee that an API is safe, free, compliant,
          or suitable for production use. {APP_NAME} cannot detect all
          vulnerabilities, misconfigurations, or upstream policy changes.
        </p>
        <p>
          You are responsible for reviewing upstream terms of service, license
          obligations, rate limits, and security requirements before integrating any
          API into your application.
        </p>
      </LegalSection>

      <LegalSection title="Catalog content and attribution">
        <p>
          Each catalog entry links to its official source repository or
          documentation. License information is provided for attribution purposes.
          {APP_NAME} does not claim ownership of third-party APIs, documentation, or
          trademarks.
        </p>
        <p>
          API providers may change pricing, authentication requirements, or terms at
          any time. {APP_NAME} attempts to monitor and reflect changes but cannot
          guarantee real-time accuracy.
        </p>
      </LegalSection>

      <LegalSection id="data-sources-and-scraping-compliance" title="Data sources and scraping compliance">
        <p>
          {APP_NAME} indexes APIs using official, ToS-compliant sources only. We do
          not scrape search engine result pages or third-party HTML in ways that
          violate provider terms of service.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Discovery uses official APIs such as GitHub REST/GraphQL and licensed
            search APIs (Google Custom Search, Bing Web Search) where configured.
          </li>
          <li>
            Documentation is parsed from public repositories and official docs linked
            by the upstream project.
          </li>
          <li>
            We do not bypass authentication, paywalls, or robots.txt restrictions
            on third-party sites.
          </li>
          <li>
            Submissions must reference a verifiable public source with a permissive
            open-source license.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="User submissions and community actions">
        <p>
          When you submit an API suggestion, rating, or report, you represent that
          the information is accurate to the best of your knowledge. Submissions
          enter a review queue and are subject to automated security scanning before
          publication.
        </p>
        <p>
          {APP_NAME} may reject, quarantine, or delist entries that fail security
          checks, violate upstream terms, or appear to misrepresent licensing or
          availability.
        </p>
      </LegalSection>

      <LegalSection title="API testing and proxy usage">
        <p>
          The built-in API tester sends requests directly from your browser to the
          upstream API unless a server-side proxy is explicitly enabled. You must
          comply with upstream rate limits and terms when testing endpoints.
        </p>
        <p>
          Any future proxy feature will be limited to evaluation and testing
          purposes, not production traffic relay.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer of warranties">
        <p>
          {APP_NAME} is provided &quot;as is&quot; without warranties of any kind,
          express or implied, including merchantability, fitness for a particular
          purpose, or non-infringement.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, {APP_NAME} and its operators are
          not liable for damages arising from your use of catalog information,
          security scores, or third-party APIs listed on this platform.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these terms from time to time. Continued use of the service
          after changes are posted constitutes acceptance of the revised terms.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
