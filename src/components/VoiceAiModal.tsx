import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Mic,
  Square,
  Loader2,
  Check,
  AlertCircle,
  Volume2,
  FileText,
  RotateCcw,
  ArrowRight,
  Plus
} from 'lucide-react';
import { QuoteItem, TradeCategory } from '../types';
import { TRADE_INFO } from '../data/tradePresets';

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result Preview State
  const [parsedResult, setParsedResult] = useState<{
    transcript?: string;
    customerName?: string;
    phoneNumber?: string;
    vehicleOrJobDetails?: string;
    items: QuoteItem[];
    notes?: string;
  } | null>(null);

  // Text Prompt Fallback State
  const [textPrompt, setTextPrompt] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      handleCancelRecording();
      setParsedResult(null);
      setErrorMessage(null);
      setTextPrompt('');
    }
  }, [isOpen]);

  const tradeData = TRADE_INFO[trade] || TRADE_INFO.panel_beater;

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const startAudioMeter = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 64;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animationFrameRef.current = requestAnimationFrame(updateMeter);
      };
      updateMeter();
    } catch (e) {
      console.warn('Audio metering unavailable', e);
    }
  };

  const stopAudioMeter = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    setAudioLevel(0);
  };

  const handleStartRecording = async () => {
    setErrorMessage(null);
    setParsedResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      audioChunksRef.current = [];

      let selectedMime = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        selectedMime = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        selectedMime = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        selectedMime = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/aac')) {
        selectedMime = 'audio/aac';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType: selectedMime });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);
      startAudioMeter(stream);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Microphone permission was denied. Please allow microphone access in your browser settings to record voice notes.'
          : `Microphone error: ${err.message || 'Could not access audio device.'}`
      );
    }
  };

  const handleStopAndParse = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    clearInterval(timerRef.current);
    stopAudioMeter();
    setIsRecording(false);
    setIsAiLoading(true);

    mediaRecorderRef.current.onstop = async () => {
      try {
        const rawMime = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: rawMime });

        // Clean up hardware audio stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const base64Data = await blobToBase64(audioBlob);

        // Call our server endpoint
        const response = await fetch('/api/speech-to-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Data,
            mimeType: rawMime,
            trade,
            tradeName: tradeData.name,
          }),
        });

        const resData = await response.json();

        if (!response.ok || !resData.success) {
          throw new Error(resData.error || 'Failed to process voice note with Gemini.');
        }

        const data = resData.data;
        const formattedItems: QuoteItem[] = (data.items || []).map((it: any, idx: number) => ({
          id: `${Date.now()}-${idx}`,
          title: it.title?.trim() || 'Service Item',
          price: typeof it.price === 'number' ? it.price : Number(it.price) || 0,
          description: it.description?.trim() || undefined,
        }));

        setParsedResult({
          transcript: data.transcript,
          customerName: data.customerName,
          phoneNumber: data.phoneNumber,
          vehicleOrJobDetails: data.vehicleOrJobDetails,
          items: formattedItems,
          notes: data.notes,
        });
      } catch (err: any) {
        console.error('Speech-to-text parsing failed:', err);
        setErrorMessage(`Voice AI Error: ${err.message || 'Failed to transcribe and parse audio. Try speaking again or use text note.'}`);
      } finally {
        setIsAiLoading(false);
      }
    };

    mediaRecorderRef.current.stop();
  };

  const handleCancelRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopAudioMeter();
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setIsAiLoading(false);
  };

  const handleParseTextPrompt = async () => {
    if (!textPrompt.trim()) return;
    setIsAiLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/text-to-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textPrompt.trim(),
          trade,
          tradeName: tradeData.name,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to parse text prompt with Gemini.');
      }

      const data = resData.data;
      const formattedItems: QuoteItem[] = (data.items || []).map((it: any, idx: number) => ({
        id: `${Date.now()}-${idx}`,
        title: it.title?.trim() || 'Service Item',
        price: typeof it.price === 'number' ? it.price : Number(it.price) || 0,
        description: it.description?.trim() || undefined,
      }));

      setParsedResult({
        transcript: textPrompt.trim(),
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        vehicleOrJobDetails: data.vehicleOrJobDetails,
        items: formattedItems,
        notes: data.notes,
      });
    } catch (err: any) {
      console.error('Text parsing failed:', err);
      setErrorMessage(`Text Parsing Error: ${err.message || 'Failed to parse text.'}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleConfirmAndApply = () => {
    if (!parsedResult) return;
    onApplyParsedData(parsedResult);
    onClose();
  };

  const formatSecs = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 text-white">
      <div
        id="voice-ai-modal"
        className="bg-[#0a0f1d]/90 backdrop-blur-2xl border border-white/15 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl shadow-indigo-950/50 max-h-[92vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shadow-inner">
              <Sparkles className="w-4 h-4 text-blue-300 fill-blue-300" />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-wide text-white">
                Speech-to-Quote Gemini Voice Copilot
              </h3>
              <p className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
                Active Trade: {tradeData.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-red-950/60 border border-red-500/40 rounded-2xl flex items-start space-x-2 text-red-200 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* PARSED RESULT PREVIEW VIEW */}
        {parsedResult ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-white flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                  <span>Speech-to-Text Extracted Successfully</span>
                </span>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  {parsedResult.items.length} Items
                </span>
              </div>

              {parsedResult.transcript && (
                <div className="p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-xs text-white/80 italic">
                  <span className="font-semibold not-italic text-[10px] uppercase tracking-wider block text-white/40 mb-1">
                    Spoken Transcript:
                  </span>
                  "{parsedResult.transcript}"
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-black/30 backdrop-blur-md rounded-xl border border-white/10">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-white/40">Customer Name</span>
                  <span className="font-semibold text-white line-clamp-1">
                    {parsedResult.customerName || 'Not Mentioned'}
                  </span>
                </div>
                <div className="p-2.5 bg-black/30 backdrop-blur-md rounded-xl border border-white/10">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-white/40">Vehicle / Job Info</span>
                  <span className="font-semibold text-white line-clamp-1">
                    {parsedResult.vehicleOrJobDetails || 'General'}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 pt-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Extracted Line Items
                </span>
                {parsedResult.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-black/25 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between text-xs font-medium"
                  >
                    <span className="text-white/90">{item.title}</span>
                    <span className="font-semibold text-emerald-400">
                      {currencySymbol}{item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => setParsedResult(null)}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl border border-white/10 flex items-center justify-center space-x-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Record</span>
              </button>

              <button
                onClick={handleConfirmAndApply}
                className="flex-2 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white font-semibold text-xs rounded-xl border border-blue-400/30 shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-1.5 transition-all active:scale-[0.98]"
              >
                <span>Auto-Fill Quotation Slate</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ) : (
          /* RECORDING / INPUT VIEW */
          <div className="space-y-4">
            <p className="text-xs text-white/70 font-normal text-center">
              Speak naturally into your phone/laptop microphone. Name the customer, car plate or unit, and describe services with their prices.
            </p>

            {/* Microphone Centerpiece */}
            <div className="flex flex-col items-center justify-center py-6 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl space-y-4 shadow-inner">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  disabled={isAiLoading}
                  className="relative p-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 hover:brightness-110 text-white border border-blue-400/40 shadow-xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center group"
                >
                  <Mic className="w-10 h-10 text-white transition-transform group-hover:scale-110" />
                  <span className="absolute -bottom-2.5 bg-blue-950 text-blue-200 border border-blue-400/30 text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md">
                    TAP TO RECORD
                  </span>
                </button>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <button
                    onClick={handleStopAndParse}
                    className="p-7 rounded-full bg-red-600 hover:bg-red-500 text-white border border-red-400/40 shadow-xl shadow-red-500/40 animate-pulse flex items-center justify-center"
                  >
                    <Square className="w-10 h-10 fill-white text-white" />
                  </button>

                  {/* Audio Waveform Meter */}
                  <div className="flex items-center space-x-1.5 h-8">
                    {[40, 70, 90, 60, 100, 75, 45, 85, 95, 60, 30].map((h, i) => (
                      <span
                        key={i}
                        className="w-1.5 bg-blue-400 rounded-full transition-all duration-75 shadow-[0_0_6px_rgba(96,165,250,0.8)]"
                        style={{
                          height: `${Math.max(6, Math.round((h * audioLevel) / 100))}px`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Status Indicator */}
              <div className="text-center">
                {isRecording ? (
                  <div className="space-y-1">
                    <div className="text-red-400 font-semibold text-xs uppercase tracking-wider flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span>Recording Live Audio ({formatSecs(recordingTime)})</span>
                    </div>
                    <p className="text-[11px] text-white/50">
                      Tap Red Square when finished speaking to parse with Gemini
                    </p>
                  </div>
                ) : isAiLoading ? (
                  <div className="text-blue-300 font-semibold text-xs tracking-wider uppercase flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span>Gemini Transcribing & Parsing Speech...</span>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-white/50">
                    Ready • Tap Mic Button Above to Start
                  </span>
                )}
              </div>
            </div>

            {/* Quick Demo Voice Prompt Tester */}
            <div className="p-3.5 bg-blue-950/30 border border-blue-400/20 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-blue-300">
                <span className="flex items-center space-x-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Sample Spoken Note for {tradeData.name}:</span>
                </span>
                <button
                  onClick={() => setTextPrompt(tradeData.sampleVoicePrompt)}
                  className="underline hover:text-white transition-colors"
                >
                  Insert Sample Text
                </button>
              </div>
              <p className="text-xs font-normal text-white/80 italic">
                "{tradeData.sampleVoicePrompt}"
              </p>
            </div>

            {/* Fallback Text Note Section */}
            <div className="border-t border-white/10 pt-3 space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50">
                Or Type Raw Quick Text Dictation
              </label>
              <div className="flex space-x-2">
                <textarea
                  rows={2}
                  placeholder={`e.g. ${tradeData.sampleVoicePrompt}`}
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 font-medium text-xs text-white placeholder:text-white/30 focus:border-blue-400/60 focus:outline-none transition-all"
                />
                <button
                  onClick={handleParseTextPrompt}
                  disabled={isAiLoading || !textPrompt.trim()}
                  className="px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 disabled:opacity-40 text-white font-semibold text-xs rounded-xl border border-blue-400/30 shadow-md flex items-center justify-center shrink-0 transition-all active:scale-95"
                >
                  {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Parse Text'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
