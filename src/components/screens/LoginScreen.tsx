'use client'

import React, { useState } from 'react'
import {
  ArrowLeft,
  Fingerprint,
  Info,
  Loader2,
  ShieldCheck,
  Users,
  PieChart,
  Lock,
} from 'lucide-react'

interface LoginScreenProps {
  onLogin: (username: string) => void
  onVendorLogin: () => void
}

// Prototype-only profile picker shown after SSO
const PROFILES = [
  {
    key: 'vendor',
    title: 'Vendor Evidence Uploader',
    subtitle: 'Follow-up answers and evidence upload',
  },
  { key: 'admin', title: 'TDD Admin', subtitle: 'zaid.alali@m42.ae' },
] as const

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onVendorLogin }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [showProfiles, setShowProfiles] = useState(false)

  const handleSelectProfile = (key: (typeof PROFILES)[number]['key']) => {
    if (key === 'vendor') {
      onVendorLogin()
      return
    }
    setIsAuthenticating(true)
    setTimeout(() => {
      onLogin('zaid.alali@m42.ae')
    }, 800)
  }

  if (isAuthenticating) {
    return (
      <div className="fixed inset-0 bg-[#f8f9fc] flex items-center justify-center z-50 animate-in fade-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="text-[#0d212c] mb-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#0d212c]" />
          </div>
          <h2 className="text-[20px] font-semibold text-[#0d212c] mb-2">
            Setting up your workspace...
          </h2>
          <p className="text-[14px] text-slate-500">
            Preparing the M42 Tech Due Diligence environment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f8f9fc] font-sans antialiased text-[#0d212c]">
      {/* Left Side — Information Panel with requested #D9E6EB background color */}
      <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center relative bg-[#D9E6EB] border-r border-[#e2e8f0]">
        <div className="max-w-md mx-auto w-full flex flex-col gap-8">
          {/* Header Brand: Dark Logo PNG without background */}
          <div className="flex items-center gap-3">
            <img
              src="/dark-logo.png"
              alt="M42 logo"
              className="h-8 w-auto object-contain shrink-0"
            />
            <span className="font-semibold text-xl text-[#0d212c] tracking-tight">
              Tech Due Diligence
            </span>
          </div>

          <div>
            <p className="text-slate-600 text-base leading-relaxed font-normal">
              M42 Tech Due Diligence gives procurement and compliance teams a single, auditable view
              of every supplier relationship.
            </p>
          </div>

          {/* Feature points */}
          <div className="space-y-6 pt-2">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-6 h-6 text-[#0f766e] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-[#0d212c] text-sm">Trusted & secure</h3>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  Enterprise-grade security with Single Sign-On and role-based access.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Users className="w-6 h-6 text-[#0f766e] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-[#0d212c] text-sm">Collaborative</h3>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  Align procurement, compliance and vendors in one unified workspace.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <PieChart className="w-6 h-6 text-[#0f766e] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-[#0d212c] text-sm">Actionable insights</h3>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  Get real-time visibility and make confident, data-driven decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side — Login Panel */}
      <div className="flex-1 bg-white p-8 lg:p-16 flex items-center justify-center">
        {showProfiles ? (
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-8 sm:p-10 shadow-xs flex flex-col animate-in fade-in duration-200">
            <button
              onClick={() => setShowProfiles(false)}
              className="self-start inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#0d212c] transition cursor-pointer bg-transparent border-0 p-0 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </button>

            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-[#0d212c] tracking-tight">Select Profile</h2>
              <div className="relative group">
                <Info className="w-4 h-4 text-slate-400 hover:text-[#0d212c] transition cursor-pointer" />
                <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute left-1/2 -translate-x-1/2 bottom-7 z-50 w-72 bg-[#0d212c] text-white text-xs p-3 rounded-xl shadow-xl text-center leading-relaxed font-normal">
                  This is for the prototype navigation purpose not to be included in the actual
                  developed application.
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {PROFILES.map((profile) => (
                <button
                  key={profile.key}
                  onClick={() => handleSelectProfile(profile.key)}
                  className="w-full text-left bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-xs hover:shadow-md hover:border-[#36c0c9]/30 transition-all cursor-pointer"
                >
                  <div className="font-semibold text-[15px] text-[#0d212c]">{profile.title}</div>
                  <div className="text-[13px] text-gray-500 mt-0.5">{profile.subtitle}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Session credentials authenticated via M42 SSO Gateway</span>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center shadow-xs flex flex-col items-center">
            {/* Welcome Text */}
            <h2 className="text-2xl font-bold text-[#0d212c] mb-2 tracking-tight">Welcome</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
              Sign in with your organisational account
            </p>

            {/* Sign in with SSO Action Button */}
            <button
              onClick={() => setShowProfiles(true)}
              className="w-full flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-4 text-left shadow-xs hover:shadow-md hover:border-[#36c0c9]/30 transition-all group cursor-pointer mb-6"
            >
              <div className="mt-0.5 bg-gray-50 p-2 rounded-lg group-hover:bg-[#36c0c9]/10 transition-colors">
                <Fingerprint className="w-5 h-5 text-gray-500 group-hover:text-[#36c0c9] transition-colors" />
              </div>
              <div className="mt-1">
                <div className="font-semibold text-[15px] text-[#0d212c] group-hover:text-[#36c0c9] transition-colors">
                  Sign in with SSO
                </div>
                <div className="text-[13px] text-gray-500 mt-0.5">
                  Authenticate via your enterprise network
                </div>
              </div>
            </button>

            {/* Protected Note Text aligned from top per user instructions */}
            <div className="flex items-start justify-center gap-2 text-xs text-slate-500 text-left sm:text-center w-full">
              <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
              <span>
                Protected by your organization&apos;s Single Sign-On.{' '}
                <span className="block sm:inline">
                  Need help?{' '}
                  <a
                    href="mailto:support@m42.ae"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('For SSO support, contact support@m42.ae')
                    }}
                    className="text-[#0f766e] font-semibold hover:underline inline-block"
                  >
                    Contact your administrator.
                  </a>
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
