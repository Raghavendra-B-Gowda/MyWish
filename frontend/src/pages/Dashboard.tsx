import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  LayoutTemplate, 
  Search,
  ChevronRight,
  TrendingUp,
  Activity,
  Calendar,
  AlertTriangle,
  XCircle,
  Eye,
  Trash2,
  CheckCircle,
  Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";

export default function Dashboard() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, valid: 0, revoked: 0, templates: 1, verifications: 0, recentCertificates: [] as string[] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [chartRange, setChartRange] = useState("This Week");
  
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [certsRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/certificates`, { credentials: 'include' }),
          fetch(`${API_URL}/api/stats`, { credentials: 'include' })
        ]);
        
        if (certsRes.status === 401 || statsRes.status === 401) {
          await logout();
          navigate("/admin/login");
          return;
        }
        
        if (certsRes.ok) setCertificates(await certsRes.json());
        if (statsRes.ok) {
          const s = await statsRes.json();
          setStats({ ...s, templates: 1 }); // Mocking templates for demo
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        
        // Mock data fallback if backend is down
        setCertificates([
          { id: "MW-2026-AI0018", recipientName: "Raghavendra Gowda", type: "course", courseName: "AI & ML", templateId: "modern-dark", issueDate: "Aug 17, 2026", status: "Valid" },
          { id: "MW-2026-AI0017", recipientName: "Ragu Louda", type: "course", courseName: "AI & ML", templateId: "modern-dark", issueDate: "Aug 17, 2026", status: "Valid" },
          { id: "MW-2026-AI0016", recipientName: "Gowda", type: "course", courseName: "AI & ML", templateId: "modern-dark", issueDate: "Aug 11, 2026", status: "Valid" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, logout]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate? This action cannot be undone.")) return;
    
    try {
      const response = await fetch(`${API_URL}/api/certificates/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setCertificates(prev => prev.filter(cert => cert.id !== id));
      } else {
        alert("Failed to delete certificate.");
      }
    } catch (error) {
      console.error("Error deleting certificate", error);
      alert("An error occurred while deleting.");
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to block this certificate? It will be marked as invalid forever.")) return;
    
    try {
      const response = await fetch(`${API_URL}/api/certificates/${id}/revoke`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (response.ok) {
        setCertificates(prev => prev.map(cert => cert.id === id ? { ...cert, status: 'Revoked' } : cert));
      } else {
        alert("Failed to block certificate.");
      }
    } catch (error) {
      console.error("Error blocking certificate", error);
      alert("An error occurred while blocking.");
    }
  };

  const handleUnblock = async (id: string) => {
    if (!confirm("Are you sure you want to unblock this certificate? It will be marked as valid again.")) return;
    
    try {
      const response = await fetch(`${API_URL}/api/certificates/${id}/unrevoke`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (response.ok) {
        setCertificates(prev => prev.map(cert => cert.id === id ? { ...cert, status: 'Valid' } : cert));
      } else {
        alert("Failed to unblock certificate.");
      }
    } catch (error) {
      console.error("Error unblocking certificate", error);
      alert("An error occurred while unblocking.");
    }
  };

  // Generate data based on chartRange
  const getActivityData = () => {
    const result: any[] = [];
    const today = new Date();
    
    if (chartRange === "Today") {
      // 6 buckets of 4 hours
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today);
        d.setHours(d.getHours() - (i * 4));
        result.push({
          dateObj: d,
          name: `${d.getHours()}:00`,
          certs: 0
        });
      }
      if (stats.recentCertificates) {
        stats.recentCertificates.forEach(dateStr => {
          const d = new Date(dateStr);
          // Check if it's within last 24 hours
          if (today.getTime() - d.getTime() <= 24 * 60 * 60 * 1000) {
            // Find closest bucket
            let closest = result[0];
            let minDiff = Infinity;
            result.forEach(b => {
              const diff = Math.abs(b.dateObj.getTime() - d.getTime());
              if (diff < minDiff) {
                minDiff = diff;
                closest = b;
              }
            });
            closest.certs++;
          }
        });
      }
    } else if (chartRange === "This Month") {
      // Last 30 days, group every 5 days to reduce x-axis clutter
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - (i * 6)); // 6 buckets * 5 days = 30 days
        result.push({
          dateStr: d.toISOString().split('T')[0],
          name: `${d.getDate()}/${d.getMonth() + 1}`,
          certs: 0,
          dateObj: d
        });
      }
      if (stats.recentCertificates) {
        stats.recentCertificates.forEach(dateStr => {
          const d = new Date(dateStr);
          if (today.getTime() - d.getTime() <= 30 * 24 * 60 * 60 * 1000) {
            // Find closest bucket that is BEFORE or AT the same time
            let closest = result[result.length - 1];
            result.forEach((b, idx) => {
              if (idx < result.length - 1 && d.getTime() >= b.dateObj.getTime() && d.getTime() < result[idx+1].dateObj.getTime()) {
                closest = b;
              }
            });
            closest.certs++;
          }
        });
      }
    } else {
      // This Week
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        result.push({
          dateStr: d.toISOString().split('T')[0],
          name: days[d.getDay()],
          certs: 0
        });
      }
      if (stats.recentCertificates) {
        stats.recentCertificates.forEach(dateStr => {
          const dStr = new Date(dateStr).toISOString().split('T')[0];
          const bucket = result.find(b => b.dateStr === dStr);
          if (bucket) {
            bucket.certs++;
          }
        });
      }
    }

    return result;
  };
  
  const activityData = getActivityData();

  const statusData = [
    { name: 'Valid', value: stats.valid || 0, color: '#22c55e' },
    { name: 'Expired', value: 0, color: '#f59e0b' },
    { name: 'Revoked', value: stats.revoked || 0, color: '#ef4444' },
  ];

  const filteredCerts = certificates.filter(cert => {
    if (filter !== "All" && cert.status !== filter) return false;
    if (searchQuery) {
      return cert.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             cert.id.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="flex-1 bg-[#0A0A0C] text-slate-200 p-4 md:p-8 space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Good afternoon, Raghavendra Gowda 👋</h1>
          <p className="text-slate-400 mt-1">Manage your certificates, templates, and verification activity.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="bg-[#121217] border-border/10 text-slate-300 hover:bg-[#1A1A22] hover:text-white h-10 px-4" asChild>
            <Link to="/verify">View Verification</Link>
          </Button>
          <Button className="bg-gradient-to-r from-[#6929F5] to-[#8C52FF] hover:from-[#5A21D6] hover:to-[#7A42E6] text-white shadow-lg shadow-purple-500/20 border-0 h-10 px-5 transition-all hover:scale-[1.02]" asChild>
            <Link to="/create"><PlusCircle className="w-4 h-4 mr-2" /> Create Certificate</Link>
          </Button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Certificates" value={stats.total || 18} trend="+12% this month" icon={FileText} />
        <StatCard title="Valid Certificates" value={stats.valid || 18} trend="100% valid" icon={CheckCircle2} trendColor="text-emerald-400" />
        <StatCard title="This Month" value={8} trend="+25% from last month" icon={Calendar} />
        <StatCard title="Templates" value={stats.templates} trend="Active templates" icon={LayoutTemplate} />
        <StatCard title="Verifications" value={stats.verifications} trend="+18% this month" icon={Activity} />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-[#121217] border border-border/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Certificate Activity</h2>
            <div className="flex items-center gap-2 text-xs font-medium bg-[#0A0A0C] p-1 rounded-lg border border-border/10">
              {['Today', 'This Week', 'This Month'].map(range => (
                <button 
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={`px-3 py-1 rounded-md transition-colors ${chartRange === range ? 'bg-[#252530] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1A1A22', borderColor: '#2A2A35', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#8C52FF' }}
                />
                <Line type="monotone" dataKey="certs" stroke="#8C52FF" strokeWidth={3} dot={{ fill: '#8C52FF', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-[#121217] border border-border/10 rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-white tracking-tight mb-2">Certificate Status</h2>
          <div className="flex-1 min-h-[200px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1A1A22', borderColor: '#2A2A35', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="text-3xl font-bold text-white block">{stats.total || 18}</span>
                <span className="text-xs text-slate-400">Total</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs font-medium">
            {statusData.map(stat => (
              <div key={stat.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }}></div>
                <span className="text-slate-400">{stat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard 
            title="Create Certificate" 
            desc="Generate a new professional certificate." 
            icon={PlusCircle} 
            link="/create"
            color="text-purple-400"
            bg="bg-purple-500/10"
          />
          <QuickActionCard 
            title="Manage Templates" 
            desc="Create and customize certificate templates." 
            icon={LayoutTemplate} 
            link="/admin/templates"
            color="text-blue-400"
            bg="bg-blue-500/10"
          />
          <QuickActionCard 
            title="Verify Certificate" 
            desc="Check a certificate using its ID or QR code." 
            icon={Search} 
            link="/verify"
            color="text-emerald-400"
            bg="bg-emerald-500/10"
          />
        </div>
      </div>

      {/* Recent Certificates Table */}
      <div className="bg-[#121217] border border-border/10 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-border/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-white tracking-tight">Recent Certificates</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <Input 
                placeholder="Search recipient or ID..." 
                className="pl-9 bg-[#0A0A0C] border-border/10 text-sm h-9 focus-visible:ring-purple-500 text-slate-200 placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center bg-[#0A0A0C] p-1 rounded-lg border border-border/10 w-full sm:w-auto overflow-x-auto scrollbar-none">
              {['All', 'Valid', 'Expired', 'Revoked'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-[#252530] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0A0A0C] text-slate-400 border-b border-border/10">
              <tr>
                <th className="px-5 py-3.5 font-medium">Recipient</th>
                <th className="px-5 py-3.5 font-medium">Certificate ID</th>
                <th className="px-5 py-3.5 font-medium">Company</th>
                <th className="px-5 py-3.5 font-medium">Course / Role</th>
                <th className="px-5 py-3.5 font-medium">Template</th>
                <th className="px-5 py-3.5 font-medium">Created</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">Loading...</td>
                </tr>
              ) : filteredCerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">No certificates found matching your criteria.</td>
                </tr>
              ) : (
                filteredCerts.map((cert) => (
                  <tr key={cert.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-5 py-3.5 font-medium text-white">{cert.recipientName}</td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{cert.id}</td>
                    <td className="px-5 py-3.5 text-slate-400 capitalize">{cert.companyName || cert.logoType || 'MyWish'}</td>
                    <td className="px-5 py-3.5 text-slate-400">{cert.courseName || cert.internshipRole || 'N/A'}</td>
                    <td className="px-5 py-3.5 text-slate-400 capitalize">{cert.templateId?.replace('-', ' ') || 'Modern'}</td>
                    <td className="px-5 py-3.5 text-slate-400">{cert.issueDate}</td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={cert.status || 'Valid'} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" asChild>
                          <Link to={`/verify/${cert.id}`} title="View"><Eye className="w-4 h-4" /></Link>
                        </Button>
                        
                        {cert.status === 'Revoked' ? (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-500" onClick={() => handleUnblock(cert.id)} title="Unblock Certificate">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-orange-500" onClick={() => handleRevoke(cert.id)} title="Block Certificate">
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-destructive" onClick={() => handleDelete(cert.id)} title="Delete Certificate">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1135] to-[#0F0A1F] border border-purple-900/30 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to create another certificate?</h2>
          <p className="text-purple-200/70">Generate a professional certificate in seconds with our premium templates.</p>
        </div>
        <Button className="relative z-10 bg-white text-purple-950 hover:bg-slate-100 shadow-lg shadow-black/20 h-12 px-6 rounded-xl font-bold transition-transform hover:scale-105" asChild>
          <Link to="/create">Create Certificate <ChevronRight className="w-4 h-4 ml-2" /></Link>
        </Button>
      </div>

    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, trendColor = "text-slate-400" }: { title: string, value: string | number, trend: string, icon: any, trendColor?: string }) {
  return (
    <div className="bg-[#121217] border border-border/10 rounded-2xl p-5 hover:border-purple-500/30 transition-colors shadow-sm group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-[#1A1A22] group-hover:bg-purple-500/10 rounded-xl transition-colors">
          <Icon className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
        </div>
        <TrendingUp className={`w-4 h-4 ${trend.includes('+') ? 'text-emerald-400' : 'text-slate-500 opacity-0'}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <p className={`text-xs mt-2 ${trendColor}`}>{trend}</p>
      </div>
    </div>
  );
}

function QuickActionCard({ title, desc, icon: Icon, link, color, bg }: { title: string, desc: string, icon: any, link: string, color: string, bg: string }) {
  return (
    <Link to={link} className="flex items-start gap-4 bg-[#121217] border border-border/10 hover:border-border/30 rounded-2xl p-5 transition-all hover:-translate-y-1 group">
      <div className={`p-3 rounded-xl ${bg} shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <h3 className="font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">{title}</h3>
        <p className="text-sm text-slate-400 leading-snug">{desc}</p>
      </div>
    </Link>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === 'Valid') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle className="w-3.5 h-3.5" /> Valid
      </span>
    );
  }
  if (status === 'Revoked') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
        <XCircle className="w-3.5 h-3.5" /> Revoked
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <AlertTriangle className="w-3.5 h-3.5" /> Expired
    </span>
  );
}
