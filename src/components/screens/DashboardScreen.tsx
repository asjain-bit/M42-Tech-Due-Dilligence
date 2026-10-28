'use client'

import React, { useState, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  RefreshCw,
  Folder,
  Info,
} from 'lucide-react'
import { StatusChip } from '@/components/atoms/StatusChip'
import { SearchBar } from '@/components/molecules/SearchBar'
import { FilterMenu } from '@/components/molecules/FilterMenu'
import {
  AssessmentDetailScreen,
  AssessmentDetailData,
  AssessmentStatus,
  MeetingLogEntry,
} from './AssessmentDetailScreen'

// An earlier round already conducted for the same case
interface PastRound {
  id: string
  questionnaire: string
  round: string
  status: AssessmentStatus
  score: string
  createdDate: string
}

interface AssessmentRow {
  id: string
  caseId: string
  vendor: string
  questionnaire: string
  round: string
  status: AssessmentStatus
  score: string
  createdDate: string
  meetingDateTime?: string
  meetingLog?: MeetingLogEntry[]
  pastRounds?: PastRound[]
}

const STATUS_LABELS: Record<AssessmentStatus, string> = {
  awaiting_evidence: 'Awaiting evidence',
  ready: 'Ready',
  cancelled: 'Cancelled',
  scheduled: 'Scheduled',
  finalised: 'Finalised',
  completed: 'Completed',
}

const getStatusChipStatus = (status: AssessmentStatus) =>
  status === 'awaiting_evidence'
    ? 'warning'
    : status === 'ready'
      ? 'info'
      : status === 'cancelled'
        ? 'error'
        : status === 'scheduled'
          ? 'info'
          : status === 'finalised'
            ? 'finalised'
            : 'success'

