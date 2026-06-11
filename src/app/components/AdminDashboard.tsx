import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LogOut, Calendar, Mail, Phone, Users, MessageSquare, Clock, Filter, Search, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import {
  GoldLineFloral,
  WatercolorPoppy,
  BabysBreath,
  FloralDivider,
  FloatingPetals
} from './FloralDecoration';



interface Submission {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  message: string;
  submittedAt: string;
}

interface AdminDashboardProps {
  accessToken: string;
  onLogout: () => void;
}

export function AdminDashboard({ accessToken, onLogout }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(
        '/api/admin/submissions',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch submissions');
      }

      const data = await response.json();
      setSubmissions(data.submissions || []);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch = 
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.phone.includes(searchTerm);
    
    const matchesFilter = 
      filterType === 'all' || submission.eventType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const eventTypes = ['all', ...new Set(submissions.map(s => s.eventType))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF5EB] via-[#FCFAF2] to-[#EADBC8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C5A880]/30 border-t-[#C5A880] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#C5A880] font-light" style={{ fontFamily: 'var(--font-body)' }}>Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EB] via-[#FCFAF2] to-[#EADBC8] relative overflow-x-hidden">
      {/* Floating Petals Micro-animation */}
      <FloatingPetals />

      {/* Background elegant floral watermarks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <WatercolorPoppy position="top-left" size="xl" opacity={0.2} />
        <GoldLineFloral position="top-right" size="xl" opacity={0.25} />
        <BabysBreath position="bottom-left" size="xl" opacity={0.25} />
        <GoldLineFloral position="bottom-right" size="xl" opacity={0.25} className="rotate-180" />
        <WatercolorPoppy position="center" size="full" opacity={0.03} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-[#FCFAF2]/85 backdrop-blur-md border-b border-[#C5A880]/20 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Camera className="w-6 h-6 text-[#C5A880]" />
              <h1 className="text-2xl font-light text-[#2E2820]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Admin Dashboard
              </h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-[#FDFDFB] border border-[#C5A880]/30 hover:border-[#C5A880] text-[#C5A880] hover:text-[#2E2820] rounded-lg transition-all cursor-pointer font-medium text-sm shadow-[0_2px_8px_rgba(197,168,128,0.05)]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="backdrop-blur-xl bg-[#FCFAF2]/90 border border-[#C5A880]/20 rounded-xl shadow-[0_6px_20px_rgba(197,168,128,0.04)] p-6 relative overflow-hidden">
              <GoldLineFloral position="absolute" className="-bottom-8 -right-8 w-20 h-20 rotate-180" size="xs" opacity={0.2} />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FCFAF2] via-[#FAF5EB] to-[#EADBC8] rounded-lg flex items-center justify-center shadow-[0_4px_12px_rgba(197,168,128,0.1)]">
                  <Users className="w-6 h-6 text-[#C5A880]" />
                </div>
                <div>
                  <p className="text-sm text-[#8B8074]" style={{ fontFamily: 'var(--font-body)' }}>Total Submissions</p>
                  <p className="text-2xl font-semibold text-[#2E2820]" style={{ fontFamily: 'var(--font-display)' }}>
                    {submissions.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-[#FCFAF2]/90 border border-[#C5A880]/20 rounded-xl shadow-[0_6px_20px_rgba(197,168,128,0.04)] p-6 relative overflow-hidden">
              <GoldLineFloral position="absolute" className="-bottom-8 -right-8 w-20 h-20 rotate-180" size="xs" opacity={0.2} />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FCFAF2] via-[#FAF5EB] to-[#EADBC8] rounded-lg flex items-center justify-center shadow-[0_4px_12px_rgba(197,168,128,0.1)]">
                  <Calendar className="w-6 h-6 text-[#C5A880]" />
                </div>
                <div>
                  <p className="text-sm text-[#8B8074]" style={{ fontFamily: 'var(--font-body)' }}>This Month</p>
                  <p className="text-2xl font-semibold text-[#2E2820]" style={{ fontFamily: 'var(--font-display)' }}>
                    {submissions.filter(s => {
                      const submittedDate = new Date(s.submittedAt);
                      const now = new Date();
                      return submittedDate.getMonth() === now.getMonth() && 
                             submittedDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-[#FCFAF2]/90 border border-[#C5A880]/20 rounded-xl shadow-[0_6px_20px_rgba(197,168,128,0.04)] p-6 relative overflow-hidden">
              <GoldLineFloral position="absolute" className="-bottom-8 -right-8 w-20 h-20 rotate-180" size="xs" opacity={0.2} />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FCFAF2] via-[#FAF5EB] to-[#EADBC8] rounded-lg flex items-center justify-center shadow-[0_4px_12px_rgba(197,168,128,0.1)]">
                  <Clock className="w-6 h-6 text-[#C5A880]" />
                </div>
                <div>
                  <p className="text-sm text-[#8B8074]" style={{ fontFamily: 'var(--font-body)' }}>Last 7 Days</p>
                  <p className="text-2xl font-semibold text-[#2E2820]" style={{ fontFamily: 'var(--font-display)' }}>
                    {submissions.filter(s => {
                      const submittedDate = new Date(s.submittedAt);
                      const sevenDaysAgo = new Date();
                      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                      return submittedDate >= sevenDaysAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="backdrop-blur-xl bg-[#FCFAF2]/90 border border-[#C5A880]/20 rounded-xl shadow-[0_6px_20px_rgba(197,168,128,0.04)] p-6 mb-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-4 relative z-10">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B8074]" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#FDFDFB] border border-[#C5A880]/35 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B8074]" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-11 pr-10 py-3 bg-[#FDFDFB] border border-[#C5A880]/35 rounded-lg text-[#2E2820] focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all appearance-none cursor-pointer"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Events' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-4">
            {filteredSubmissions.length === 0 ? (
              <div className="backdrop-blur-xl bg-[#FCFAF2]/90 border border-[#C5A880]/20 rounded-xl shadow-[0_6px_20px_rgba(197,168,128,0.04)] p-12 text-center relative overflow-hidden">
                <GoldLineFloral position="absolute" className="-top-8 -right-8 w-20 h-20 rotate-180" size="xs" opacity={0.2} />
                <GoldLineFloral position="absolute" className="-bottom-8 -left-8 w-20 h-20" size="xs" opacity={0.2} />
                <MessageSquare className="w-16 h-16 text-[#8B8074]/60 mx-auto mb-4" />
                <p className="text-lg text-[#8B8074]" style={{ fontFamily: 'var(--font-body)' }}>
                  {searchTerm || filterType !== 'all' ? 'No submissions match your filters' : 'No submissions yet'}
                </p>
              </div>
            ) : (
              filteredSubmissions.map((submission, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden backdrop-blur-xl bg-[#FCFAF2]/90 border border-[#C5A880]/20 rounded-xl shadow-[0_6px_20px_rgba(197,168,128,0.04)] p-6 hover:shadow-[0_12px_40px_rgba(197,168,128,0.12)] hover:border-[#C5A880]/45 transition-all duration-300"
                >
                  {/* Subtle corner floral frame */}
                  <GoldLineFloral position="absolute" className="-bottom-8 -right-8 w-20 h-20 rotate-180" size="xs" opacity={0.15} />

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 relative z-10">
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-[#2E2820] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                          {submission.name}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-[#8B8074]" style={{ fontFamily: 'var(--font-body)' }}>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#8B8074]/70" />
                            <a href={`mailto:${submission.email}`} className="hover:text-[#C5A880] hover:underline transition-colors">
                              {submission.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[#8B8074]/70" />
                            <a href={`tel:${submission.phone}`} className="hover:text-[#C5A880] hover:underline transition-colors">
                              {submission.phone}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-[#8B8074] uppercase mb-1 font-semibold tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>Event Type</p>
                          <p className="text-sm font-semibold text-[#2E2820]" style={{ fontFamily: 'var(--font-body)' }}>
                            {submission.eventType}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#8B8074] uppercase mb-1 font-semibold tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>Event Date</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#8B8074]/70" />
                            <p className="text-sm font-semibold text-[#2E2820]" style={{ fontFamily: 'var(--font-body)' }}>
                              {submission.eventDate}
                            </p>
                          </div>
                        </div>
                      </div>

                      {submission.message && (
                        <div>
                          <p className="text-xs text-[#8B8074] uppercase mb-2 font-semibold tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>Message</p>
                          <p className="text-sm text-[#2E2820] bg-[#FDFDFB] border border-[#C5A880]/20 rounded-lg p-4" style={{ fontFamily: 'var(--font-body)' }}>
                            {submission.message}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="lg:text-right">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF5EB] border border-[#C5A880]/20 rounded-lg">
                        <Clock className="w-4 h-4 text-[#8B8074]/70" />
                        <div className="text-left">
                          <p className="text-xs text-[#8B8074]" style={{ fontFamily: 'var(--font-body)' }}>Submitted</p>
                          <p className="text-sm font-medium text-[#2E2820]" style={{ fontFamily: 'var(--font-body)' }}>
                            {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-xs text-[#8B8074]" style={{ fontFamily: 'var(--font-body)' }}>
                            {format(new Date(submission.submittedAt), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}