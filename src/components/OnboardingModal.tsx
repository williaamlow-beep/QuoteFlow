import React, { useState } from 'react';
import {
  Wrench,
  Check,
  Building2,
  Sparkles,
  ArrowRight,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { BusinessProfile, TradeTemplate } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeTemplates: TradeTemplate[];
  profile: BusinessProfile;
  onCompleteOnboarding: (
    updatedProfile: BusinessProfile,
    selectedTemplateId: string
  ) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  tradeTemplates,
  profile,
  onCompleteOnboarding,
}) => {
  if (!isOpen) return null;

  const [businessName, setBusinessName] = useState(
    profile.name || 'Pro Service Solutions'
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    tradeTemplates[0]?.id || 'handyman_std'
  );
  const [phone, setPhone] = useState(profile.phone || '');
  const [currency, setCurrency] = useState(profile.currencySymbol || '$');

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenTpl = tradeTemplates.find((t) => t.id === selectedTemplateId);

    const updated: BusinessProfile = {
      ...profile,
      name: businessName.trim() || 'Pro Services',
      primaryTrade: chosenTpl?.professionName || 'Field Services',
      phone: phone.trim() || profile.phone,
      currencySymbol: currency,
    };

    onCompleteOnboarding(updated, selectedTemplateId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white p-6 sm:p-8 space-y-2 relative">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 font-bold text-xs px-3 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to QuoteFlow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Select Your Trade Profession
          </h2>
          <p className="text-xs text-slate-300">
            QuoteFlow configures custom line items, terms, and WhatsApp message templates tailored specifically for your trade.
          </p>
        </div>

        <form onSubmit={handleFinish} className="p-6 sm:p-8 space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Business or Trade Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Auto Body or Quick Fix Plumbing"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold text-sm outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                WhatsApp Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 234 5678"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-2">
              Choose Primary Profession Template:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
              {tradeTemplates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-xs ring-2 ring-emerald-200'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 text-xs">
                          {tpl.professionName}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {tpl.categoryGroup}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-slate-700">Currency:</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-800"
              >
                <option value="$">$ (USD/CAD/AUD)</option>
                <option value="£">£ (GBP)</option>
                <option value="€">€ (EUR)</option>
                <option value="R">R (ZAR)</option>
                <option value="S$">S$ (SGD)</option>
                <option value="₹">₹ (INR)</option>
              </select>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer text-xs"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
