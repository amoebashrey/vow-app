import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-block text-[10px] font-semibold uppercase tracking-widest text-zinc-500 hover:text-zinc-300"
        >
          &larr; Back to Dashboard
        </Link>

        <h1 className="mb-2 text-4xl font-black uppercase tracking-tight">
          Privacy Policy.
        </h1>
        <p className="mb-10 text-sm text-zinc-500">Last updated: March 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-2xl font-black uppercase">
              Information We Collect
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              VOW collects the minimum information necessary to provide the
              service. This includes your email address (used for authentication
              and partner notifications) and contract data you create within the
              app (commitments, deadlines, penalty amounts, and partner email
              addresses).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black uppercase">
              How We Use Your Information
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Your information is used solely to provide and operate the VOW
              service — creating contracts, notifying partners, and tracking
              contract status. We do not sell your data. We do not use your data
              for advertising. We do not train AI models on your data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black uppercase">
              Data Storage
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Your data is stored in a PostgreSQL database managed by Supabase,
              hosted in the United States. All data is encrypted in transit
              (TLS) and at rest. Authentication is handled by Supabase Auth with
              industry-standard security practices.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black uppercase">
              Data Sharing
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              We do not sell, rent, or share your personal information with third
              parties. Your contract data is only visible to you and the partner
              you explicitly invite to a contract.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black uppercase">
              Account Deletion
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              You can delete your account and all associated data at any time
              from the Profile page. Account deletion is immediate and
              permanent. All contracts, participation records, and profile data
              are removed.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black uppercase">Contact</h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              For privacy-related questions or concerns, contact us at{" "}
              <a
                href="mailto:privacy@vow-app.com"
                className="text-zinc-300 underline hover:text-white"
              >
                privacy@vow-app.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-black uppercase">
              Children&apos;s Privacy
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              VOW is not intended for users under the age of 13. We do not
              knowingly collect personal information from children. If you
              believe a child under 13 has provided us with personal
              information, please contact us and we will promptly delete it.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
