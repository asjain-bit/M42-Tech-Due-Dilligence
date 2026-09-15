'use client'

import React, { useState } from 'react'
import {
  Send,
  Calendar,
  Users,
  PhoneCall,
  CheckCircle2,
  Eye,
  Download,
  Play,
  Pause,
  Copy,
  Check,
  Paperclip,
  Upload,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Clock,
  User,
  Bot,
  Mail,
  FileText,
  MessageSquare,
} from 'lucide-react'
import { StatusChip } from '@/components/atoms/StatusChip'

export interface AssessmentDetailData {
  id: string
  vendor: string
  questionnaire: string
  round: string
  status: 'awaiting_evidence' | 'completed' | 'scheduled' | 'finalised' | 'ready'
  score: string
  createdDate: string
}

interface AssessmentDetailScreenProps {
  assessment: AssessmentDetailData
  onBack: () => void
  onStatusChange?: (newStatus: 'ready' | 'finalised' | 'completed') => void
}

interface AttachedFile {
  name: string
  size: string
  type: string
  date: string
}

interface AuditTrailEvent {
  id: string
  title: string
  category: 'System' | 'Admin' | 'AI Agent' | 'Vendor'
  timestamp: string
  actor: string
  details: string
  icon: React.ElementType
  confidence?: 'High confidence' | 'Medium confidence' | 'Low confidence'
}

