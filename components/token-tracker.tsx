'use client'

import { useState, useEffect } from 'react'
import { useNotificationContext } from './notification-provider'
import { Ticket, MapPin, Clock, Users } from 'lucide-react'

interface QueueInfo {
  token: string
  status: 'pending' | 'serving' | 'completed'
  queuePosition: number
  arrivedAt?: string
  completedAt?: string
  waitTimeMinutes?: number
}

export function TokenTracker() {
  const [token, setToken] = useState('')
  const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)
  const { info, success, error } = useNotificationContext()

  // Poll for updates when tracking
  useEffect(() => {
    if (!polling || !token) return

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/queue/position?token=${token}`)
        if (!response.ok) return

        const data = await response.json()
        setQueueInfo(data)

        // Show notifications on status changes
        if (data.status === 'serving') {
          success('Your token is being served! Please head to the counter.')
        } else if (data.queuePosition <= 3) {
          info(`You are ${data.queuePosition} positions away`)
        }
      } catch (err) {
        console.error('[v0] Polling error:', err)
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [polling, token, info, success])

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim()) {
      error('Please enter your token')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/queue/position?token=${token}`)
      if (!response.ok) throw new Error('Token not found')

      const data = await response.json()
      setQueueInfo(data)
      setPolling(true)
      success('Now tracking your position')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to fetch queue info')
      setQueueInfo(null)
      setPolling(false)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setToken('')
    setQueueInfo(null)
    setPolling(false)
  }

  const statusColors = {
    pending: 'bg-neutral-50 border-neutral-200',
    serving: 'bg-emerald-50 border-emerald-200',
    completed: 'bg-blue-50 border-blue-200',
  }

  const statusTextColors = {
    pending: 'text-neutral-800',
    serving: 'text-emerald-800',
    completed: 'text-blue-800',
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg border border-neutral-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Ticket className="w-6 h-6 text-emerald-600" />
          Track Your Queue Position
        </h2>

        {!queueInfo ? (
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Enter Your Token
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value.toUpperCase())}
                placeholder="e.g., A-047"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-mono text-lg text-center placeholder-neutral-500 text-neutral-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-emerald-600 rounded-lg font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Tracking...' : 'Track Position'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Token Display */}
            <div className={`border-2 rounded-lg p-6 text-center ${statusColors[queueInfo.status]}`}>
              <p className={`text-sm font-medium mb-2 ${statusTextColors[queueInfo.status]}`}>
                {queueInfo.status === 'pending' && 'Waiting for your turn'}
                {queueInfo.status === 'serving' && 'Your Token is Being Served'}
                {queueInfo.status === 'completed' && 'Completed'}
              </p>
              <p className="text-5xl font-bold text-neutral-900 font-mono mb-2">
                {queueInfo.token}
              </p>
            </div>

            {/* Queue Information */}
            {queueInfo.status === 'pending' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-neutral-600 mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Position in Queue</span>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">
                    {queueInfo.queuePosition || '-'}
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-neutral-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Est. Wait Time</span>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">
                    {((queueInfo.queuePosition || 1) * 15)} min
                  </p>
                </div>
              </div>
            )}

            {queueInfo.status === 'serving' && (
              <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4 text-center">
                <p className="text-lg font-semibold text-emerald-900 mb-2">
                  Please proceed to the counter
                </p>
                <p className="text-sm text-emerald-700">
                  Your service will start shortly
                </p>
                {queueInfo.waitTimeMinutes && (
                  <p className="text-sm text-emerald-700 mt-2">
                    You waited: {queueInfo.waitTimeMinutes} minutes
                  </p>
                )}
              </div>
            )}

            {queueInfo.status === 'completed' && (
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 text-center">
                <p className="text-lg font-semibold text-blue-900">
                  Service Completed
                </p>
                {queueInfo.waitTimeMinutes && (
                  <p className="text-sm text-blue-700 mt-2">
                    Total time: {queueInfo.waitTimeMinutes} minutes
                  </p>
                )}
              </div>
            )}

            {/* Details */}
            <div className="space-y-2 text-sm">
              {queueInfo.arrivedAt && (
                <div className="flex justify-between text-neutral-600">
                  <span>Service Started:</span>
                  <span>
                    {new Date(queueInfo.arrivedAt).toLocaleTimeString()}
                  </span>
                </div>
              )}
              {queueInfo.completedAt && (
                <div className="flex justify-between text-neutral-600">
                  <span>Completed:</span>
                  <span>
                    {new Date(queueInfo.completedAt).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleReset}
              className="w-full px-6 py-2 border border-neutral-300 rounded-lg font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Track Different Token
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
