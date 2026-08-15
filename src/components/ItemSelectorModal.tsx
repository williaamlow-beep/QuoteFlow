import React, { useState } from 'react';
import {
  ListPlus,
  X,
  Plus,
  Tag,
  DollarSign,
  Check
} from 'lucide-react';
import { ScopePreset, TradeCategory } from '../types';
import { TRADE_INFO } from '../data/tradePresets';

interface ItemSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: TradeCategory;
  currencySymbol: string;
  onAddPresetItem: (preset: ScopePreset) => void;
  onAddCustomItem: (title: string, price: number, description?: string) => void;
}

export const ItemSelectorModal: React.FC<ItemSelectorModalProps> = ({
  isOpen,
  onClose,
  trade,
  currencySymbol,
  onAddPresetItem,
  onAddCustomItem,
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  if (!isOpen) return null;

  const tradeData = TRADE_INFO[trade] || TRADE_INFO.panel_beater;

  const handleInsertCustom = () => {
    if (!customTitle.trim()) return;
    const priceNum = parseFloat(customPrice) || 0;
    onAddCustomItem(customTitle.trim(), priceNum, customDescription.trim() || undefined);
    setCustomTitle('');
    setCustomPrice('');
    setCustomDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 text-white">
      <div
        id="line-item-selector-modal"
        className="bg-[#0a0f1d]/90 backdrop-blur-2xl border border-white/15 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl shadow-indigo-950/50 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <ListPlus className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-sm tracking-wide text-white">
              Add Line Item ({tradeData.name})
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section: Trade Presets */}
        <div className="space-y-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40">
            Quick Trade Presets ({tradeData.presets.length})
          </span>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {tradeData.presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onAddPresetItem(preset);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 bg-white/[0.03] hover:bg-white/[0.07] rounded-xl border border-white/10 font-medium text-xs text-left text-white shadow-sm transition-colors"
              >
                <span>{preset.title}</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-400/30 font-semibold text-xs">
                  {currencySymbol}{preset.price}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section: Custom Free-Form Item */}
        <div className="border-t border-white/10 pt-3 space-y-2.5">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40">
            Or Key In Custom Free-Form Item & Price
          </span>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="e.g. Custom fabrication or OEM replacement"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 font-medium text-xs text-white placeholder:text-white/30 focus:border-blue-400/60 focus:outline-none transition-all"
            />
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder={`Price (${currencySymbol})`}
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-28 px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 font-semibold text-xs text-white placeholder:text-white/30 focus:border-blue-400/60 focus:outline-none transition-all"
              />
              <input
                type="text"
                placeholder="Optional notes/spec..."
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 font-medium text-xs text-white placeholder:text-white/30 focus:border-blue-400/60 focus:outline-none transition-all"
              />
            </div>
            <button
              onClick={handleInsertCustom}
              disabled={!customTitle.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 disabled:opacity-40 text-white font-semibold text-xs rounded-xl border border-blue-400/30 shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-1.5 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Insert Custom Item</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
