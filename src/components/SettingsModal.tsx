import React, { useState, useEffect } from 'react';
import {
  Settings,
  X,
  Check,
  Smartphone,
  Shield,
  ExternalLink,
  Key,
  Building,
  DollarSign,
  Phone,
  MapPin,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { BusinessSettings, WhatsAppConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BusinessSettings;
  onSaveSettings: (newSettings: BusinessSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<BusinessSettings>(settings);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    setFormData(settings);
    setTestStatus(null);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleTestWhatsAppStatus = async () => {
    setIsTesting(true);
    setTestStatus(null);
    try {
      const res = await fetch('/api/whatsapp/status');
      const data = await res.json();
      if (data.configured) {
        setTestStatus(`Cloud API is configured on server environment! Phone Number ID: ${data.phoneNumberId}`);
      } else if (formData.whatsappConfig.phoneNumberId && formData.whatsappConfig.accessToken) {
        setTestStatus('Custom client WhatsApp credentials entered. Ready to dispatch!');
      } else {
        setTestStatus('WhatsApp Cloud API credentials not detected. Standard 1-Click WhatsApp Universal Web/Mobile link will be used seamlessly.');
      }
    } catch (e: any) {
      setTestStatus(`Status check: ${e.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 text-white">
      <div
        id="settings-modal"
        className="bg-[#0a0f1d]/90 backdrop-blur-2xl border border-white/15 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl shadow-indigo-950/50 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-500/20 border border-blue-400/30 rounded-xl shadow-inner">
              <Settings className="w-4 h-4 text-blue-300" />
            </div>
            <h3 className="font-semibold text-sm tracking-wide text-white">
              Business & WhatsApp API Settings
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Section: Business Branding */}
          <div className="space-y-3 p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="flex items-center space-x-1.5 border-b border-white/10 pb-2">
              <Building className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
                Business & Shop Branding
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                Business Name / Shop Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 font-medium text-xs text-white placeholder:text-white/30 focus:border-blue-400/60 focus:outline-none transition-all"
                placeholder="e.g. APEX FIELD SERVICES"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currencySymbol}
                  onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-xl bg-[#0f172a] border border-white/15 font-semibold text-xs text-white focus:outline-none"
                >
                  <option value="$">$ (SGD / USD / AUD / CAD / NZD)</option>
                  <option value="RM">RM (MYR - Malaysia)</option>
                  <option value="Rp">Rp (IDR - Indonesia)</option>
                  <option value="฿">฿ (THB - Thailand)</option>
                  <option value="€">€ (EUR - Euro)</option>
                  <option value="£">£ (GBP - British Pound)</option>
                  <option value="AED">AED (United Arab Emirates)</option>
                  <option value="₹">₹ (INR - India)</option>
                  <option value="₱">₱ (PHP - Philippines)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  Business Phone
                </label>
                <input
                  type="text"
                  value={formData.businessPhone}
                  onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 font-medium text-xs text-white placeholder:text-white/30 focus:border-blue-400/60 focus:outline-none transition-all"
                  placeholder="+65 9123 4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                Shop Address / Service Coverage
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 font-medium text-xs text-white placeholder:text-white/30 focus:border-blue-400/60 focus:outline-none transition-all"
                placeholder="e.g. 12 Jalan Kilang Barat, Singapore"
              />
            </div>
          </div>

          {/* Section: WhatsApp Business API */}
          <div className="space-y-3 p-4 bg-emerald-950/20 backdrop-blur-xl border border-emerald-500/20 rounded-2xl">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <div className="flex items-center space-x-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Meta WhatsApp Business Cloud API
                </span>
              </div>
              <button
                onClick={handleTestWhatsAppStatus}
                disabled={isTesting}
                className="text-[10px] font-semibold uppercase bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-xl border border-emerald-400/30 flex items-center space-x-1 transition-all"
              >
                <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Test Status</span>
              </button>
            </div>

            {testStatus && (
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-[11px] font-medium text-white/90 flex items-start space-x-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>{testStatus}</span>
              </div>
            )}

            <div className="space-y-2.5">
              {/* Meta Developer Sandbox Helper Box */}
              <div className="p-3 bg-blue-950/30 border border-blue-400/20 rounded-xl space-y-1.5 text-[11px] text-white/80">
                <div className="flex items-center space-x-1.5 text-blue-300 font-semibold text-xs">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Meta Test / Sandbox Numbers Supported</span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  You can use Meta's free <strong>Test Phone Number ID</strong> and <strong>Temporary 24h Access Token</strong> from your <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer" className="text-blue-300 underline font-medium">Meta Developer Dashboard</a> (WhatsApp &gt; API Setup) before your official business registration is approved.
                </p>
                <div className="text-[10px] text-white/50 bg-black/30 p-2 rounded-lg border border-white/5">
                  <strong>Sandbox rule:</strong> In Meta Sandbox mode, add your personal phone number under <em>"To" test recipient numbers</em> in the Meta Console so test API messages can reach your device.
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  WhatsApp Phone Number ID (From Meta Developer Console)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 104928374829102"
                  value={formData.whatsappConfig.phoneNumberId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatsappConfig: {
                        ...formData.whatsappConfig,
                        phoneNumberId: e.target.value.trim(),
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 font-mono text-xs text-white placeholder:text-white/30 focus:border-blue-400/60 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  Meta Permanent or Temporary Sandbox Access Token
                </label>
                <input
                  type="password"
                  placeholder="EAA..."
                  value={formData.whatsappConfig.accessToken}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatsappConfig: {
                        ...formData.whatsappConfig,
                        accessToken: e.target.value.trim(),
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 font-mono text-xs text-white placeholder:text-white/30 focus:border-blue-400/60 focus:outline-none transition-all"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="useCloudApi"
                  checked={formData.whatsappConfig.useCloudApi}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatsappConfig: {
                        ...formData.whatsappConfig,
                        useCloudApi: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-emerald-500 bg-black/40 rounded border-white/20 focus:ring-0"
                />
                <label htmlFor="useCloudApi" className="text-xs font-medium text-white/80">
                  Prefer direct Meta Cloud API dispatch over WhatsApp Web / Universal Link
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex space-x-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl border border-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-white font-semibold text-xs rounded-xl border border-emerald-400/30 shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-1.5 transition-all active:scale-[0.98]"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Save & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};
