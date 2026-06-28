import { BookingForm } from '@/components/booking-form'
import { TokenTracker } from '@/components/token-tracker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata = {
  title: 'Citizen - QueueBridge',
  description: 'Book appointments and track your queue position',
}

export default function CitizenPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">QueueBridge</h1>
          <p className="text-xl text-neutral-600">
            Book appointments and track your queue position in real-time
          </p>
        </div>

        <Tabs defaultValue="book" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="book">Book Appointment</TabsTrigger>
            <TabsTrigger value="track">Track Position</TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="w-full">
            <div className="bg-white rounded-lg border border-neutral-200 p-8">
              <BookingForm />
            </div>
          </TabsContent>

          <TabsContent value="track" className="w-full">
            <div className="bg-white rounded-lg border border-neutral-200 p-8">
              <TokenTracker />
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl">🎫</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Get Your Token</h3>
            <p className="text-neutral-600 text-sm">
              Book an appointment and receive a unique token for queue tracking
            </p>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl">📍</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Track Position</h3>
            <p className="text-neutral-600 text-sm">
              View your real-time position in queue and estimated wait time
            </p>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl">🔔</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Get Notified</h3>
            <p className="text-neutral-600 text-sm">
              Receive instant notifications when you&apos;re called or approaching
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