export const DashboardScreen: React.FC = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentDetailData | null>(null)
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [assessmentFilters, setAssessmentFilters] = useState<Record<string, string>>({})
  // Cases whose earlier rounds are expanded in the table
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  // Show 8 rows per page consistently across all tables
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 8

  // Varied rounds data and created date with time & AM/PM
  const [assessments, setAssessments] = useState<AssessmentRow[]>([
    {
      id: 'ast-1',
      caseId: 'PR-126',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: 'Technical Questionnaire',
      round: 'Round 1',
      status: 'awaiting_evidence',
      score: 'Medium',
      createdDate: '1 Sept 2026, 10:30 AM',
    },
    {
      id: 'ast-2',
      caseId: 'PR-125',
      vendor: 'Directus Inc.',
      questionnaire: 'Data Protection & Privacy',
      round: 'Round 2',
      status: 'completed',
      score: 'High',
      createdDate: '28 Aug 2026, 02:15 PM',
      pastRounds: [
        {
          id: 'ast-2-r1',
          questionnaire: 'Data Protection & Privacy',
          round: 'Round 1',
          status: 'finalised',
          score: 'Medium',
          createdDate: '06 Aug 2026, 10:00 AM',
        },
      ],
    },
    {
      id: 'ast-3',
      caseId: 'PR-124',
      vendor: 'Pango Group LLC',
      questionnaire: 'Information Security & Compliance',
      round: 'Initial Review',
      status: 'completed',
      score: 'High',
      createdDate: '24 Aug 2026, 11:45 AM',
    },
    {
      id: 'ast-4',
      caseId: 'PR-123',
      vendor: 'Apex Systems Advisory',
      questionnaire: 'Technical Questionnaire',
      round: 'Stage 2 Audit',
      status: 'scheduled',
      score: '-',
      createdDate: '20 Aug 2026, 04:20 PM',
    },
    {
      id: 'ast-5',
      caseId: 'PR-122',
      vendor: 'Delphi AI Technologies',
      questionnaire: 'SOC 2 Type II Vendor Risk Assessment',
      round: 'Round 1 - Technical',
      status: 'finalised',
      score: 'High',
      createdDate: '15 Aug 2026, 09:10 AM',
    },
    {
      id: 'ast-6',
      caseId: 'PR-121',
      vendor: 'BioHealth Analytics',
      questionnaire: 'HIPAA & Healthcare Data Compliance',
      round: 'Follow-up Audit',
      status: 'awaiting_evidence',
      score: 'Low',
      createdDate: '12 Aug 2026, 03:45 PM',
      pastRounds: [
        {
          id: 'ast-6-r1',
          questionnaire: 'HIPAA & Healthcare Data Compliance',
          round: 'Round 1',
          status: 'finalised',
          score: 'Low',
          createdDate: '22 Jul 2026, 11:30 AM',
        },
      ],
    },
    {
      id: 'ast-7',
      caseId: 'PR-120',
      vendor: 'CloudScale AI Systems',
      questionnaire: 'Third-Party Software Supply Chain Security',
      round: 'Round 3',
      status: 'completed',
      score: 'High',
      createdDate: '10 Aug 2026, 01:25 PM',
      pastRounds: [
        {
          id: 'ast-7-r2',
          questionnaire: 'Third-Party Software Supply Chain Security',
          round: 'Round 2',
          status: 'finalised',
          score: 'Medium',
          createdDate: '27 Jul 2026, 03:10 PM',
        },
        {
          id: 'ast-7-r1',
          questionnaire: 'Third-Party Software Supply Chain Security',
          round: 'Round 1',
          status: 'finalised',
          score: 'Low',
          createdDate: '09 Jul 2026, 10:40 AM',
        },
      ],
    },
    {
      id: 'ast-8',
      caseId: 'PR-119',
      vendor: 'CyberGuard Solutions',
      questionnaire: 'ISO 27001 ISMS Security Checklist',
      round: 'Annual Re-evaluation',
      status: 'completed',
      score: 'High',
      createdDate: '08 Aug 2026, 11:10 AM',
    },
    {
      id: 'ast-9',
      caseId: 'PR-118',
      vendor: 'HealthCloud Telemetry',
      questionnaire: 'Cloud Infrastructure Audit Questionnaire',
      round: 'Stage 1 Discovery',
      status: 'finalised',
      score: 'High',
      createdDate: '05 Aug 2026, 05:50 PM',
    },
    {
      id: 'ast-10',
      caseId: 'PR-117',
      vendor: 'PharmaTech Analytics',
      questionnaire: 'Clinical AI Safety & Ethics Questionnaire',
      round: 'Pre-onboarding',
      status: 'completed',
      score: 'Medium',
      createdDate: '01 Aug 2026, 09:30 AM',
    },
    {
      id: 'ast-11',
      caseId: 'PR-116',
      vendor: 'MedSec Audit Co',
      questionnaire: 'UAE DOH Health Data Residency Compliance',
      round: 'Round 2 - Compliance',
      status: 'awaiting_evidence',
      score: 'Low',
      createdDate: '28 Jul 2026, 04:15 PM',
      pastRounds: [
        {
          id: 'ast-11-r1',
          questionnaire: 'UAE DOH Health Data Residency Compliance',
          round: 'Round 1 - Compliance',
          status: 'finalised',
          score: 'Low',
          createdDate: '07 Jul 2026, 09:15 AM',
        },
      ],
    },
    {
      id: 'ast-12',
      caseId: 'PR-115',
      vendor: 'Global Diagnostics IT',
      questionnaire: 'Business Continuity & Disaster Recovery Audit',
      round: 'Final Review',
      status: 'finalised',
      score: 'High',
      createdDate: '25 Jul 2026, 02:00 PM',
    },
  ])

  // KPI Card data calculations
  const completedAssessments = assessments.filter((a) => a.status === 'completed').length
  const finalizedAssessments = assessments.filter((a) => a.status === 'finalised').length

  // Filter chips click options
  const filterOptions = [
    { key: 'all', label: 'All assessments', count: assessments.length },
    {
      key: 'awaiting_evidence',
      label: 'Awaiting evidence',
      count: assessments.filter((a) => a.status === 'awaiting_evidence').length,
    },
    { key: 'completed', label: 'Completed', count: completedAssessments },
    { key: 'finalised', label: 'Finalised', count: finalizedAssessments },
    {
      key: 'scheduled',
      label: 'Scheduled',
      count: assessments.filter((a) => a.status === 'scheduled').length,
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
      count: assessments.filter((a) => a.status === 'cancelled').length,
    },
  ]

  const handleFilterClick = (key: string) => {
    setSelectedStatusFilter(key)
    setCurrentPage(1)
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  // Filtered dataset
  const filteredAssessments = useMemo(() => {
    return assessments.filter((item) => {
      const matchesStatus = selectedStatusFilter === 'all' || item.status === selectedStatusFilter
      const matchesSearch =
        item.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.questionnaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.round.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilters =
        (!assessmentFilters.vendor || item.vendor === assessmentFilters.vendor) &&
        (!assessmentFilters.status || STATUS_LABELS[item.status] === assessmentFilters.status) &&
        (!assessmentFilters.confidence || item.score === assessmentFilters.confidence) &&
        (!assessmentFilters.questionnaire ||
          item.questionnaire === assessmentFilters.questionnaire) &&
        (!assessmentFilters.rounds ||
          (assessmentFilters.rounds === 'Multiple rounds') === Boolean(item.pastRounds?.length))
      return matchesStatus && matchesSearch && matchesFilters
    })
  }, [assessments, selectedStatusFilter, searchTerm, assessmentFilters])

  // Filter options are built from the assessments currently listed
  const assessmentFilterFields = useMemo(() => {
    const unique = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b))
    return [
      { key: 'vendor', label: 'Vendor name', options: unique(assessments.map((a) => a.vendor)) },
      {
        key: 'status',
        label: 'Status',
        options: unique(assessments.map((a) => STATUS_LABELS[a.status])),
      },
      { key: 'confidence', label: 'Confidence', options: ['High', 'Medium', 'Low'] },
      {
        key: 'questionnaire',
        label: 'Questionnaire',
        options: unique(assessments.map((a) => a.questionnaire)),
      },
      { key: 'rounds', label: 'Rounds', options: ['Single round', 'Multiple rounds'] },
    ]
  }, [assessments])

  const openAssessment = (row: AssessmentRow, round?: PastRound) => {
    const source = round ? { ...row, ...round } : row
    setSelectedAssessment({
      ...source,
      score: source.score === 'High' ? '94.0' : source.score === 'Medium' ? '72.0' : '0.0',
    })
  }

  // Pagination math (8 items per page)
  const totalPages = Math.ceil(filteredAssessments.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedAssessments = filteredAssessments.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleUpdateStatus = (
    id: string,
    newStatus: 'ready' | 'finalised' | 'completed' | 'cancelled'
  ) => {
    setAssessments((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)))
    if (selectedAssessment && selectedAssessment.id === id) {
      setSelectedAssessment((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  // Keeps reschedule / cancellation details when navigating back to the dashboard
  const handleMeetingChange = (
    id: string,
    update: { meetingDateTime: string; meetingLog: MeetingLogEntry[] }
  ) => {
    setAssessments((prev) => prev.map((a) => (a.id === id ? { ...a, ...update } : a)))
  }

  if (selectedAssessment) {
    return (
      <AssessmentDetailScreen
        assessment={selectedAssessment}
        onBack={() => setSelectedAssessment(null)}
        onStatusChange={(newStatus) => handleUpdateStatus(selectedAssessment.id, newStatus)}
        onMeetingChange={(update) => handleMeetingChange(selectedAssessment.id, update)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4 text-[#0d212c]">
      {/* Breadcrumb Menu */}
      <div className="text-xs font-semibold text-[#64748b] flex items-center gap-1.5">
        <span>M42 admin</span>
        <span>/</span>
        <span className="text-[#36c0c9] font-bold">Dashboard</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* KPI Card 1: Total Vendors */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Users className="w-5 h-5 text-[#0d212c] shrink-0" />
              <h3 className="font-bold text-xs sm:text-sm text-[#0d212c] truncate">
                Total Vendors
              </h3>
            </div>
            <div className="text-2xl font-extrabold text-[#36c0c9] shrink-0">12</div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#e2e8f0] pt-3 border-t border-[#e2e8f0]">
            <div className="flex flex-col gap-0.5 pr-2">
              <span className="text-lg font-bold text-[#0d212c]">7</span>
              <span className="text-[11px] text-[#64748b] font-medium">High confidence</span>
            </div>
            <div className="flex flex-col gap-0.5 px-3">
              <span className="text-lg font-bold text-[#0d212c]">2</span>
              <span className="text-[11px] text-[#64748b] font-medium">Medium confidence</span>
            </div>
            <div className="flex flex-col gap-0.5 pl-3">
              <span className="text-lg font-bold text-[#0d212c]">3</span>
              <span className="text-[11px] text-[#64748b] font-medium">Low confidence</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#64748b]">
            <Info className="w-3.5 h-3.5 text-[#36c0c9] shrink-0" />
            <span>Breakdown by Overall Assessment Score</span>
          </div>
        </div>

        {/* KPI Card 2: Average Rounds per Vendor */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <RefreshCw className="w-5 h-5 text-[#0d212c] shrink-0" />
              <h3 className="font-bold text-xs sm:text-sm text-[#0d212c] truncate">
                Average Rounds per Vendor
              </h3>
            </div>
            <div className="text-2xl font-extrabold text-[#36c0c9] shrink-0">2</div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#e2e8f0] pt-3 border-t border-[#e2e8f0]">
            <div className="flex flex-col gap-0.5 pr-2">
              <span className="text-lg font-bold text-[#0d212c]">8</span>
              <span className="text-[11px] text-[#64748b] font-medium">1 Round</span>
            </div>
            <div className="flex flex-col gap-0.5 px-3">
              <span className="text-lg font-bold text-[#0d212c]">3</span>
              <span className="text-[11px] text-[#64748b] font-medium">2 Rounds</span>
            </div>
            <div className="flex flex-col gap-0.5 pl-3">
              <span className="text-lg font-bold text-[#0d212c]">1</span>
              <span className="text-[11px] text-[#64748b] font-medium">3+ Rounds</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#64748b]">
            <Info className="w-3.5 h-3.5 text-[#36c0c9] shrink-0" />
            <span>Breakdown by Assessment Rounds</span>
          </div>
        </div>

        {/* KPI Card 3: Evidence backlog by age */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Folder className="w-5 h-5 text-[#0d212c] shrink-0" />
              <h3 className="font-bold text-xs sm:text-sm text-[#0d212c] truncate">
                Evidence backlog by age
              </h3>
            </div>
            <div className="text-2xl font-extrabold text-[#36c0c9] shrink-0">75</div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#e2e8f0] pt-3 border-t border-[#e2e8f0]">
            <div className="flex flex-col gap-0.5 pr-2">
              <span className="text-lg font-bold text-[#0d212c]">33</span>
              <span className="text-[11px] text-[#64748b] font-medium">0–14 days</span>
            </div>
            <div className="flex flex-col gap-0.5 px-3">
              <span className="text-lg font-bold text-[#0d212c]">8</span>
              <span className="text-[11px] text-[#64748b] font-medium">15–30 days</span>
            </div>
            <div className="flex flex-col gap-0.5 pl-3">
              <span className="text-lg font-bold text-[#0d212c]">34</span>
              <span className="text-[11px] text-[#64748b] font-medium">Over 30 days</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#64748b]">
            <Info className="w-3.5 h-3.5 text-[#36c0c9] shrink-0" />
            <span>Breakdown by Ageing Bucket for Awaiting Evidence status</span>
          </div>
        </div>
      </div>

      {/* Assessments Title & Search Bar Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <h2 className="text-xl font-extrabold text-[#0d212c]">Assessments</h2>
        <div className="flex items-stretch gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-80 shrink-0">
            <SearchBar
              placeholder="Search vendor name, questionnaire..."
              onSearch={handleSearchChange}
            />
          </div>
          <FilterMenu
            fields={assessmentFilterFields}
            values={assessmentFilters}
            onChange={(values) => {
              setAssessmentFilters(values)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      {/* Filter Chips (below Title & Search Bar row) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterOptions.map((chip) => {
          const isSelected = selectedStatusFilter === chip.key
          return (
            <button
              key={chip.key}
              onClick={() => handleFilterClick(chip.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#36c0c9] text-white font-bold shadow-xs'
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

      {/* Vendor Assessments Directory Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xs overflow-hidden w-full flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] text-xs font-bold">
                <th className="py-3.5 px-4 whitespace-nowrap">Case ID</th>
                <th className="py-3.5 px-4">Vendor</th>
                <th className="py-3.5 px-4">Questionnaire</th>
                <th className="py-3.5 px-4">Round</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Confidence Level</th>
                <th className="py-3.5 px-4">Created date</th>
                <th className="py-3.5 px-4 w-12">
                  <span className="sr-only">Rounds</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]/60">
              {paginatedAssessments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#64748b] text-sm">
                    No assessments matching search criteria.
                  </td>
                </tr>
              ) : (
                paginatedAssessments.map((row) => {
                  const hasPastRounds = Boolean(row.pastRounds?.length)
                  const isExpanded = hasPastRounds && Boolean(expandedRows[row.id])
                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        onClick={() => openAssessment(row)}
                        className="hover:bg-[#f8fafc] transition cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-bold text-xs text-[#0d212c] whitespace-nowrap">
                          {row.caseId}
                        </td>
                        <td
                          className="py-3.5 px-4 font-semibold text-xs text-[#0d212c] group-hover:text-[#36c0c9] truncate"
                          title={row.vendor}
                        >
                          {row.vendor}
                        </td>
                        <td
                          className="py-3.5 px-4 text-xs text-[#0d212c] truncate"
                          title={row.questionnaire}
                        >
                          {row.questionnaire}
                        </td>
                        <td
                          className="py-3.5 px-4 text-[#64748b] text-xs font-medium"
                          title={row.round}
                        >
                          {row.round}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusChip
                            label={STATUS_LABELS[row.status]}
                            status={getStatusChipStatus(row.status)}
                            dot={false}
                          />
                        </td>
                        <td className="py-3.5 px-4">
                          {row.score === '-' ? (
                            <span className="text-[#64748b] font-[#64748b] text-xs pl-2.5">-</span>
                          ) : (
                            <StatusChip
                              label={row.score}
                              status={row.score === 'High' ? 'success' : 'warning'}
                              dot={false}
                            />
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748b] text-xs font-medium">
                          {row.createdDate}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {hasPastRounds && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedRows((prev) => ({ ...prev, [row.id]: !prev[row.id] }))
                              }}
                              aria-expanded={isExpanded}
                              aria-label={`${isExpanded ? 'Hide' : 'Show'} all rounds for ${row.caseId}`}
                              title={isExpanded ? 'Hide earlier rounds' : 'Show all rounds'}
                              className={`w-7 h-7 border-0 bg-transparent p-0 text-[#64748b] hover:text-[#0d212c] inline-flex items-center justify-center transition cursor-pointer focus:opacity-100 ${
                                isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                              }`}
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                          )}
                        </td>
                      </tr>

                      {/* Earlier rounds conducted for this case, newest first */}
                      {isExpanded &&
                        row.pastRounds?.map((round) => (
                          <tr
                            key={round.id}
                            onClick={() => openAssessment(row, round)}
                            className="bg-[#f8fafc]/70 hover:bg-[#f1f5f9] transition cursor-pointer animate-in fade-in duration-150"
                          >
                            <td className="py-3 px-4 text-xs text-[#64748b] whitespace-nowrap">
                              {row.caseId}
                            </td>
                            <td
                              className="py-3 px-4 font-semibold text-xs text-[#0d212c] truncate"
                              title={row.vendor}
                            >
                              {row.vendor}
                            </td>
                            <td
                              className="py-3 px-4 text-xs text-[#0d212c] truncate"
                              title={round.questionnaire}
                            >
                              {round.questionnaire}
                            </td>
                            <td className="py-3 px-4 text-[#64748b] text-xs font-medium">
                              {round.round}
                            </td>
                            <td className="py-3 px-4">
                              <StatusChip
                                label={STATUS_LABELS[round.status]}
                                status={getStatusChipStatus(round.status)}
                                dot={false}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <StatusChip
                                label={round.score}
                                status={round.score === 'High' ? 'success' : 'warning'}
                                dot={false}
                              />
                            </td>
                            <td className="py-3 px-4 text-[#64748b] text-xs font-medium">
                              {round.createdDate}
                            </td>
                            <td />
                          </tr>
                        ))}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 6 Items per page Pagination Footer (Requirement 1) */}
        {filteredAssessments.length > 0 && (
          <div className="flex items-[#64748b] justify-between px-4 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
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
    </div>
  )
}
