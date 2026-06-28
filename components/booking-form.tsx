'use client'

import { useState } from 'react'
import { useNotificationContext } from './notification-provider'
import { Calendar, Clock, User, Phone, Mail, CheckCircle2 } from 'lucide-react'
import { QRTicket } from './qr-ticket'

interface BookingStep {
  office: string
  service: string
  name: string
  phone: string
  email: string
  date: string
  time: string
}

export function BookingForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState<BookingStep>({
    office: '',
    service: '',
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
  })
  const [token, setToken] = useState<{ id: string; token: string; position: number } | null>(null)
  const { success, error } = useNotificationContext()

  // Sample data - would come from API in production
  const offices = [
    { id: '1', name: 'Downtown Office', location: 'Main Street' },
    { id: '2', name: 'Airport Office', location: 'Terminal 2' },
  ]

  const services = [
    { id: '1', name: 'Visa Processing', estimatedTime: 30 },
    { id: '2', name: 'Document Verification', estimatedTime: 15 },
    { id: '3', name: 'General Inquiry', estimatedTime: 10 },
  ]

  const handleInputChange = (field: keyof BookingStep, value: string) => {
    setBooking((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (step < 4) {
      setStep(step + 1)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officeId: booking.office,
          serviceId: booking.service,
          citizenName: booking.name,
          citizenPhone: booking.phone,
          citizenEmail: booking.email,
          scheduledDate: booking.date,
          scheduledTime: booking.time,
        }),
      })

      if (!response.ok) throw new Error('Booking failed')

      const data = await response.json()
      setToken({
        id: data.id,
        token: data.token,
        position: data.queuePosition,
      })
      setStep(5)
      success('Appointment booked successfully!')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s <= step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-200 text-neutral-500'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 ${
                    s < step ? 'bg-emerald-600' : 'bg-neutral-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-neutral-600">
          Step {step} of 4: {['Select Office', 'Choose Service', 'Personal Info', 'Schedule'][step - 1]}
        </p>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg border border-neutral-200 p-8 shadow-sm">
        {/* Step 1: Select Office */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Select Office</h2>
            {offices.map((office) => (
              <button
                key={office.id}
                onClick={() => handleInputChange('office', office.id)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                  booking.office === office.id
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <p className="font-semibold text-neutral-900">{office.name}</p>
                <p className="text-sm text-neutral-600">{office.location}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Choose Service */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Choose Service</h2>
            {services.map((svc) => (
              <button
                key={svc.id}
                onClick={() => handleInputChange('service', svc.id)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                  booking.service === svc.id
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <p className="font-semibold text-neutral-900">{svc.name}</p>
                <p className="text-sm text-neutral-600">Estimated time: {svc.estimatedTime} minutes</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Personal Information */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Your Information</h2>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={booking.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent placeholder-neutral-500 text-neutral-900"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={booking.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent placeholder-neutral-500 text-neutral-900"
                placeholder="Your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <Mail className="w-4 h-4 inline mr-2" />
                Email (Optional)
              </label>
              <input
                type="email"
                value={booking.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent placeholder-neutral-500 text-neutral-900"
                placeholder="your@email.com"
              />
            </div>
          </div>
        )}

        {/* Step 4: Schedule */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Schedule Appointment</h2>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-2" />
                Preferred Date
              </label>
              <input
                type="date"
                value={booking.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent placeholder-neutral-500 text-neutral-900"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <Clock className="w-4 h-4 inline mr-2" />
                Preferred Time
              </label>
              <input
                type="time"
                value={booking.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent placeholder-neutral-500 text-neutral-900"
              />
            </div>
          </div>
        )}

        {/* Step 5: Confirmation with QR Ticket */}
        {step === 5 && token && (
          <div className="py-8">
            <div className="text-center mb-8">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Appointment Confirmed!</h2>
              <p className="text-neutral-600">Your booking is confirmed. Here&apos;s your ticket:</p>
            </div>
            <QRTicket
              token={token.token}
              appointmentId={token.id}
              serviceName={booking.service ? services.find((s) => s.id === booking.service)?.name || 'Service' : 'Service'}
              scheduledTime={booking.time}
            />
          </div>
        )}
      </div>

      {/* Action buttons */}
      {step < 5 && (
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleBack}
            className="flex-1 px-6 py-3 border border-neutral-300 rounded-lg font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
            disabled={step === 1}
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || step === 1 && !booking.office || step === 2 && !booking.service || step === 3 && !booking.phone || step === 4 && (!booking.date || !booking.time)}
            className="flex-1 px-6 py-3 bg-emerald-600 rounded-lg font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : step === 4 ? 'Confirm Booking' : 'Next'}
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setStep(1)
              setToken(null)
              setBooking({
                office: '',
                service: '',
                name: '',
                phone: '',
                email: '',
                date: '',
                time: '',
              })
            }}
            className="px-6 py-3 bg-emerald-600 rounded-lg font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Book Another Appointment
          </button>
        </div>
      )}
    </div>
  )
}
