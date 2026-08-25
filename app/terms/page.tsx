import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfUsePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      <Link href="/" className="text-indigo-400 flex items-center gap-1 text-sm hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6 text-slate-300">
        <h1 className="text-3xl font-bold text-slate-100">Terms of Use</h1>
        <p className="text-xs text-slate-500">Last updated: August 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-indigo-400">1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed">
            By accessing or using CareerForge, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the application.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-indigo-400">2. Use of Service</h2>
          <p className="text-sm leading-relaxed">
            CareerForge is designed as a personal job application tracker and workflow management tool. You agree to use the service only for lawful purposes and in a manner that does not infringe the rights of others.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-indigo-400">3. User Content & Data</h2>
          <p className="text-sm leading-relaxed">
            You retain full ownership of all data, notes, links, and documents you input into CareerForge. You are solely responsible for the accuracy and security of the content you store within your application instance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-indigo-400">4. Disclaimer of Warranties</h2>
          <p className="text-sm leading-relaxed">
            CareerForge is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied. We do not guarantee continuous, error-free operation or uninterrupted availability of third-party job board links and embedded views.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-indigo-400">5. Changes to Terms</h2>
          <p className="text-sm leading-relaxed">
            We reserve the right to modify or replace these Terms of Use at any time. Continued use of CareerForge after any changes constitutes acceptance of the new terms.
          </p>
        </section>
      </div>
    </div>
  )
}