export const AssessmentDetailScreen: React.FC<AssessmentDetailScreenProps> = ({
  assessment,
  onBack,
  onStatusChange,
}) => {
  const [activeTab, setActiveTab] = useState<'assessment' | 'audit_trail'>('assessment')
  const [showAnswerKey, setShowAnswerKey] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState('1')
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<
    'awaiting_evidence' | 'completed' | 'scheduled' | 'finalised' | 'ready'
  >(assessment.status)

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [questionFiles, setQuestionFiles] = useState<Record<number, AttachedFile[]>>({
    3: [
      {
        name: 'ISO_27001_Readiness_Report_2026.pdf',
        size: '1.4 MB',
        type: 'PDF',
        date: '25 Aug 2026',
      },
    ],
  })

  // Sample Meeting URL for Dispatch Call
  const meetingUrl = 'https://meet.m42.ae/call/vendor-audit-9823'

  const isScheduled = currentStatus === 'scheduled'

  // Dynamic status list based on questionnaire progress and current status
  const lifecycleSteps = [
    { title: 'Call dispatched', actor: 'Admin User', time: '1 Sept, 10:30 AM', status: 'DONE' },
    {
      title: 'Meeting Scheduled',
      actor: 'System Scheduler',
      time: '1 Sept, 01:14 PM',
      status: 'DONE',
      hasMeetingUrl: true,
    },
    {
      title: 'Participants joined',
      actor: 'Presight AI',
      time: isScheduled ? 'Pending' : '1 Sept, 01:15 PM',
      status: isScheduled ? 'AWAITING' : 'DONE',
    },
    {
      title: 'Assessment call',
      actor: 'Voice Agent Sam',
      time: isScheduled ? 'Pending' : '1 Sept, 01:19 PM',
      status: isScheduled ? 'AWAITING' : 'DONE',
    },
    {
      title: 'Call ended',
      actor: 'Voice Agent Sam',
      time: isScheduled ? 'Pending' : '1 Sept, 01:19 PM',
      status: isScheduled ? 'AWAITING' : 'DONE',
    },
    {
      title: 'Transcript composed',
      actor: 'NLP Pipeline',
      time: isScheduled ? 'Pending' : '1 Sept, 01:20 PM',
      status: isScheduled ? 'AWAITING' : 'DONE',
    },
    {
      title: 'Scoring',
      actor: 'Evaluation Subagent',
      time: isScheduled ? 'Pending' : '1 Sept, 01:22 PM',
      status: isScheduled ? 'AWAITING' : 'DONE',
    },
    {
      title: 'Report ready',
      actor: 'Audit Engine',
      time: isScheduled ? 'Pending' : '1 Sept, 01:25 PM',
      status: isScheduled ? 'AWAITING' : 'DONE',
    },
    {
      title: 'Finalized',
      actor: 'Admin User',
      time:
        !isScheduled && (currentStatus === 'completed' || currentStatus === 'finalised')
          ? '1 Sept, 02:05 PM'
          : 'Pending',
      status:
        !isScheduled && (currentStatus === 'completed' || currentStatus === 'finalised')
          ? 'DONE'
          : 'AWAITING',
    },
  ]

  // Requirement 2: Audit Trail Timeline Data
  const auditEvents: AuditTrailEvent[] = [
    {
      id: 'aud-8',
      title: 'Assessment Finalized & Status Updated',
      category: 'Admin',
      timestamp: '1 Sept 2026, 02:05 PM',
      actor: 'Admin User (M42 Compliance)',
      details:
        'Reviewed evidence submissions, verified ADX public registry proof, and marked assessment status as Ready.',
      icon: ShieldCheck,
      confidence: 'High confidence',
    },
    {
      id: 'aud-7',
      title: 'Evidence Document Uploaded',
      category: 'Vendor',
      timestamp: '25 Aug 2026, 02:15 PM',
      actor: 'Presight AI Security Team',
      details: 'Uploaded ISO_27001_Readiness_Report_2026.pdf (1.4 MB) as evidence for Question 3.',
      icon: FileCheck,
      confidence: 'High confidence',
    },
    {
      id: 'aud-6',
      title: 'Automated Registry & Research Verification',
      category: 'AI Agent',
      timestamp: '1 Sept 2026, 01:22 PM',
      actor: 'M42 Research Subagent',
      details:
        'Matched ADX ticker PRESIGHT against official Abu Dhabi Securities Exchange public registry (4/4 sources verified).',
      icon: Bot,
      confidence: 'High confidence',
    },
    {
      id: 'aud-5',
      title: 'Interview Audio & Transcript Captured',
      category: 'AI Agent',
      timestamp: '1 Sept 2026, 01:19 PM',
      actor: 'Voice Agent Sam',
      details:
        'Recorded 3:47 audio interview session and generated text transcript with 7/7 questions evaluated.',
      icon: PhoneCall,
      confidence: 'High confidence',
    },
    {
      id: 'aud-4',
      title: 'Assessment Call Connected',
      category: 'Vendor',
      timestamp: '1 Sept 2026, 01:15 PM',
      actor: 'Presight AI Representative & AI Agent Sam',
      details: 'Participants joined audio call room session #9823.',
      icon: Users,
      confidence: 'Medium confidence',
    },
    {
      id: 'aud-3',
      title: 'Meeting Link & Session Token Generated',
      category: 'System',
      timestamp: '1 Sept 2026, 01:14 PM',
      actor: 'M42 System Scheduler',
      details:
        'Created meeting URL (https://meet.m42.ae/call/vendor-audit-9823) with secure 256-bit access token.',
      icon: Calendar,
      confidence: 'High confidence',
    },
    {
      id: 'aud-2',
      title: 'Email Dispatch Notification Sent',
      category: 'System',
      timestamp: '1 Sept 2026, 01:15 PM',
      actor: 'M42 Dispatcher',
      details: 'Dispatched automated call invitation email to recipient@presight.ai.',
      icon: Mail,
      confidence: 'High confidence',
    },
    {
      id: 'aud-1',
      title: 'Assessment Created & Dispatched',
      category: 'Admin',
      timestamp: '1 Sept 2026, 10:30 AM',
      actor: 'Admin User (M42 Compliance)',
      details:
        'Created Round 1 assessment for Presight AI using Technical Questionnaire compliance template.',
      icon: Send,
      confidence: 'High confidence',
    },
  ]

  const handleCopyMeetingUrl = () => {
    navigator.clipboard.writeText(meetingUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const handleFileUpload = (questionId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const newFile: AttachedFile = {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      date: 'Today',
    }

    setQuestionFiles((prev) => ({
      ...prev,
      [questionId]: [...(prev[questionId] || []), newFile],
    }))

    setToastMessage(`Attached ${file.name} to Question ${questionId}`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleFinalize = () => {
    const nextStatus = currentStatus === 'awaiting_evidence' ? 'ready' : 'finalised'
    setCurrentStatus(nextStatus)
    if (onStatusChange) {
      onStatusChange(nextStatus)
    }
    setToastMessage(
      `Assessment finalized! Status updated to ${nextStatus === 'ready' ? 'Ready' : 'Finalised'}.`
    )
    setTimeout(() => setToastMessage(null), 3500)
  }

  const questions = [
    {
      id: 1,
      category: 'Corporate',
      question:
        'State the city and country of your headquarters and any stock exchange you are listed on.',
      confidence: 'High confidence',
      confidenceType: 'success' as const,
      confidenceTooltip:
        'High confidence: Official Abu Dhabi Securities Exchange public registry matched.',
      answer:
        'Presight AI Holding PLC is headquartered in Abu Dhabi, United Arab Emirates, and is listed on the Abu Dhabi Securities Exchange (ADX) under the ticker PRESIGHT.',
      whyScore: 'Scored on the quality of the answer.',
      answerNotes:
        'The answer explicitly names the HQ city (Abu Dhabi), country (United Arab Emirates), and the exchange (Abu Dhabi Securities Exchange) as required by the cue.',
      requiresEvidence: false,
      research: {
        text: 'Presight AI Holding PLC is headquartered in Abu Dhabi, United Arab Emirates, and is listed on the Abu Dhabi Securities Exchange (ADX) under the ticker PRESIGHT.',
        status: 'PASS',
        links: [
          'Presight AI Holding PLC Stock Quote (Abu Dhabi ...',
          '(PRESIGHT.AD) | Stock Price & Latest News',
          'Presight AI now listed on the Abu Dhabi Securities Exchange',
          'PRESIGHT Stock Price and Chart',
        ],
      },
    },
    {
      id: 2,
      category: 'Security',
      question: 'Describe how you encrypt customer data at rest and in transit.',
      confidence: 'High confidence',
      confidenceType: 'success' as const,
      confidenceTooltip:
        'High confidence: Explicit technical match for AES-256 and TLS 1.2+ encryption standards.',
      answer:
        'Customer data is encrypted at rest with AES-256 and in transit with TLS 1.2 or higher, with managed key rotation.',
      whyScore: 'Scored on the quality of the answer.',
      answerNotes:
        'The answer explicitly names AES-256 for data at rest and TLS 1.2 or higher for data in transit, fully meeting the cue requirements.',
      requiresEvidence: false,
    },
    {
      id: 3,
      category: 'Security',
      question: 'Provide your current ISO/IEC 27001 certificate.',
      confidence: 'Low confidence',
      confidenceType: 'warning' as const,
      confidenceTooltip:
        'Low confidence: Stage 1 review uploaded; full Stage 2 certificate pending verification.',
      answer:
        'The uploaded document states completion of Stage 1 readiness review for ISO/IEC 27001 with Stage 2 certification audit scheduled. Later the certificate was uploaded and received successfully.',
      whyScore: 'No valid, authentic document was provided initially, so this scores low.',
      answerNotes:
        'The answer confirms that a certificate was uploaded and received successfully, but initially only mentions completion of Stage 1 readiness review.',
      requiresEvidence: true,
    },
    {
      id: 4,
      category: 'Security',
      question:
        'Describe your identity and access management controls (SSO, MFA, least privilege).',
      confidence: 'Medium confidence',
      confidenceType: 'warning' as const,
      confidenceTooltip:
        'Medium confidence: Partial response; role-based access described without enforced MFA details.',
      answer: '(not answered)',
      whyScore: 'Scored on the quality of the answer.',
      answerNotes:
        'The answer addresses role-based least-privilege access and access controls but fails to explicitly mention SSO or enforced MFA.',
      requiresEvidence: true,
    },
    {
      id: 5,
      category: 'Resilience',
      question:
        'Describe your incident-response process and typical time to notify affected customers.',
      confidence: 'Medium confidence',
      confidenceType: 'warning' as const,
      confidenceTooltip:
        'Medium confidence: Document confirms IR framework without stated customer SLA window.',
      answer: '(not answered)',
      whyScore: 'Scored on the quality of the answer.',
      answerNotes:
        'The answer confirms the existence of a documented incident-response process but fails to provide a stated notification window.',
      requiresEvidence: true,
    },
    {
      id: 6,
      category: 'Assurance',
      question: 'Provide your most recent penetration test summary or SOC 2 Type II report.',
      confidence: 'Low confidence',
      confidenceType: 'warning' as const,
      confidenceTooltip:
        'Low confidence: Missing mandatory penetration test summary or SOC 2 report attachment.',
      answer: '(not answered)',
      whyScore: 'No valid, authentic document was provided, so this scores low.',
      answerNotes:
        'The answer is empty and does not provide any information about a recent pen-test summary or SOC 2 Type II report.',
      requiresEvidence: true,
    },
    {
      id: 7,
      category: 'Data',
      question: 'Where is customer data stored, and can data residency be restricted to a region?',
      confidence: 'Low confidence',
      confidenceType: 'warning' as const,
      confidenceTooltip: 'Low confidence: Missing UAE cloud tenant data residency proof.',
      answer: '(not answered)',
      whyScore: 'Scored on the quality of the answer.',
      answerNotes:
        'Response lacks specific cloud tenant location proof for UAE residency restrictions.',
      requiresEvidence: true,
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0d212c] pb-16 font-sans w-full">
      {/* Toast Notification */}
      {/* Toast Notification — subtle light semantic styling */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#f0fdf4] text-[#15803d] text-xs font-semibold px-4 py-3 rounded-xl shadow-md border border-[#bbf7d0] flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
          <span>{toastMessage}</span>
        </div>
      )}{' '}
      {/* Breadcrumb Menu (Moved outside of Header Card) */}
      <div className="w-full px-6 lg:px-10 pt-4 pb-1 text-xs font-medium flex items-center gap-1.5 text-[#64748b]">
        <button onClick={onBack} className="hover:text-[#0d7280] cursor-pointer">
          M42 admin
        </button>
        <span>/</span>
        <button onClick={onBack} className="hover:text-[#0d7280] cursor-pointer">
          Dashboard
        </button>
        <span>/</span>
        <span className="text-[#36c0c9] font-bold">Assessment details</span>
      </div>
      {/* Header Container Card — Very light shade of light primary color with minimal stroke */}
      <div className="w-full px-6 lg:px-10 pt-3">
        <div className="bg-[#ddf7f9]/20 rounded-3xl border border-[#36c0c9]/30 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-3">
            {/* Main Title & Subtitle */}
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0d212c]">
                {assessment.vendor}
              </h1>
              <h2 className="text-xs font-bold text-[#64748b]">{assessment.questionnaire}</h2>
            </div>

            {/* Status Chips Row */}
            <div className="flex items-center gap-2.5 flex-wrap mt-0.5">
              <StatusChip
                label={
                  currentStatus === 'completed'
                    ? 'Completed'
                    : currentStatus === 'ready'
                      ? 'Ready'
                      : currentStatus === 'scheduled'
                        ? 'Scheduled'
                        : currentStatus === 'finalised'
                          ? 'Finalised'
                          : 'Awaiting evidence'
                }
                status={
                  currentStatus === 'completed'
                    ? 'success'
                    : currentStatus === 'ready'
                      ? 'info'
                      : currentStatus === 'scheduled'
                        ? 'info'
                        : currentStatus === 'finalised'
                          ? 'finalised'
                          : 'warning'
                }
                dot={false}
              />
              <span className="text-[#36c0c9]/30 font-bold">|</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#e0f2fe] text-[#0369a1] text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Round 1</span>
              </span>
              {!isScheduled && (
                <>
                  <span className="text-[#36c0c9]/30 font-bold">|</span>
                  {(() => {
                    const scoreLower = (assessment.score || '').toLowerCase()
                    const isHighScore =
                      scoreLower.includes('high') ||
                      currentStatus === 'completed' ||
                      currentStatus === 'finalised'
                    const isLowScore = scoreLower.includes('low')
                    const confidenceLevel = isHighScore ? 'High' : isLowScore ? 'Low' : 'Medium'
                    const chipStatus = isHighScore ? 'success' : isLowScore ? 'warning' : 'warning'

                    return (
                      <StatusChip
                        label={`Overall confidence: ${confidenceLevel}`}
                        status={chipStatus}
                        dot={false}
                      />
                    )
                  })()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="w-full px-6 lg:px-10 mt-6 flex flex-col gap-6">
        {/* Navigation Tabs Bar — Grey horizontal line spans ONLY both tabs */}
        <div className="flex items-center justify-between pb-0">
          <div className="flex items-center gap-8 border-b border-[#e2e8f0]">
            <button
              onClick={() => setActiveTab('assessment')}
              className={`pb-3.5 text-sm font-bold flex items-center gap-2.5 transition cursor-pointer border-b-2 -mb-px ${
                activeTab === 'assessment'
                  ? 'border-[#36c0c9] text-[#36c0c9]'
                  : 'border-transparent text-[#64748b] hover:text-[#0d212c]'
              }`}
            >
              <FileText
                className={`w-4.5 h-4.5 ${activeTab === 'assessment' ? 'text-[#36c0c9]' : 'text-[#64748b]'}`}
              />
              <span>Assessment</span>
            </button>
            <button
              onClick={() => setActiveTab('audit_trail')}
              className={`pb-3.5 text-sm font-bold flex items-center gap-2.5 transition cursor-pointer border-b-2 -mb-px ${
                activeTab === 'audit_trail'
                  ? 'border-[#36c0c9] text-[#36c0c9]'
                  : 'border-transparent text-[#64748b] hover:text-[#0d212c]'
              }`}
            >
              <Clock
                className={`w-4.5 h-4.5 ${activeTab === 'audit_trail' ? 'text-[#36c0c9]' : 'text-[#64748b]'}`}
              />
              <span>Audit trail</span>
            </button>
          </div>

          <div className="flex items-center gap-3 pb-3">
            {currentStatus !== 'scheduled' && (
              <button
                onClick={() => alert(`Downloading PDF report for ${assessment.vendor}...`)}
                className={
                  currentStatus === 'finalised'
                    ? 'bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold text-xs px-5 py-2 rounded-xl transition cursor-pointer shadow-2xs border-0 flex items-center gap-2'
                    : 'px-4 py-2 rounded-xl border border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50 text-[#0d212c] bg-white font-bold text-xs flex items-center gap-2 shadow-2xs cursor-pointer transition'
                }
              >
                <Download
                  className={`w-4 h-4 ${currentStatus === 'finalised' ? 'text-white' : 'text-[#0d212c]'}`}
                />
                <span>Download PDF</span>
              </button>
            )}
            {currentStatus !== 'scheduled' && currentStatus !== 'finalised' && (
              <button
                onClick={handleFinalize}
                className="bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold text-xs px-5 py-2 rounded-xl transition cursor-pointer shadow-2xs border-0"
              >
                Finalize
              </button>
            )}
          </div>
        </div>

        {/* Audit Trail Tab View */}
        {activeTab === 'audit_trail' ? (
          currentStatus === 'scheduled' ? (
            <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col items-center justify-center text-center gap-3 min-h-[260px]">
              <div className="w-12 h-12 rounded-2xl bg-[#ddf7f9] flex items-center justify-center text-[#36c0c9]">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h4 className="font-extrabold text-sm text-[#0d212c]">Audit log scheduled</h4>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  The audit trail and call transcript will be generated automatically after the
                  assessment meeting is completed.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#0d212c]">
                    Assessment Audit Trail
                  </h3>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Complete chronological activity log capturing all system events, AI agent
                    interactions, and admin actions.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#0f766e] bg-[#ddf7f9] px-3 py-1 rounded-full">
                  8 events logged
                </span>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2e8f0] shadow-xs">
                <div className="relative pl-2 flex flex-col gap-8">
                  {auditEvents.map((event, idx) => {
                    const EventIcon = event.icon
                    const isLast = idx === auditEvents.length - 1
                    return (
                      <div key={event.id} className="relative pl-8 flex flex-col gap-1.5">
                        {/* Vertical connecting line (only rendered if not the last event) */}
                        {!isLast && (
                          <div className="absolute left-[13px] top-7 bottom-0 w-0.5 bg-[#e2e8f0] translate-y-1" />
                        )}

                        {/* Timeline Node Icon Circle (100% Primary Light Color Fill, No Stroke, White Icon) */}
                        <div className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-[#36c0c9] flex items-center justify-center text-white shadow-2xs z-10">
                          <EventIcon className="w-3.5 h-3.5 text-white" />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <h4 className="font-extrabold text-sm text-[#0d212c]">{event.title}</h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                event.category === 'Admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : event.category === 'AI Agent'
                                    ? 'bg-[#ddf7f9] text-[#0f766e]'
                                    : event.category === 'Vendor'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {event.category}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-[#64748b] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {event.timestamp}
                          </span>
                        </div>

                        {/* Confidence chip placed BELOW the title (ONLY for Admin, AI Agent, Vendor - NOT System) */}
                        {event.category !== 'System' && event.confidence && (
                          <div className="flex items-center mt-0.5">
                            <StatusChip
                              label={event.confidence}
                              status={
                                event.confidence.startsWith('High')
                                  ? 'success'
                                  : event.confidence.startsWith('Low')
                                    ? 'warning'
                                    : 'warning'
                              }
                              dot={false}
                            />
                          </div>
                        )}

                        <p className="text-xs text-[#0d212c] leading-relaxed mt-0.5">
                          {event.details}
                        </p>

                        <div className="text-[11px] text-[#64748b] font-medium flex items-center gap-1.5 mt-0.5">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>
                            Actor:{' '}
                            <strong className="text-[#0d212c] font-semibold">{event.actor}</strong>
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        ) : (
          <>
            {/* Section 1: Assessment lifecycle (Previous Card Theme with horizontal scroll for all 9 steps) */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-[#0d212c]">Assessment lifecycle</h3>
              <div className="w-full overflow-x-auto pb-3.5 pt-1 flex items-center gap-3 subtle-scrollbar group/lifecycle">
                {lifecycleSteps.map((step, idx) => {
                  const isAwaiting = step.status === 'AWAITING'

                  return (
                    <React.Fragment key={step.title}>
                      <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#e2e8f0]/60 flex flex-col justify-start gap-2 h-[145px] w-[210px] shrink-0 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className="font-bold text-[#0d212c] text-sm truncate"
                            title={step.title}
                          >
                            {step.title}
                          </h4>
                          {isAwaiting ? (
                            <Clock className="w-4.5 h-4.5 text-[#b45309] shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-4.5 h-4.5 text-white fill-[#137333] shrink-0" />
                          )}
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <p className="text-[11px] text-[#64748b]">{step.actor}</p>
                          <p className="text-[10px] text-[#64748b] font-medium">{step.time}</p>
                        </div>

                        {step.hasMeetingUrl && (
                          <div className="mt-auto pt-1.5 border-t border-[#e2e8f0] flex items-center justify-between gap-1 text-[11px]">
                            <span
                              className="text-[#36c0c9] font-medium truncate"
                              title={meetingUrl}
                            >
                              {meetingUrl.replace('https://', '')}
                            </span>
                            <button
                              onClick={handleCopyMeetingUrl}
                              className="p-1 text-[#64748b] hover:text-[#0d212c] transition cursor-pointer shrink-0 rounded hover:bg-slate-200/60"
                              title="Copy meeting URL"
                            >
                              {copiedUrl ? (
                                <Check className="w-3.5 h-3.5 text-[#137333]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {idx < lifecycleSteps.length - 1 && (
                        <div className="flex items-center justify-center shrink-0 px-1">
                          <ArrowRight className="w-5 h-5 text-[#36c0c9] stroke-[2.5]" />
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>

            {/* Section 2: Agent confidence evaluation */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0d212c]">Agent confidence evaluation</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isScheduled
                      ? 'bg-[#fef7e0] text-[#b06000]'
                      : currentStatus === 'completed' || currentStatus === 'finalised'
                        ? 'bg-[#e6f4ea] text-[#137333]'
                        : 'bg-[#fef7e0] text-[#b06000]'
                  }`}
                >
                  {isScheduled
                    ? 'Pending'
                    : currentStatus === 'completed' || currentStatus === 'finalised'
                      ? 'Completed'
                      : 'Draft'}
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
                {isScheduled ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#0d212c]">Evaluation Pending</span>
                        <span className="text-[11px] text-[#64748b]">
                          Confidence evaluation and score analytics will be generated automatically
                          after the assessment meeting completes.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e2e8f0]">
                    {/* Column 1: ANSWERS */}
                    <div className="py-3 md:py-0 md:pr-6 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-[#64748b] tracking-wider flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          ANSWERS
                        </span>
                        <StatusChip label="Medium confidence" status="warning" dot={false} />
                      </div>
                      <div className="text-base font-extrabold text-[#0d212c] mt-0.5">
                        7/7 answered
                      </div>
                    </div>

                    {/* Column 2: DOCUMENTS */}
                    <div className="py-3 md:py-0 md:px-6 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-[#64748b] tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          DOCUMENTS
                        </span>
                        <StatusChip label="Low confidence" status="warning" dot={false} />
                      </div>
                      <div className="text-base font-extrabold text-[#0d212c] mt-0.5">
                        3/7 files uploaded
                      </div>
                    </div>

                    {/* Column 3: RESEARCH */}
                    <div className="py-3 md:py-0 md:pl-6 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-[#64748b] tracking-wider flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5" />
                          EVALUATION
                        </span>
                        <StatusChip label="High confidence" status="success" dot={false} />
                      </div>
                      <div className="text-base font-extrabold text-[#0d212c] mt-0.5">
                        4/4 sources verified
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Interview audio */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-[#0d212c]">Interview audio</h3>
              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-3">
                {isScheduled ? (
                  <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#0d212c]">No Audio Recording</span>
                      <span className="text-[11px] text-[#64748b]">
                        Meeting has not started yet. Audio recording will be available after the
                        assessment call.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center gap-4">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-10 h-10 rounded-xl bg-[#0d212c] text-white flex items-center justify-center shadow-xs shrink-0 hover:bg-[#08171f] transition cursor-pointer"
                    >
                      {isPlayingAudio ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 flex flex-col gap-1">
                      <div className="h-2 w-full bg-[#e2e8f0] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-[#36c0c9] ${isPlayingAudio ? 'w-1/3 transition-all duration-1000' : 'w-0'}`}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-[#64748b]">
                        <span>0:00</span>
                        <span>3:47</span>
                      </div>
                    </div>

                    {/* Playback speed dropdown */}
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] bg-white text-xs font-bold text-[#0d212c] outline-none cursor-pointer"
                        title="Playback speed"
                      >
                        <option value="0.75">0.75x</option>
                        <option value="1">1.0x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2.0x</option>
                      </select>

                      <button
                        onClick={() => alert('Downloading interview audio...')}
                        className="p-2 rounded-xl border border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-100 text-[#0d212c] bg-white transition cursor-pointer flex items-center justify-center"
                        title="Download interview audio"
                        aria-label="Download interview audio"
                      >
                        <Download className="w-4 h-4 text-[#64748b]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Summary */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-[#0d212c]">Summary</h3>
              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
                <p className="text-xs text-[#64748b] leading-relaxed">
                  {isScheduled
                    ? 'No summary generated yet. The meeting has not been started.'
                    : 'Overall evaluation across 7 questions; 2 mandatory evidence items outstanding.'}
                </p>
              </div>
            </div>

            {/* Section 5: Questions */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0d212c]">Questions</h3>
                {!isScheduled && (
                  <button
                    onClick={() => setShowAnswerKey(!showAnswerKey)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-[#f8fafc] text-[#0d212c] bg-white transition cursor-pointer"
                  >
                    {showAnswerKey ? 'Hide answer key' : 'Show answer key'}
                  </button>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
                <div className="divide-y divide-[#e2e8f0]/80">
                  {questions.map((q) => {
                    const attachmentsForQuestion = questionFiles[q.id] || []
                    const canUpload =
                      !isScheduled && currentStatus !== 'completed' && q.requiresEvidence
                    const shouldShowAttachmentSection =
                      !isScheduled && (attachmentsForQuestion.length > 0 || canUpload)

                    return (
                      <div key={q.id} className="py-5 first:pt-0 last:pb-0 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-bold text-[#0d212c] text-sm">
                            {q.id}. [{q.category}] {q.question}
                          </h4>

                          {!isScheduled && (
                            <div className="relative group shrink-0">
                              <div className="cursor-default">
                                <StatusChip
                                  label={q.confidence}
                                  status={q.confidenceType}
                                  dot={false}
                                />
                              </div>
                              <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-0 top-7 z-30 w-64 bg-[#0d212c] text-white text-xs p-3 rounded-xl shadow-xl border border-white/10">
                                {q.confidenceTooltip}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-[#0d212c] leading-relaxed">
                          <strong>Answer:</strong>{' '}
                          <span className={isScheduled ? 'text-[#64748b] italic' : ''}>
                            {isScheduled
                              ? 'Meeting not started yet. Question will be answered during the assessment call.'
                              : q.answer}
                          </span>
                        </div>

                        {!isScheduled && showAnswerKey && (
                          <>
                            <div className="text-xs text-[#64748b]">
                              <strong>Why this score:</strong> {q.whyScore}
                            </div>

                            <div className="text-xs text-[#64748b]">
                              <strong>Answer notes:</strong> {q.answerNotes}
                            </div>
                          </>
                        )}

                        {!isScheduled && q.research && (
                          <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-xs flex flex-col gap-1.5 mt-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#0d212c]">
                                Research: {q.research.text}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-[#12b76a] text-white font-bold text-[10px]">
                                {q.research.status}
                              </span>
                            </div>

                            <div className="flex flex-col gap-1 text-[#0f766e]">
                              {q.research.links.map((link) => (
                                <a
                                  key={link}
                                  href="#"
                                  className="hover:underline truncate text-[11px]"
                                >
                                  {link}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {shouldShowAttachmentSection && (
                          <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            {/* Column 1: Attachments (if available) */}
                            {attachmentsForQuestion.length > 0 && (
                              <div className="flex flex-col gap-2.5 min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0d212c]">
                                  <Paperclip className="w-4 h-4 text-[#0d7280]" />
                                  <span>Attachments ({attachmentsForQuestion.length})</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                  {attachmentsForQuestion.map((file, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3 rounded-xl border border-[#e2e8f0] bg-white inline-flex items-center justify-between gap-4 text-xs w-full sm:w-auto min-w-[300px] shadow-2xs"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="px-2.5 py-1 rounded-lg bg-[#eff6ff] text-[#2563eb] font-bold text-[10px] shrink-0">
                                          {file.type}
                                        </div>
                                        <div className="min-w-0">
                                          <h5 className="font-bold text-xs text-[#0d212c] truncate">
                                            {file.name}
                                          </h5>
                                          <span className="text-[10px] text-[#64748b] block">
                                            {file.size} • {file.date}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          onClick={() => alert(`Viewing ${file.name}...`)}
                                          className="p-1 text-[#64748b] hover:text-[#0d212c] cursor-pointer"
                                          title="View file"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => alert(`Downloading ${file.name}...`)}
                                          className="p-1 text-[#64748b] hover:text-[#0d212c] cursor-pointer"
                                          title="Download file"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Column 2: Evidence Section (Shown ONLY if evidence is NOT uploaded yet) */}
                            {attachmentsForQuestion.length === 0 && (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-1">
                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0d212c] mb-1">
                                    <ShieldCheck className="w-4 h-4 text-[#0d7280]" />
                                    <span>Evidence</span>
                                  </div>
                                  <span className="text-xs font-bold text-[#0d212c]">
                                    No evidence uploaded yet
                                  </span>
                                  <span className="text-[11px] text-[#64748b]">
                                    Upload supporting evidence for this answer.
                                  </span>
                                </div>

                                {canUpload && (
                                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#0d7280] text-[#0d7280] hover:bg-[#f0fdfa] font-bold text-xs cursor-pointer transition shadow-2xs shrink-0 self-start sm:self-center">
                                    <Upload className="w-3.5 h-3.5 text-[#0d7280]" />
                                    <span>Upload evidence</span>
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={(e) => handleFileUpload(q.id, e)}
                                    />
                                  </label>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
