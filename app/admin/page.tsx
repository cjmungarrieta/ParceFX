'use client';

import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  source: string;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_medium: string | null;
  created_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  // Check if already logged in
  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch leads when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  // Filter leads when search or date filter changes
  useEffect(() => {
    filterLeads();
  }, [searchTerm, dateFilter, leads]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'parcefx' && password === 'FundedHero22$') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setLeads([]);
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
        calculateStats(data.leads || []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (leadsData: Lead[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    setStats({
      total: leadsData.length,
      today: leadsData.filter(l => new Date(l.created_at) >= today).length,
      thisWeek: leadsData.filter(l => new Date(l.created_at) >= weekAgo).length,
      thisMonth: leadsData.filter(l => new Date(l.created_at) >= monthAgo).length
    });
  };

  const filterLeads = () => {
    let filtered = [...leads];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(l =>
        l.nombre.toLowerCase().includes(term) ||
        l.email.toLowerCase().includes(term) ||
        (l.telefono && l.telefono.includes(term))
      );
    }

    // Date filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(l => new Date(l.created_at) >= today);
        break;
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(l => new Date(l.created_at) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(l => new Date(l.created_at) >= monthAgo);
        break;
    }

    setFilteredLeads(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Nombre', 'Email', 'Telefono', 'Source', 'UTM Source', 'UTM Campaign', 'UTM Medium', 'Fecha'];
    const csvData = filteredLeads.map(lead => [
      lead.nombre,
      lead.email,
      lead.telefono || '',
      lead.source || '',
      lead.utm_source || '',
      lead.utm_campaign || '',
      lead.utm_medium || '',
      new Date(lead.created_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`/api/admin/leads?id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setLeads(leads.filter(l => l.id !== id));
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: '#1A1A1A',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          border: '1px solid rgba(255, 215, 0, 0.2)'
        }}>
          <h1 style={{
            color: '#FFD700',
            fontSize: '2rem',
            marginBottom: '10px',
            textAlign: 'center',
            fontWeight: '700'
          }}>
            ParceFX Admin
          </h1>
          <p style={{
            color: '#888',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            Enter your credentials to continue
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#CCC', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0D0D0D',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '1rem'
                }}
                placeholder="Enter username"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#CCC', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0D0D0D',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '1rem'
                }}
                placeholder="Enter password"
              />
            </div>

            {loginError && (
              <p style={{ color: '#EF4444', marginBottom: '20px', textAlign: 'center' }}>
                {loginError}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #FFD700, #FFED4E)',
                color: '#0D0D0D',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <h1 style={{ color: '#FFD700', fontSize: '1.8rem', fontWeight: '700' }}>
            ParceFX Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: '#888',
              border: '1px solid #444',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            { label: 'Total Leads', value: stats.total, color: '#FFD700' },
            { label: 'Today', value: stats.today, color: '#22C55E' },
            { label: 'This Week', value: stats.thisWeek, color: '#3B82F6' },
            { label: 'This Month', value: stats.thisMonth, color: '#A855F7' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#1A1A1A',
              borderRadius: '12px',
              padding: '24px',
              border: `1px solid ${stat.color}33`
            }}>
              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '8px' }}>{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '2.5rem', fontWeight: '700' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters & Actions */}
        <div style={{
          background: '#1A1A1A',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: '1',
              minWidth: '250px',
              padding: '12px 16px',
              background: '#0D0D0D',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#FFF',
              fontSize: '0.95rem'
            }}
          />

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              background: '#0D0D0D',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#FFF',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          <button
            onClick={fetchLeads}
            style={{
              padding: '12px 20px',
              background: '#333',
              color: '#FFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🔄 Refresh
          </button>

          <button
            onClick={exportToCSV}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #FFD700, #FFED4E)',
              color: '#0D0D0D',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📥 Export CSV
          </button>
        </div>

        {/* Results Count */}
        <p style={{ color: '#888', marginBottom: '15px', fontSize: '0.9rem' }}>
          Showing {filteredLeads.length} of {leads.length} leads
        </p>

        {/* Leads Table */}
        <div style={{
          background: '#1A1A1A',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #333'
        }}>
          {isLoading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
              Loading leads...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
              No leads found
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0D0D0D' }}>
                    {['Name', 'Email', 'Phone', 'Source', 'UTM', 'Date', 'Actions'].map((header, i) => (
                      <th key={i} style={{
                        padding: '16px',
                        textAlign: 'left',
                        color: '#FFD700',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '1px solid #333'
                      }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, index) => (
                    <tr key={lead.id} style={{
                      background: index % 2 === 0 ? '#1A1A1A' : '#151515',
                      transition: 'background 0.2s'
                    }}>
                      <td style={{ padding: '14px 16px', color: '#FFF', fontWeight: '500' }}>
                        {lead.nombre}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#CCC' }}>
                        <a href={`mailto:${lead.email}`} style={{ color: '#3B82F6', textDecoration: 'none' }}>
                          {lead.email}
                        </a>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#CCC' }}>
                        {lead.telefono || '-'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#888', fontSize: '0.9rem' }}>
                        {lead.source || 'landing_page'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#888', fontSize: '0.85rem' }}>
                        {lead.utm_source && (
                          <span style={{
                            background: '#333',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            marginRight: '4px'
                          }}>
                            {lead.utm_source}
                          </span>
                        )}
                        {lead.utm_campaign && (
                          <span style={{
                            background: '#333',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            {lead.utm_campaign}
                          </span>
                        )}
                        {!lead.utm_source && !lead.utm_campaign && '-'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#888', fontSize: '0.9rem' }}>
                        {new Date(lead.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
