import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      <Link href="/" className="text-indigo-400 flex items-center gap-1 text-sm hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6 text-slate-300">
        <h1 className="text-3xl font-bold text-slate-100">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Last updated: August 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-indigo-400">1. Introduction</h2>
          <p className="text-sm leading-relaxed">
            Welcome to CareerForge. We respect your privacy and are committed to protecting any data associated with your job tracking activities, application records, and account details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-indigo-400">2. Information We Collect</h2>
          <p className="text-sm leading-relaxed">
            When you use CareerForge, we collect information necessary to provide our tracking services:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 text-slate-400">
            <li><strong>Account Information:</strong> Collected securely via authentication providers (such as Clerk) including your name and email address.</li>
            <li><strong>Application Data:</strong> Company names, position titles, job URLs, interview notes, feedback notes, and status updates that you input.</li>
            <li><strong>Artifact Links:</strong> URLs pointing to your resumes, cover letters, and target company websites that you choose to store for reference.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-indigo-400">3. How We Use Your Information</h2>
          <p className="text-sm leading-relaxed">
            Your data is used strictly to operate, maintain, and personalize your experience within CareerForge, allowing you to monitor job applications, organize notes, and view artifacts locally or via your connected database. We do not sell or share your personal data with third-party advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-indigo-400">4. Data Security</h2>
          <p className="text-sm leading-relaxed">
            We utilize secure protocols, encrypted connections (HTTPS), and trusted authentication providers to safeguard your information against unauthorized access.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-indigo-400">5. Contact Us</h2>
          <p className="text-sm leading-relaxed">
            If you have any questions about this Privacy Policy, you can reach out via your account administrator or developer repository channels.
          </p>
        </section>
      </div>
    </div>
  )
}