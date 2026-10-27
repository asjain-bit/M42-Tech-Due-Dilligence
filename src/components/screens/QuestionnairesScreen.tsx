'use client'

import React, { useState, useMemo } from 'react'
import {
  Upload,
  Trash2,
  FileText,
  X,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Info,
  Download,
  AlertTriangle,
  Loader2,
  Search,
} from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import { StatusChip } from '@/components/atoms/StatusChip'
import { QuestionnaireDetailScreen, QuestionnaireDetailData } from './QuestionnaireDetailScreen'

interface Questionnaire {
  id: string
  title: string
  description: string
  fileType: 'PDF' | 'DOCX' | 'MD'
  questionsCount: number
  status: 'Ready' | 'Draft' | 'Processing'
}

export const QuestionnairesScreen: React.FC = () => {
  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    useState<QuestionnaireDetailData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ready' | 'Draft'>('all')
  const ITEMS_PER_PAGE = 8

  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([
    {
      id: 'q-1',
      title: 'Technical Questionnaire',
      description:
        'Core architectural, clinical risk, and technical data pipeline compliance questionnaire.',
      fileType: 'PDF',
      questionsCount: 62,
      status: 'Ready',
    },
    {
      id: 'q-2',
      title: 'Data Protection & Privacy',
      description:
        'Comprehensive 45-question audit covering ISMS policies, encryption controls, access management, and incident response.',
      fileType: 'PDF',
      questionsCount: 45,
      status: 'Ready',
    },
    {
      id: 'q-3',
      title: 'Presight Technical & Compliance',
      description:
        'Presight AI platform-specific integration safety, API authorization, and model governance audit.',
      fileType: 'DOCX',
      questionsCount: 50,
      status: 'Draft',
    },
    {
      id: 'q-4',
      title: 'Information Security & Compliance',
      description:
        'Trust Services Criteria evaluation for security, availability, processing integrity, confidentiality, and privacy.',
      fileType: 'DOCX',
      questionsCount: 38,
      status: 'Ready',
    },
    {
      id: 'q-5',
      title: 'SOC 2 Type II Vendor Risk Assessment',
      description:
        'SOC 2 Type II controls auditing third-party hosting, access controls, and data residency.',
      fileType: 'PDF',
      questionsCount: 32,
      status: 'Ready',
    },
    {
      id: 'q-6',
      title: 'HIPAA & Healthcare Data Compliance Checklist',
      description:
        'PHI safeguarding, EHR system integrations, BAA agreements, and UAE DOH data residency verification.',
      fileType: 'PDF',
      questionsCount: 29,
      status: 'Draft',
    },
    {
      id: 'q-7',
      title: 'Third-Party Software Supply Chain Security',
      description:
        'SaaS dependency scanning, SBOM verification, open-source license compliance, and vulnerability disclosure policies.',
      fileType: 'MD',
      questionsCount: 20,
      status: 'Ready',
    },
    {
      id: 'q-8',
      title: 'ISO 27001 ISMS Security Checklist',
      description:
        'Information Security Management System policies and annual audit verification checklist.',
      fileType: 'PDF',
      questionsCount: 40,
      status: 'Ready',
    },
    {
      id: 'q-9',
      title: 'Cloud Infrastructure Audit Questionnaire',
      description:
        'Multi-cloud tenant isolation, IAM role hierarchy, and automated vulnerability remediation audit.',
      fileType: 'PDF',
      questionsCount: 35,
      status: 'Draft',
    },
    {
      id: 'q-10',
      title: 'Clinical AI Safety & Ethics Questionnaire',
      description:
        'Algorithmic bias testing, patient safety monitoring, and diagnostic model performance auditing.',
      fileType: 'DOCX',
      questionsCount: 48,
      status: 'Ready',
    },
    {
      id: 'q-11',
      title: 'UAE DOH Health Data Residency Compliance',
      description:
        'Verification of data residency, local cloud node hosting, and UAE Ministry of Health compliance.',
      fileType: 'PDF',
      questionsCount: 25,
      status: 'Ready',
    },
    {
      id: 'q-12',
      title: 'Business Continuity & Disaster Recovery Audit',
      description:
        'RTO/RPO targets, failover drills, offsite backup verification, and incident management procedures.',
      fileType: 'PDF',
      questionsCount: 30,
      status: 'Ready',
    },
  ])

  // Form states for Upload Popup Modal
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [newQuestionnaireTitle, setNewQuestionnaireTitle] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Filtered Questionnaires (Search & Status Filter)
  const filteredQuestionnaires = useMemo(() => {
    return questionnaires.filter((q) => {
      const matchesStatus = statusFilter === 'all' || q.status === statusFilter
      const query = searchTerm.toLowerCase().trim()
      const matchesSearch =
        !query ||
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        q.fileType.toLowerCase().includes(query) ||
        q.status.toLowerCase().includes(query) ||
        q.questionsCount.toString().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [questionnaires, searchTerm, statusFilter])

  // Pagination math (8 items per page)
  const totalPages = Math.ceil(filteredQuestionnaires.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedQuestionnaires = filteredQuestionnaires.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  // Single document file selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 20 * 1024 * 1024) {
        showToast('File size exceeds maximum limit of 20 MB.')
        return
      }
      setUploadedFile(file)
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !uploadedFile) return

    setIsUploading(true)
    setNewQuestionnaireTitle(title.trim())

    setTimeout(() => {
      const extension = uploadedFile.name.split('.').pop()?.toUpperCase() as 'PDF' | 'DOCX' | 'MD'
      const newQuestionnaire: Questionnaire = {
        id: `q-${Date.now()}`,
        title,
        description:
          description || `Custom vendor compliance checklist parsed from ${uploadedFile.name}.`,
        fileType: extension || 'PDF',
        questionsCount: Math.floor(Math.random() * 20) + 15,
        status: 'Draft',
      }

      setQuestionnaires([newQuestionnaire, ...questionnaires])
      setTitle('')
      setDescription('')
      setUploadedFile(null)
      setIsUploading(false)
      setShowUploadModal(false)
      setNewQuestionnaireTitle('')
      showToast(`Questionnaire "${newQuestionnaire.title}" successfully uploaded & structured!`)
    }, 1500)
  }

  const handleDelete = () => {
    if (!deletingId) return
    const target = questionnaires.find((q) => q.id === deletingId)
    setQuestionnaires(questionnaires.filter((q) => q.id !== deletingId))
    setDeletingId(null)
    if (target) {
      showToast(`Removed "${target.title}" template.`)
    }
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // If a row is clicked, open QuestionnaireDetailScreen
  if (selectedQuestionnaire) {
    return (
      <QuestionnaireDetailScreen
        questionnaire={selectedQuestionnaire}
        onBack={() => setSelectedQuestionnaire(null)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4 text-[#0d212c]">
      {/* Toast Notification — subtle light semantic styling */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#f0fdf4] text-[#15803d] px-4 py-3 rounded-xl shadow-md border border-[#bbf7d0] flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <FileText className="w-4 h-4 text-[#16a34a]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="text-xs font-semibold text-[#64748b] flex items-center gap-1.5">
        <span>M42 admin</span>
        <span>/</span>
        <span className="text-[#36c0c9] font-bold">Questionnaires</span>
      </div>

      {/* Header Bar with Search Bar placed on the LEFT side of Upload questionnaire CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-extrabold text-[#0d212c]">Questionnaires</h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questionnaire, description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e2e8f0] bg-white text-xs font-medium text-[#0d212c] outline-none focus:border-[#cbd5e1] shadow-xs"
            />
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer border-0 shrink-0"
          >
            <Upload className="w-4 h-4 text-white" />
            <span>Upload questionnaire</span>
          </button>
        </div>
      </div>

      {/* Sorting Chips: All, Ready, Draft (UI matching Vendors page) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'all', label: 'All Questionnaires', count: questionnaires.length },
          {
            key: 'Ready',
            label: 'Ready',
            count: questionnaires.filter((q) => q.status === 'Ready').length,
          },
          {
            key: 'Draft',
            label: 'Draft',
            count: questionnaires.filter((q) => q.status === 'Draft').length,
          },
        ].map((chip) => {
          const isSelected = statusFilter === chip.key
          return (
            <button
              key={chip.key}
              onClick={() => {
                setStatusFilter(chip.key as 'all' | 'Ready' | 'Draft')
                setCurrentPage(1)
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#36c0c9] text-white font-bold shadow-xs border border-[#36c0c9]'
                  : 'bg-white text-[#64748b] border border-[#e2e8f0] hover:bg-[#f8fafc]'
              }`}
            >
              <span>{chip.label}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-[#f1f5f9] text-[#64748b]'
                }`}
              >
                {chip.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Questionnaires Directory Table (Requirement 1: Format column removed) */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xs overflow-hidden w-full flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] text-xs font-bold">
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Questions</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]/60">
              {isUploading && (
                <tr className="bg-[#ddf7f9]/30 border-b border-[#36c0c9]/40 animate-pulse">
                  <td className="py-3.5 px-4 font-semibold text-xs text-[#0d212c]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#36c0c9] shrink-0" />
                      <span className="font-extrabold">
                        {newQuestionnaireTitle || 'New Questionnaire'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ddf7f9] text-[#0f766e] flex items-center gap-1 border border-[#36c0c9]/30">
                        <Loader2 className="w-3 h-3 animate-spin" /> Adding item to list...
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#64748b] text-xs max-w-sm truncate italic">
                    Parsing document and structuring questions...
                  </td>
                  <td className="py-3.5 px-4 text-[#0d212c] font-semibold text-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusChip label="Processing..." status="info" dot={false} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Loader2 className="w-4 h-4 animate-spin text-[#36c0c9] ml-auto" />
                  </td>
                </tr>
              )}
              {paginatedQuestionnaires.length === 0 && !isUploading && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-[#64748b]">
                    No matching questionnaires found.
                  </td>
                </tr>
              )}
              {paginatedQuestionnaires.map((item) => (
                <tr
                  key={item.id}
                  onClick={() =>
                    setSelectedQuestionnaire({
                      id: item.id,
                      title: item.title,
                      status: item.status,
                      questionsCount: item.questionsCount,
                      initialEditMode: false,
                    })
                  }
                  className="hover:bg-[#f8fafc] transition cursor-pointer group"
                >
                  <td
                    className="py-3.5 px-4 font-semibold text-xs text-[#0d212c] group-hover:text-[#36c0c9] truncate"
                    title={item.title}
                  >
                    {item.title}
                  </td>
                  <td
                    className="py-3.5 px-4 text-[#64748b] text-xs max-w-sm truncate"
                    title={item.description}
                  >
                    {item.description}
                  </td>
                  <td
                    className="py-3.5 px-4 text-[#0d212c] font-semibold text-xs"
                    title={`${item.questionsCount} questions`}
                  >
                    {item.questionsCount}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusChip
                      label={item.status === 'Draft' ? 'Draft' : 'Ready'}
                      status={item.status === 'Draft' ? 'warning' : 'success'}
                      dot={false}
                    />
                  </td>
                  {/* Requirement 4: Delete icon color is red with hover interaction removed */}
                  <td className="py-3.5 px-4 text-right">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setSelectedQuestionnaire({
                            id: item.id,
                            title: item.title,
                            status: item.status,
                            questionsCount: item.questionsCount,
                            initialEditMode: true,
                          })
                        }
                        className="p-1.5 text-[#64748b] hover:text-[#0d212c] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        title="Edit questionnaire"
                        aria-label="Edit questionnaire"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(item.id)}
                        className="p-1.5 text-red-600 cursor-pointer"
                        title="Delete questionnaire"
                        aria-label="Delete questionnaire"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        {filteredQuestionnaires.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
            <div className="text-xs text-[#64748b] font-medium">
              Showing page <span className="font-semibold text-[#0d212c]">{currentPage}</span> of{' '}
              <span className="font-semibold text-[#0d212c]">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[#cbd5e1] text-xs font-semibold text-[#0d212c] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer flex items-center justify-center"
                title="Previous page"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#36c0c9] text-white'
                        : 'text-[#64748b] hover:bg-slate-200/60'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[#cbd5e1] text-xs font-semibold text-[#0d212c] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer flex items-center justify-center"
                title="Next page"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Questionnaire Popup Modal (Requirement 2: Width increased to max-w-3xl) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-[#0d212c]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl border border-[#e2e8f0] animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4 mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-[#0d212c]">Upload questionnaire</h3>
                <p className="text-xs text-[#64748b] mt-0.5 font-medium">
                  Upload custom compliance checklist document for AI automated parsing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#0d212c] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0d212c] mb-2">
                  Questionnaire title <span className="text-red-500 font-bold">*</span>
                </label>
                <Input
                  placeholder="e.g. Technical Questionnaire"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full text-xs py-3"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0d212c] mb-2">Description</label>
                <Textarea
                  placeholder="Brief summary of what this questionnaire covers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full text-xs"
                />
              </div>

              {/* Requirement 3: Info icon color uses text color (#64748b) */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <label className="block text-xs font-bold text-[#0d212c]">
                    Document upload (PDF, DOCX, MD - Max 1 file, up to 20 MB){' '}
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative group cursor-pointer">
                    <Info className="w-3.5 h-3.5 text-[#64748b]" />
                    <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute left-1/2 -translate-x-1/2 bottom-6 z-50 w-64 bg-[#0d212c] text-white text-xs p-2.5 rounded-xl shadow-xl border border-white/10 text-center">
                      The questionnaire will be created based on the document you will be uploading,
                      which can be edited later on.
                    </div>
                  </div>
                </div>

                {!uploadedFile ? (
                  <label className="border-2 border-dashed border-[#e2e8f0] hover:border-[#cbd5e1] bg-[#f8fafc] hover:bg-[#f1f5f9] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition text-center min-h-[160px]">
                    <Upload className="w-8 h-8 text-[#0d212c]" />
                    <span className="text-xs font-bold text-[#0d212c]">
                      Click to choose file or drag and drop
                    </span>
                    <span className="text-[11px] text-[#64748b]">
                      Supported formats: PDF, DOCX, MD (Maximum file size: 20 MB)
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.md"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                ) : (
                  <div className="p-4 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-[#0d212c] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0d212c] truncate">
                          {uploadedFile.name}
                        </p>
                        <span className="text-[10px] text-[#64748b]">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB (Max 20 MB)
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="mt-3 p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col gap-2">
                  <p className="text-[11px] text-[#64748b] leading-relaxed">
                    <strong>Note:</strong> Please make sure to include all questions in the
                    specified format along with all response details. Below is the reference
                    template which you can download.
                  </p>
                  <button
                    type="button"
                    onClick={() => showToast('Downloading questionnaire reference template...')}
                    className="text-[#36c0c9] hover:text-[#2cb0b9] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer bg-transparent border-0 self-start p-0"
                  >
                    <Download className="w-3.5 h-3.5 text-[#36c0c9]" />
                    <span>Download questionnaire template</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#0d212c] hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !title.trim() || !uploadedFile}
                  className="bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold py-2.5 px-7 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition border-0"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Adding & structuring...</span>
                    </>
                  ) : (
                    <span>Upload & structure</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Questionnaire Confirmation Modal Popup (Center Aligned) */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-[#0d212c]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 sm:p-10 shadow-2xl border border-[#e2e8f0] animate-in fade-in zoom-in-95 duration-150 text-center flex flex-col items-center gap-4 min-h-[240px] justify-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-2xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#0d212c] mb-1.5">Confirm deletion</h3>
              <p className="text-xs text-[#64748b] leading-relaxed max-w-md">
                Are you sure you want to remove this questionnaire template from your active
                workspace?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 w-full mt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-6 py-3 rounded-xl border border-[#e2e8f0] text-xs font-bold text-[#0d212c] hover:bg-slate-50 cursor-pointer flex-1 bg-transparent transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer flex-1 border-0 transition shadow-2xs"
              >
                Delete template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
