import type { QuestionItem } from './QuestionnaireDetailScreen'

// Mock question banks for the questionnaires that can be dispatched on an assessment call
export const DISPATCH_QUESTIONNAIRES: { title: string; questions: QuestionItem[] }[] = [
  {
    title: 'Technical Questionnaire',
    questions: [
      {
        id: 1,
        question:
          'Describe the primary clinical or operational use cases supported by your solution.',
        responseCue:
          'Specify whether workflows are clinical, decision-support, operational, or administrative. State whether outputs influence patient care directly or indirectly.',
        researchNeeded: true,
        attachmentRequired: true,
        requiredQuestion: true,
      },
      {
        id: 2,
        question:
          'Has your organization performed a patient safety or clinical risk assessment for this product?',
        responseCue:
          'Provide documentation or summary of hazard analysis, risk register, or failure-mode analysis related to patient harm.',
        researchNeeded: false,
        attachmentRequired: true,
      },
      {
        id: 3,
        question:
          'Describe how customer data is encrypted in transit and at rest across cloud tenants.',
        responseCue:
          'Specify encryption algorithms (e.g. AES-256, TLS 1.3), key rotation policies, and HSM backing.',
        researchNeeded: true,
        attachmentRequired: true,
      },
      {
        id: 4,
        question: 'Provide proof of SOC 2 Type II or ISO/IEC 27001 certification compliance.',
        responseCue:
          'Attach executive summary or auditor attestation statement covering the last 12 months.',
        researchNeeded: false,
        attachmentRequired: true,
      },
      {
        id: 5,
        question:
          'Can customer data be strictly isolated within United Arab Emirates cloud regions?',
        responseCue:
          'Detail tenant deployment architecture, backup locations, and compliance with UAE Health Data Law.',
        researchNeeded: true,
        attachmentRequired: false,
      },
      {
        id: 6,
        question:
          'Outline your incident response SLA for reporting data breaches to affected healthcare entities.',
        responseCue:
          'Provide notification timeline (e.g., within 24 hours), triage workflows, and root cause analysis format.',
        researchNeeded: true,
        attachmentRequired: true,
      },
    ],
  },
  {
    title: 'Data Protection & Privacy',
    questions: [
      {
        id: 1,
        question:
          'Does your organisation maintain a formal data classification policy based on sensitivity level?',
        responseCue:
          'List the classification tiers (e.g. public, internal, confidential, restricted) and how they are enforced.',
        researchNeeded: false,
        attachmentRequired: true,
        requiredQuestion: true,
      },
      {
        id: 2,
        question: 'How are data subject rights requests handled within the regulatory timeframes?',
        responseCue:
          'Describe the process for access, erasure, and portability requests, including response SLAs.',
        researchNeeded: false,
        attachmentRequired: false,
      },
      {
        id: 3,
        question: 'What personal information does the solution collect, store, or process?',
        responseCue:
          'List personal and health data categories, the purpose of processing, and retention periods.',
        researchNeeded: false,
        attachmentRequired: true,
      },
      {
        id: 4,
        question: 'Is personal data shared with any sub-processors or third parties?',
        responseCue:
          'Name each sub-processor, its location, and the contractual safeguards in place.',
        researchNeeded: true,
        attachmentRequired: false,
      },
      {
        id: 5,
        question: 'How is consent captured and recorded for patients and end users?',
        responseCue:
          'Describe the consent capture flow, withdrawal options, and where consent records are stored.',
        researchNeeded: false,
        attachmentRequired: false,
      },
    ],
  },
  {
    title: 'Presight Technical & Compliance',
    questions: [
      {
        id: 1,
        question: 'Describe the hosting model and deployment architecture of the solution.',
        responseCue:
          'State whether the solution is SaaS, private cloud, or on-premise and list the hosting provider and regions.',
        researchNeeded: true,
        attachmentRequired: true,
      },
      {
        id: 2,
        question: 'Which integration standards does the solution support?',
        responseCue:
          'List supported standards such as HL7 v2, FHIR R4, and DICOM, with the message types in scope.',
        researchNeeded: false,
        attachmentRequired: false,
      },
      {
        id: 3,
        question: 'How are product releases tested and approved before going to production?',
        responseCue:
          'Describe the release pipeline, test coverage, change approval board, and rollback process.',
        researchNeeded: false,
        attachmentRequired: false,
      },
      {
        id: 4,
        question: 'What uptime commitment is provided in your service level agreement?',
        responseCue:
          'Provide the SLA percentage, maintenance windows, and service credits for breaches.',
        researchNeeded: false,
        attachmentRequired: true,
        requiredQuestion: true,
      },
      {
        id: 5,
        question: 'How is user access provisioned and reviewed across the platform?',
        responseCue:
          'Describe joiner, mover, and leaver processes, SSO support, and access review frequency.',
        researchNeeded: false,
        attachmentRequired: false,
      },
    ],
  },
  {
    title: 'Information Security & Compliance',
    questions: [
      {
        id: 1,
        question: 'Is multi-factor authentication enforced for all administrative access?',
        responseCue:
          'Specify the MFA methods supported and any accounts or systems that are exempt.',
        researchNeeded: false,
        attachmentRequired: false,
        requiredQuestion: true,
      },
      {
        id: 2,
        question: 'When was your last independent penetration test performed?',
        responseCue:
          'Attach the executive summary and state how critical and high findings were remediated.',
        researchNeeded: false,
        attachmentRequired: true,
      },
      {
        id: 3,
        question: 'How are vulnerabilities identified, prioritised, and patched?',
        responseCue:
          'Describe scanning frequency, severity-based patching timelines, and exception handling.',
        researchNeeded: false,
        attachmentRequired: false,
      },
      {
        id: 4,
        question: 'How are security events logged, monitored, and retained?',
        responseCue:
          'Describe SIEM tooling, alerting coverage, 24/7 monitoring, and log retention periods.',
        researchNeeded: true,
        attachmentRequired: false,
      },
      {
        id: 5,
        question: 'Do all staff complete security awareness training?',
        responseCue: 'State training frequency, completion rates, and phishing simulation results.',
        researchNeeded: false,
        attachmentRequired: false,
      },
    ],
  },
  {
    title: 'SOC 2 Type II Vendor Risk Assessment',
    questions: [
      {
        id: 1,
        question: 'Provide your most recent SOC 2 Type II report and its coverage period.',
        responseCue: 'Attach the report and confirm which trust service criteria are in scope.',
        researchNeeded: false,
        attachmentRequired: true,
        requiredQuestion: true,
      },
      {
        id: 2,
        question: 'Were any exceptions noted by the auditor in the last SOC 2 report?',
        responseCue: 'List each exception, the management response, and the remediation status.',
        researchNeeded: false,
        attachmentRequired: false,
      },
      {
        id: 3,
        question: 'Which complementary user entity controls are customers responsible for?',
        responseCue:
          'List the controls that must be operated by M42 for the SOC 2 controls to be effective.',
        researchNeeded: false,
        attachmentRequired: false,
      },
      {
        id: 4,
        question: 'How are carved-out sub-service organisations monitored?',
        responseCue:
          'Describe how you review the SOC reports and controls of your critical sub-service providers.',
        researchNeeded: true,
        attachmentRequired: false,
      },
    ],
  },
  {
    title: 'HIPAA & Healthcare Data Compliance Checklist',
    questions: [
      {
        id: 1,
        question: 'Will you sign a Business Associate Agreement for protected health information?',
        responseCue:
          'Confirm willingness to sign and attach your standard BAA template if available.',
        researchNeeded: false,
        attachmentRequired: true,
        requiredQuestion: true,
      },
      {
        id: 2,
        question: 'How is protected health information de-identified for analytics or testing?',
        responseCue:
          'Describe the de-identification method (safe harbour or expert determination) and re-identification controls.',
        researchNeeded: true,
        attachmentRequired: false,
      },
      {
        id: 3,
        question: 'How are access logs to patient records reviewed?',
        responseCue:
          'Describe audit log contents, review frequency, and how inappropriate access is investigated.',
        researchNeeded: false,
        attachmentRequired: false,
      },
      {
        id: 4,
        question: 'What is your breach notification process for healthcare data?',
        responseCue:
          'Provide notification timelines to covered entities and regulators, and the escalation path.',
        researchNeeded: false,
        attachmentRequired: true,
      },
    ],
  },
]

export const getDispatchQuestions = (title: string): QuestionItem[] =>
  DISPATCH_QUESTIONNAIRES.find((q) => q.title === title)?.questions ?? []
