import React, { useState } from 'react';
import {
  MessageSquare,
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  Send,
  Loader2,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  Settings,
  Sparkles
} from 'lucide-react';
import { QuoteItem, TradeCategory, WhatsAppConfig } from '../types';
import { TRADE_INFO } from '../data/tradePresets';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessPhone: string;
  customerName: string;
  recipientPhone: string;
  phonePrefix: string;
  useCustomPrefix: boolean;
  customPrefix: string;
  trade: TradeCategory;
  items: QuoteItem[];
  agreedPrice: number;
  currencySymbol: string;
  jobPhotosCount: number;
  vehicleOrJobDetails?: string;
  whatsappConfig: WhatsAppConfig;
  onOpenSettings: () => void;
  onRecordHistoryLog: (method: 'whatsapp_link' | 'whatsapp_cloud_api', messageId?: string) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  businessName,
  businessPhone,
  customerName,
  recipientPhone,
  phonePrefix,
  useCustomPrefix,
  customPrefix,
  trade,
  items,
  agreedPrice,
  currencySymbol,
  jobPhotosCount,
  vehicleOrJobDetails,
  whatsappConfig,
  onOpenSettings,
  onRecordHistoryLog,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSendingCloud, setIsSendingCloud] = useState(false);
  const [cloudSendStatus, setCloudSendStatus] = useState<{
    type: 'success' | 'error';
    message: string;
    messageId?: string;
  } | null>(null);

  if (!isOpen) return null;

  const fullPrefix = useCustomPrefix ? customPrefix : phonePrefix;
  const rawRecipient = `${fullPrefix}${recipientPhone}`.replace(/[^0-9]/g, '');

  const tradeName = TRADE_INFO[trade]?.name || 'Field Services';

  // Construct standard professional WhatsApp Quote Message
  let messageText = `📋 *${businessName.toUpperCase()}* - *SERVICE QUOTATION*\n`;
  messageText += `━━━━━━━━━━━━━━━━━━━━━\n`;
  messageText += `👤 *Client:* ${customerName || 'Valued Customer'}\n`;
  if (vehicleOrJobDetails) {
    messageText += `🚗 *Ref / Site:* ${vehicleOrJobDetails}\n`;
  }
  messageText += `🔧 *Service Trade:* ${tradeName}\n`;
  messageText += `📅 *Date:* ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}\n`;
  if (jobPhotosCount > 0) {
    messageText += `📸 *Job Site / Damage Photos:* ${jobPhotosCount} photo(s) captured\n`;
  }
  messageText += `━━━━━━━━━━━━━━━━━━━━━\n`;
  messageText += `*ITEMIZED SERVICES & SCOPE:*\n`;

  items.forEach((item, index) => {
    messageText += `${index + 1}. *${item.title}*\n`;
    if (item.description) {
      messageText += `   _${item.description}_\n`;
    }
    messageText += `   Price: *${currencySymbol}${item.price.toFixed(2)}*\n`;
  });

  messageText += `━━━━━━━━━━━━━━━━━━━━━\n`;
  messageText += `💰 *TOTAL AGREED PRICE: ${currencySymbol}${agreedPrice.toFixed(2)}*\n`;
  messageText += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  messageText += `✅ *Acceptance & Confirmation:*\n`;
  messageText += `Please reply *"CONFIRM"* to authorize this work order.\n\n`;
  if (businessPhone) {
    messageText += `📞 Contact: ${businessPhone}\n`;
  }
  messageText += `Thank you for trusting *${businessName}*!`;

  const waUniversalLink = `https://wa.me/${rawRecipient}?text=${encodeURIComponent(messageText)}`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDirectWhatsAppClick = () => {
    onRecordHistoryLog('whatsapp_link');
    window.open(waUniversalLink, '_blank');
    onClose();
  };

  const handleSendViaCloudApi = async () => {
    if (!rawRecipient || rawRecipient.length < 7) {
      setCloudSendStatus({
        type: 'error',
        message: 'Please provide a valid recipient WhatsApp phone number with country code.',
      });
      return;
    }

    setIsSendingCloud(true);
    setCloudSendStatus(null);

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: rawRecipient,
          message: messageText,
          customCredentials: whatsappConfig.useCloudApi
            ? {
                token: whatsappConfig.accessToken,
                phoneNumberId: whatsappConfig.phoneNumberId,
              }
            : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'WhatsApp Cloud API dispatch failed.');
      }

      if (data.method === 'cloud_api') {
        setCloudSendStatus({
          type: 'success',
          message: `Quotation dispatched seamlessly via Meta WhatsApp Business Cloud API! Message ID: ${data.messageId || 'Delivered'}`,
          messageId: data.messageId,
        });
        onRecordHistoryLog('whatsapp_cloud_api', data.messageId);
      } else {
        // Fallback to link
        onRecordHistoryLog('whatsapp_link');
        window.open(data.link || waUniversalLink, '_blank');
        onClose();
      }
    } catch (err: any) {
      console.error('Cloud API dispatch error:', err);
      setCloudSendStatus({
        type: 'error',
        message: `WhatsApp API Error: ${err.message || 'Failed to dispatch via Cloud API. You can still use the 1-Click Launch button below.'}`,
      });
    } finally {
      setIsSendingCloud(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 text-white">
      <div
        id="whatsapp-business-modal"
        className="bg-[#0a0f1d]/90 backdrop-blur-2xl border border-white/15 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl shadow-indigo-950/50 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shadow-inner">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-wide text-white">
                WhatsApp Business Quotation Dispatch
              </h3>
              <p className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
                Recipient: {rawRecipient ? `+${rawRecipient}` : 'No number entered'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cloud Send Status Alert */}
        {cloudSendStatus && (
          <div
            className={`p-3.5 rounded-2xl border flex items-start space-x-2 text-xs font-medium ${
              cloudSendStatus.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
            }`}
          >
            {cloudSendStatus.type === 'success' ? (
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            )}
            <div className="flex-1">{cloudSendStatus.message}</div>
          </div>
        )}

        {/* WhatsApp Message Bubble Simulation */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Live WhatsApp Message Preview
            </span>
            <button
              onClick={handleCopyText}
              className="flex items-center space-x-1 text-[11px] font-semibold text-blue-300 hover:text-blue-200 uppercase transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl font-mono text-xs text-white/90 shadow-inner whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed border-dashed">
            {messageText}
          </div>
        </div>

        {/* Sending Methods */}
        <div className="space-y-3 pt-1">
          {/* Main 1-Click WhatsApp Launch */}
          <button
            onClick={handleDirectWhatsAppClick}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-white font-semibold text-xs rounded-2xl border border-emerald-400/30 shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
          >
            <Share2 className="w-4 h-4 text-white" />
            <span>Launch WhatsApp (1-Click Send)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Option: Meta WhatsApp Business Cloud API */}
          <div className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">
                  Meta WhatsApp Business Cloud API
                </span>
              </div>
              <button
                onClick={onOpenSettings}
                className="text-[10px] font-semibold text-white/50 hover:text-white uppercase flex items-center space-x-1 transition-colors"
              >
                <Settings className="w-3 h-3" />
                <span>API Settings</span>
              </button>
            </div>

            <p className="text-[11px] text-white/60 font-normal">
              Directly send to customer's WhatsApp via verified Meta Cloud API endpoint without opening web browser tabs.
            </p>

            <button
              onClick={handleSendViaCloudApi}
              disabled={isSendingCloud}
              className="w-full py-2.5 bg-white/10 hover:bg-white/15 disabled:opacity-40 text-white font-medium text-xs rounded-xl border border-white/10 shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
            >
              {isSendingCloud ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Connecting to WhatsApp Cloud API...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Send via WhatsApp Business Cloud API</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
