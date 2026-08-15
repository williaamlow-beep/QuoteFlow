import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, AlertCircle, Check, Loader2 } from 'lucide-react';
import { TradeCategory, QuoteItem } from '../types';

interface VoiceAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: TradeCategory;
  currencySymbol: string;
  onApplyParsedData: (data: {
    customerName?: string;
    phoneNumber?: string;
    vehicleOrJobDetails?: string;
    items: QuoteItem[];
    notes?: string;
    transcript?: string;
  }) => void;
}

export const VoiceAiModal: React.FC<VoiceAiModalProps> = ({
  isOpen,
  onClose,
  trade,
  currencySymbol,
  onApplyParsedData,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  if (!isOpen) return null;

  const toggleListening = () => {
    setErrorMessage(null);
    if (!recognitionRef.current) {
      setErrorMessage('Browser speech recognition is not supported on this device. Please type dictation below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleParseTranscript = async () => {
    if (!transcript.trim()) {
      setErrorMessage('Please speak or type quotation details before parsing.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/parse-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, trade }),
      });

      // Guard against non-JSON (like 404 HTML) responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please verify Netlify function configuration.');
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to process voice input.');
      }

      const parsed = result.data;

      const formattedItems: QuoteItem[] = (parsed.items || []).map((item: any) => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: item.title || 'Service Item',
        price: typeof item.price === 'number' ? item.price : 0,
        description: item.description || undefined,
      }));

      onApplyParsedData({
        customerName: parsed.customerName || undefined,
        phoneNumber: parsed.phoneNumber || undefined,
        vehicleOrJobDetails: parsed.vehicleOrJobDetails || undefined,
        items: formattedItems,
        notes: parsed.notes || undefined,
        transcript,
      });

      setIsProcessing(false);
      onClose();
    } catch (err: any) {
      console.error('Voice AI Error:', err);
      setErrorMessage(err.message || 'Error communicating with Voice AI.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-white/15 rounded-3xl p-5 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white p-1 rounded-xl bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-sm text-white">Speech-to-Quote Gemini Voice Copilot</h3>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-start space-x-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mic Control */}
        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 shadow-[0_0_25px_rgba(239,68,68,0.8)] animate-pulse'
                : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30'
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
          </button>
          <span className="text-xs text-white/60 font-medium">
            {isListening ? 'Listening... Speak details and prices' : 'Tap Mic Button Above to Start'}
          </span>
        </div>

        {/* Live Spoken Dictation */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
            Spoken Text / Raw Dictation
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="e.g. Mr Tan, car plate SJB 8892, bumper dent repair 280 dollars, side door touch up 180..."
            className="w-full h-24 p-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/50"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleParseTranscript}
          disabled={isProcessing}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 font-semibold text-xs text-white flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Parsing Quotation with Gemini...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Parse Spoken Text into Slate</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
