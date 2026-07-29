import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";
import { APP_NAME } from "@/lib/constants/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${APP_NAME}.`,
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description={`How ${APP_NAME} collects, uses, and protects information when you browse the catalog or use community features.`}
    >
      <LegalSection title="Overview">
        <p>
          {APP_NAME} is designed to minimize personal data collection. This policy
          describes what we store when you use public catalog features, community
          actions, and the admin review interface.
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Catalog browsing:</strong> standard server and application logs
            (IP address, user agent, requested paths) for security and debugging.
          </li>
          <li>
            <strong>API submissions:</strong> the API name, source URL, and optional
            notes you provide when suggesting a listing.
          </li>
          <li>
            <strong>Ratings and reports:</strong> star ratings, report reasons, and
            optional details submitted about catalog entries. These are stored without
            requiring an account.
          </li>
          <li>
            <strong>Admin access:</strong> authentication events and session tokens
            when administrators sign in to the moderation dashboard.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How we use information">
        <ul className="list-disc space-y-2 pl-5">
          <li>Operate and improve the API catalog and search experience.</li>
          <li>Run security scans and moderation workflows on submitted APIs.</li>
          <li>Investigate abuse reports and maintain catalog quality.</li>
          <li>Enforce rate limits on community actions to prevent spam.</li>
        </ul>
      </LegalSection>

      <LegalSection title="What we do not do">
        <ul className="list-disc space-y-2 pl-5">
          <li>We do not sell personal information to third parties.</li>
          <li>
            We do not require user accounts for public catalog browsing or anonymous
            ratings.
          </li>
          <li>
            We do not store upstream API response bodies from your browser-based
            tests on our servers unless a future proxy feature is explicitly enabled
            and disclosed.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Cookies and local storage">
        <p>
          The public catalog does not require tracking cookies. Admin sessions may
          store a bearer token in browser local storage after login. No third-party
          advertising trackers are used in the current MVP.
        </p>
      </LegalSection>

      <LegalSection title="Data retention">
        <p>
          Catalog metadata, scan results, and community submissions are retained to
          maintain listing history and audit moderation decisions. Server logs are
          rotated on a reasonable schedule.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You can browse the catalog without creating an account. If you submit a
          rating or report and wish to have it removed, contact the site operator
          through the channels listed on the project repository.
        </p>
      </LegalSection>

      <LegalSection title="Third-party services">
        <p>
          {APP_NAME} links to third-party APIs and source repositories. Those
          services have their own privacy policies. When you visit an upstream API
          or repository, their terms apply.
        </p>
      </LegalSection>

      <LegalSection title="Related policies">
        <p>
          See also our{" "}
          <Link href="/terms" className="font-medium text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          for trust score disclaimers and data sourcing rules.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update this privacy policy as features evolve. Material changes will
          be reflected on this page with an updated date.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
