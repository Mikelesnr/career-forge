'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Save, FileText, Globe, Edit3 } from 'lucide-react'

type Application = {
  id: string
  companyName: string
  positionTitle: string
  companyLogoUrl?: string
  companyMotto?: string
  interviewNotes?: string
  feedbackNotes?: string
  status?: string
  resumeLink?: string
  coverLetterLink?: string
  companyWebsite?: string
  jobUrl: string
}

type ApplicationsResponse = {
  applications?: Application[]
}

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const [app, setApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [interviewNotes, setInterviewNotes] = useState('')
  const [feedbackNotes, setFeedbackNotes] = useState('')
  const [status, setStatus] = useState('')
  const [resumeLink, setResumeLink] = useState('')
  const [coverLetterLink, setCoverLetterLink] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingLinks, setEditingLinks] = useState(false)

  useEffect(() => {
    fetch(`/api/applications`)
      .then(res => res.json())
      .then((data: ApplicationsResponse) => {
        const found = data.applications?.find(a => a.id === id)
        if (found) {
          setApp(found)
          setInterviewNotes(found.interviewNotes || '')
          setFeedbackNotes(found.feedbackNotes || '')
          setStatus(found.status || 'APPLIED')
          setResumeLink(found.resumeLink || '')
          setCoverLetterLink(found.coverLetterLink || '')
          setCompanyWebsite(found.companyWebsite || '')
        }
        setLoading(false)
      })
  }, [id])

  const handleUpdate = async () => {
    if (!app) return
    setSaving(true)
    const payload: Application = { ...app, interviewNotes, feedbackNotes, status, resumeLink, coverLetterLink, companyWebsite }
    await fetch(`/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setApp(payload)
    setSaving(false)
    setEditingLinks(false)
    alert('Application updated successfully!')
  }

  if (loading) return <p className="text-slate-500 p-4">Loading application details...</p>
  if (!app) return <p className="text-rose-400 p-4">Application not found.</p>

  return (
    <div className="space-y-6 pb-12">
      <Link href="/" className="text-indigo-400 flex items-center gap-1 text-sm hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          {app.companyLogoUrl ? (
            <Image src={app.companyLogoUrl} alt="" width={48} height={48} className="w-12 h-12 rounded object-cover bg-slate-800" />
          ) : (
            <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center text-slate-200 font-bold text-lg">
              {app.companyName[0]}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold">{app.companyName}</h1>
              {app.jobUrl && (
                <a href={app.jobUrl} target="_blank" rel="noreferrer" className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20 flex items-center gap-1 hover:bg-indigo-500/20 transition">
                  Job Post <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-slate-400 text-sm">{app.positionTitle}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <select value={status} onChange={e => setStatus(e.target.value)} className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm font-medium">
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEWING">Interviewing</option>
            <option value="OFFERED">Offered</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button onClick={handleUpdate} disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-1">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Edit Links Toggle Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-sm text-indigo-400 flex items-center gap-1.5">
            <Edit3 className="w-4 h-4" /> Document & Website Links
          </h2>
          <button onClick={() => setEditingLinks(!editingLinks)} className="text-xs text-indigo-400 hover:underline">
            {editingLinks ? 'Hide Editor' : 'Edit Links'}
          </button>
        </div>

        {editingLinks ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Resume / CV Link</label>
              <input type="text" value={resumeLink} onChange={e => setResumeLink(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Cover Letter Link</label>
              <input type="text" value={coverLetterLink} onChange={e => setCoverLetterLink(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Company Website Link</label>
              <input type="text" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
            <div><strong className="text-slate-300">CV:</strong> {resumeLink ? 'Attached' : 'None'}</div>
            <div><strong className="text-slate-300">Cover Letter:</strong> {coverLetterLink ? 'Attached' : 'None'}</div>
            <div><strong className="text-slate-300">Website:</strong> {companyWebsite ? 'Linked' : 'None'}</div>
          </div>
        )}
      </div>

      {/* Interview Intelligence Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-sm text-indigo-400">Interview Problems & Questions</h2>
          <textarea rows={4} value={interviewNotes} onChange={e => setInterviewNotes(e.target.value)} placeholder="Log technical questions or tests..." className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-sm text-indigo-400">Feedback Notes</h2>
          <textarea rows={4} value={feedbackNotes} onChange={e => setFeedbackNotes(e.target.value)} placeholder="Log recruiter feedback..." className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm" />
        </div>
      </div>

      {/* Responsive Iframes View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-xs text-indigo-400 flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> CV / Resume</h3>
            {resumeLink && <a href={resumeLink} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:underline flex items-center gap-1">Open <ExternalLink className="w-3 h-3" /></a>}
          </div>
          {resumeLink ? (
            <iframe src={resumeLink} className="w-full h-[400px] bg-white rounded border border-slate-800" title="Resume" />
          ) : (
            <div className="h-[400px] bg-slate-950 rounded border border-slate-800 flex items-center justify-center text-slate-500 text-xs">No resume link provided.</div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-xs text-indigo-400 flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Cover Letter</h3>
            {coverLetterLink && <a href={coverLetterLink} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:underline flex items-center gap-1">Open <ExternalLink className="w-3 h-3" /></a>}
          </div>
          {coverLetterLink ? (
            <iframe src={coverLetterLink} className="w-full h-[400px] bg-white rounded border border-slate-800" title="Cover Letter" />
          ) : (
            <div className="h-[400px] bg-slate-950 rounded border border-slate-800 flex items-center justify-center text-slate-500 text-xs">No cover letter link provided.</div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-xs text-indigo-400 flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Company Website</h3>
            {companyWebsite && <a href={companyWebsite} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:underline flex items-center gap-1">Open <ExternalLink className="w-3 h-3" /></a>}
          </div>
          {companyWebsite ? (
            <iframe src={companyWebsite} className="w-full h-[400px] bg-white rounded border border-slate-800" title="Company Website" />
          ) : (
            <div className="h-[400px] bg-slate-950 rounded border border-slate-800 flex items-center justify-center text-slate-500 text-xs">No company website provided.</div>
          )}
        </div>
      </div>
    </div>
  )
}