import React, { useState } from 'react';

type WorkCategory = 'BODY' | 'HOME' | 'OTHER';

const TRADE_PRESETS: Record<WorkCategory, string[]> = {
  BODY: [
    'Hair Salons', 'Dental Clinics', 'Nail Spas', 'Massage Therapy',
    'Mobile Hair & Makeup', 'Personal Training', 'Nutrition Consulting'
  ],
  HOME: [
    'Painting Services', 'Plumbing Services', 'Electrical Services',
    'Carpentry Services', 'Flooring Services', 'Drywall Services',
    'HVAC Services', 'Outdoor Improvements', 'Home Cleaning', 'Handyman'
  ],
  OTHER: [
    'Pet Grooming', 'Studio Photography', 'Mobile Panel Beaters',
    'Vehicle Mechanics', 'Personal Chef', 'Home Bakery', 'Tax Prep',
    'Social Media Management', 'Virtual Assistant', 'Web Design / SEO'
  ]
};

export const CreateQuoteModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [category, setCategory] = useState<WorkCategory>('HOME');
  const [selectedTrade, setSelectedTrade] = useState('');
  const [customTrade, setCustomTrade] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [scopeDescription, setScopeDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState<number | ''>('');
  
  // Deposit Logic
  const [depositType, setDepositType] = useState<'percent' | 'flat'>('percent');
  const [depositValue, setDepositValue] = useState<number>(30); // Default 30% for HOME

  // Handle category switch defaults
  const handleCategoryChange = (cat: WorkCategory) => {
    setCategory(cat);
    setSelectedTrade('');
    if (cat === 'BODY') {
      setDepositType('percent');
      setDepositValue(20); // 20% standard for booking slots
    } else if (cat === 'HOME') {
      setDepositType('percent');
      setDepositValue(30); // 30% standard for materials
    } else {
      setDepositType('percent');
      setDepositValue(0); // Open field for OTHER WORKS
    }
  };

  const calculatedDeposit = () => {
    if (!totalAmount) return 0;
    if (depositType === 'percent') {
      return (Number(totalAmount) * (depositValue / 100)).toFixed(2);
    }
    return Number(depositValue).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">Create Quick Quote</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
        </div>

        {/* 1. Category Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            1. Select Trade Category
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['BODY', 'HOME', 'OTHER'] as WorkCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`py-3 px-2 rounded-lg font-bold text-sm border transition-all text-center ${
                  category === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat === 'BODY' && '💅 BODY WORKS'}
                {cat === 'HOME' && '🔨 HOME WORKS'}
                {cat === 'OTHER' && '💼 OTHER WORKS'}
              </button>
            ))}
          </div>
        </div>

        {/* Trade Sub-preset Selector */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Trade Specialty</label>
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select trade preset...</option>
              {TRADE_PRESETS[category].map((trade) => (
                <option key={trade} value={trade}>{trade}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Or Custom Trade Name</label>
            <input
              type="text"
              placeholder="e.g. Interior Painter"
              value={customTrade}
              onChange={(e) => setCustomTrade(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 2. Client Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Client Name</label>
            <input
              type="text"
              placeholder="e.g. Sarah Jenkins"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp / Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. +60123456789"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 3. Scope of Work */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Scope of Work / Service Summary</label>
          <textarea
            rows={3}
            placeholder={
              category === 'BODY' ? "e.g. Bridal makeup session + hairstyling for 3 bridesmaids on Saturday morning." :
              category === 'HOME' ? "e.g. Prep and paint living room & master bedroom walls with 2 coats of weatherproof emulsion." :
              "e.g. Monthly social media management: 12 posts + 4 video reels + community management."
            }
            value={scopeDescription}
            onChange={(e) => setScopeDescription(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 4. Pricing & Deposit Matrix */}
        <div className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Total Quote Amount ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full border rounded-lg p-2.5 font-bold text-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Deposit Rules Engine */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Upfront Deposit Required
              </label>

              {category === 'BODY' && (
                <div className="flex gap-2">
                  {[10, 20, 30].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => { setDepositType('percent'); setDepositValue(pct); }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                        depositValue === pct ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              )}

              {category === 'HOME' && (
                <div className="flex gap-2">
                  {[25, 30, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => { setDepositType('percent'); setDepositValue(pct); }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                        depositValue === pct ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              )}

              {category === 'OTHER' && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Enter deposit"
                    value={depositValue}
                    onChange={(e) => setDepositValue(Number(e.target.value))}
                    className="w-2/3 border rounded-lg p-2 text-sm bg-white font-bold"
                  />
                  <select
                    value={depositType}
                    onChange={(e) => setDepositType(e.target.value as 'percent' | 'flat')}
                    className="w-1/3 border rounded-lg p-2 text-xs bg-white"
                  >
                    <option value="percent">%</option>
                    <option value="flat">$ Flat</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Deposit Summary Bar */}
          <div className="flex justify-between items-center pt-2 border-t text-sm font-semibold text-gray-700">
            <span>Customer Pay On Approval:</span>
            <span className="text-blue-600 font-bold text-base">${calculatedDeposit()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => alert(`Quote generated! Send to ${clientPhone || 'Client'}`)}
            className="px-6 py-2.5 text-sm bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md"
          >
            Generate & Share Link 🚀
          </button>
        </div>

      </div>
    </div>
  );
};
