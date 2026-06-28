'use client'

import { useState } from 'react'
import { AdminQueueDisplay } from '@/components/admin-queue-display'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'
import { BarChart3, Users, MonitorPlay, Settings, FileText, LifeBuoy, Menu, X, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [activeTab, setActiveTab] = useState<'queue' | 'analytics'>('queue')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const officeId = '1' // In production, would come from user session

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Q</span>
          </div>
          <span className="font-bold text-neutral-900">Admin</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex items-center gap-2 px-6 py-6 border-b border-neutral-200">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Q</span>
          </div>
          <span className="text-xl font-bold text-neutral-900">QueueBridge</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <p className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Main</p>
          
          <button 
            onClick={() => { setActiveTab('queue'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'queue' ? 'bg-emerald-50 text-emerald-700' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Users className="w-5 h-5" />
            Queue Management
          </button>
          
          <button 
            onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'analytics' ? 'bg-emerald-50 text-emerald-700' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>

          <p className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-6 mb-2">Tools</p>
          
          <Link 
            href="/admin/display-board" 
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <MonitorPlay className="w-5 h-5" />
            Display Board
          </Link>
          
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors w-full text-left">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors w-full text-left">
            <FileText className="w-5 h-5" />
            Reports
          </button>
          
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors w-full text-left">
            <LifeBuoy className="w-5 h-5" />
            Support
          </button>
        </div>
        
        <div className="p-4 border-t border-neutral-200">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-1">
                {activeTab === 'queue' ? 'Queue Management' : 'Analytics Dashboard'}
              </h1>
              <p className="text-neutral-600">
                {activeTab === 'queue' 
                  ? 'Manage your active queue and call customers.' 
                  : 'View metrics and performance insights.'}
              </p>
            </div>
            
            {/* Date Selector */}
            <div className="bg-white rounded-lg border border-neutral-200 p-2 shadow-sm flex items-center gap-3 shrink-0">
              <label className="font-medium text-neutral-700 pl-2 text-sm hidden sm:block">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 border border-neutral-200 rounded-md focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm w-full sm:w-auto"
              />
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-6 shadow-sm">
            {activeTab === 'queue' ? (
              <AdminQueueDisplay officeId={officeId} date={selectedDate} />
            ) : (
              <AnalyticsDashboard officeId={officeId} date={selectedDate} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
