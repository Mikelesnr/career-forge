'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Briefcase, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react'

type Application = {
  id: string
  companyName: string
  positionTitle: string
  companyLogoUrl?: string
  companyMotto?: string
  status: string
  createdAt: string
}

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatLog, setChatLog] = useState([{ sender: 'bot', text: 'Hi! Ask me anything about how to use this tracker or how to prep for interviews.' }])

  const [form, setForm] = useState({
    companyName: '',
    positionTitle: '',
    jobUrl: '',
    companyWebsite: '',
    companyLogoUrl: '',
    companyMotto: '',
    status: 'APPLIED',
    resumeLink: '',
    coverLetterLink: '',
  })

  const fetchApps = async (p = 1) => {
    setLoading(true)
    const res = await fetch(`/api/applications?page=${p}&limit=6`)
    const data = await res.json()
    setApplications(data.applications)
    setTotalPages(data.totalPages)
    setPage(data.page)
    setLoading(false)
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchApps(page)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [page])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ companyName: '', positionTitle: '', jobUrl: '', companyWebsite: '', companyLogoUrl: '', companyMotto: '', status: 'APPLIED', resumeLink: '', coverLetterLink: '' })
      fetchApps(1)
    }
  }

  const sendChat = async () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput
    setChatLog(prev => [...prev, { sender: 'user', text: userMsg }])
    setChatInput('')

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userMsg, context: applications }),
    })
    const data = await res.json()
    setChatLog(prev => [...prev, { sender: 'bot', text: data.reply || 'Sorry, encountered an error.' }])
  }

  return (
    <div className="space-y-8">
      {/* Add Application Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-indigo-400 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> Log New Application
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Company Name" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} required className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" />
          <input type="text" placeholder="Position Title" value={form.positionTitle} onChange={e => setForm({ ...form, positionTitle: e.target.value })} required className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" />
          <input type="url" placeholder="Job Post URL" value={form.jobUrl} onChange={e => setForm({ ...form, jobUrl: e.target.value })} required className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" />
          <input type="url" placeholder="Company Website URL" value={form.companyWebsite} onChange={e => setForm({ ...form, companyWebsite: e.target.value })} className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" />
          <input type="url" placeholder="Company Logo Image URL" value={form.companyLogoUrl} onChange={e => setForm({ ...form, companyLogoUrl: e.target.value })} className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" />
          <input type="text" placeholder="Company Motto / Tagline" value={form.companyMotto} onChange={e => setForm({ ...form, companyMotto: e.target.value })} className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" />
          <input type="url" placeholder="Resume Link (Google Drive / Dropbox)" value={form.resumeLink} onChange={e => setForm({ ...form, resumeLink: e.target.value })} className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" />
          <input type="url" placeholder="Cover Letter Link" value={form.coverLetterLink} onChange={e => setForm({ ...form, coverLetterLink: e.target.value })} className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" />
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm">
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEWING">Interviewing</option>
            <option value="OFFERED">Offered</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button type="submit" className="md:col-span-3 bg-indigo-600 hover:bg-indigo-500 transition text-white font-medium py-2 rounded text-sm">Save Application Record</button>
        </form>
      </div>

      {/* Paginated Applications List */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" /> Active Job Pipeline
        </h2>
        {loading ? (
          <p className="text-slate-500">Loading records...</p>
        ) : applications.length === 0 ? (
          <p className="text-slate-500">No records found. Submit your first application above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((app: Application) => (
              <Link key={app.id} href={`/applications/${app.id}`} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      {app.companyLogoUrl ? (
                        <Image src={app.companyLogoUrl} alt={`${app.companyName} logo`} width={32} height={32} className="w-8 h-8 rounded object-cover bg-slate-800" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                          {app.companyName[0]}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold group-hover:text-indigo-400 transition">{app.companyName}</h3>
                        <p className="text-xs text-slate-400">{app.positionTitle}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                      app.status === 'APPLIED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      app.status === 'INTERVIEWING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      app.status === 'OFFERED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  {app.companyMotto && <p className="text-xs italic text-slate-500 mb-4">&ldquo;{app.companyMotto}&rdquo;</p>}
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/60 pt-3">
                  <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                  <span className="text-indigo-400 flex items-center gap-1">Open Details &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded disabled:opacity-50 flex items-center gap-1 text-sm">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-sm text-slate-400">Page {page} of {totalPages || 1}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded disabled:opacity-50 flex items-center gap-1 text-sm">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Gemini Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button onClick={() => setChatOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition">
            <MessageSquare className="w-6 h-6" />
          </button>
        ) : (
          <div className="bg-slate-900 border border-slate-800 w-80 md:w-96 rounded-2xl shadow-2xl flex flex-col h-[450px]">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <span className="font-semibold text-sm text-indigo-400">Gemini Career Assistant</span>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
              {chatLog.map((c, i) => (
                <div key={i} className={`p-3 rounded-xl max-w-[85%] ${c.sender === 'user' ? 'bg-indigo-600 text-white ml-auto' : 'bg-slate-800 text-slate-200'}`}>
                  {c.text}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-800 flex gap-2">
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Ask anything..." className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" />
              <button onClick={sendChat} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}