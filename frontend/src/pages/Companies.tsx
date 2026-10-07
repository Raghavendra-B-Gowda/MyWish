import { useEffect, useState } from "react";
import { PlusCircle, Building2, Trash2, Edit, CheckCircle2, Globe, FileText, Loader2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCompanyStore } from "@/store/useCompanyStore";

export default function Companies() {
  const { companies, isLoading, fetchCompanies, addCompany, updateCompany, deleteCompany } = useCompanyStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openModal = (company?: any) => {
    if (company) {
      setEditingId(company.id);
      setName(company.name);
      setWebsite(company.website || "");
      setLogo(company.logo || "");
    } else {
      setEditingId(null);
      setName("");
      setWebsite("");
      setLogo("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setName("");
    setWebsite("");
    setLogo("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (editingId) {
      const success = await updateCompany(editingId, { name, website, logo });
      if (success) {
        showToast("Company updated successfully");
        closeModal();
      }
    } else {
      const newCompany = await addCompany({ name, website, logo });
      if (newCompany) {
        showToast("Company added successfully");
        closeModal();
      }
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    const success = await deleteCompany(id);
    if (success) {
      showToast("Company deleted successfully");
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#0A0A0C] text-slate-200 p-4 md:p-8 pb-20 min-h-screen relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-medium text-sm">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Companies</h1>
          <p className="text-slate-400 mt-1">Manage organizations and partners.</p>
        </div>
        <Button onClick={() => openModal()} className="bg-gradient-to-r from-[#6929F5] to-[#8C52FF] hover:from-[#5A21D6] hover:to-[#7A42E6] text-white shadow-lg shadow-purple-500/20 border-0">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Company
        </Button>
      </div>

      <div className="bg-[#121217] border border-border/10 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-border/10">
          <Input 
            placeholder="Search companies..." 
            className="w-full sm:w-64 bg-[#0A0A0C] border-border/10 text-sm focus-visible:ring-purple-500 text-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0A0A0C] text-slate-400 border-b border-border/10">
              <tr>
                <th className="px-5 py-3.5 font-medium">Company</th>
                <th className="px-5 py-3.5 font-medium">Website</th>
                <th className="px-5 py-3.5 font-medium">Certificates Issued</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12">
                    <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center">
                    <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-lg font-medium text-white">No companies found</p>
                    <p className="text-slate-400 mb-4">Add your first company to start issuing certificates.</p>
                    <Button onClick={() => openModal()} variant="outline" className="bg-[#1A1A22] border-border/10">Add Company</Button>
                  </td>
                </tr>
              ) : (
                filteredCompanies.map(company => (
                  <tr key={company.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#1A1A22] flex items-center justify-center shrink-0 border border-border/10 overflow-hidden">
                          {company.logo ? (
                            <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <span className="font-medium text-white">{company.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {company.website ? (
                        <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-purple-400">
                          <Link2 className="w-3.5 h-3.5" /> {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <FileText className="w-3.5 h-3.5" /> {company._count?.certificates || 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => openModal(company)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-destructive" onClick={() => handleDelete(company.id)}>
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121217] border border-border/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Company' : 'Add New Company'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Company Name *</label>
                <Input required value={name} onChange={e => setName(e.target.value)} className="bg-[#0A0A0C] border-border/10 text-white" placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Website URL (Optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input value={website} onChange={e => setWebsite(e.target.value)} type="url" className="pl-9 bg-[#0A0A0C] border-border/10 text-white" placeholder="https://example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Logo URL (Optional)</label>
                <Input value={logo} onChange={e => setLogo(e.target.value)} className="bg-[#0A0A0C] border-border/10 text-white" placeholder="https://example.com/logo.png" />
              </div>
              
              <div className="pt-4 flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={closeModal} className="bg-transparent border-border/10 text-slate-300">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Company'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
