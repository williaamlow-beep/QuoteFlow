import React, { useState } from 'react';
import {
  Settings,
  Building2,
  DollarSign,
  Landmark,
  FileText,
  Save,
  Download,
  Upload,
  RotateCcw,
  Check,
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface SettingsViewProps {
  profile: BusinessProfile;
  onSaveProfile: (profile: BusinessProfile) => void;
  onExportData: () => void;
  onImportData: (jsonString: string) => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onSaveProfile,
  onExportData,
  onImportData,
  onResetDemoData,
}) => {
  const [formData, setFormData] = useState<BusinessProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImportData(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto pb-28 md:pb-12 bg-slate-50">
      <div className="flex items-center justify-between p-4 sm:p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            <span>Business Settings</span>
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Configure business identity, banking payment details, currency, and data backups.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-300">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
        {/* Business Identity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Business Info & Branding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Business Name / Trade Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Primary Trade Profession
              </label>
              <input
                type="text"
                value={formData.primaryTrade}
                onChange={(e) => setFormData({ ...formData, primaryTrade: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Business Phone (WhatsApp)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Business Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Business Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Currency & Tax */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <DollarSign className="w-4 h-4 text-indigo-600" />
            <span>Currency & Tax Settings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Currency Symbol
              </label>
              <select
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 font-bold outline-none focus:border-indigo-500"
              >
                <option value="$">$ (USD / CAD / AUD)</option>
                <option value="£">£ (GBP)</option>
                <option value="€">€ (EUR)</option>
                <option value="R">R (ZAR)</option>
                <option value="A$">A$ (AUD)</option>
                <option value="S$">S$ (SGD)</option>
                <option value="₹">₹ (INR)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.defaultTaxRate}
                onChange={(e) => setFormData({ ...formData, defaultTaxRate: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 font-semibold outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tax Label
              </label>
              <input
                type="text"
                value={formData.taxName}
                onChange={(e) => setFormData({ ...formData, taxName: e.target.value })}
                placeholder="VAT / GST / Tax"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Banking details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Landmark className="w-4 h-4 text-indigo-600" />
            <span>Bank Account & Payment Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Account Number / IBAN
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Default Terms */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Default Terms & Payment Policy</span>
          </h3>

          <textarea
            rows={3}
            value={formData.defaultTerms}
            onChange={(e) => setFormData({ ...formData, defaultTerms: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-800 text-xs outline-none focus:border-indigo-500"
          />
        </div>

        {/* Submit Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Backup & Demo Data Management */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-4 border border-slate-800 mt-8">
        <h3 className="font-bold text-sm text-white">Data Management & Backup</h3>
        <p className="text-xs text-slate-300">
          QuoteFlow is offline-first. All data is saved securely in your local browser storage. You can export or restore backups anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onExportData}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Backup JSON</span>
          </button>

          <label className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-blue-400" />
            <span>Import Backup JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (confirm('Reset to initial demo data? Your current data will be replaced.')) {
                onResetDemoData();
              }
            }}
            className="flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-semibold text-xs px-4 py-2 rounded-lg border border-rose-800/80 transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
