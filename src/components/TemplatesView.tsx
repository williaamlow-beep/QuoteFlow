import React, { useState } from 'react';
import {
  Briefcase,
  Code2,
  Calculator,
  Sliders,
  Layers,
  CheckCircle2,
  FileCode,
  Copy,
  Check,
  Droplet,
  GraduationCap,
  Car,
  Camera,
  Sparkles,
  Zap,
  Wrench,
  Wind,
  MessageSquare,
  Send,
  Smartphone,
  Clock,
  Image,
  Tag,
  Eye,
  EyeOff,
  Share2,
  Paintbrush,
  Home,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { TradeTemplate, BusinessProfile } from '../types';

interface TemplatesViewProps {
  tradeTemplates: TradeTemplate[];
  profile: BusinessProfile;
  onSelectTemplateToBuild: (template: TradeTemplate) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  tradeTemplates,
  profile,
  onSelectTemplateToBuild,
}) => {
  const [activeTab, setActiveTab] = useState<
    'presets' | 'schema_inspector' | 'whatsapp_flow' | 'photo_quoting' | 'json_examples' | 'flutter_code'
  >('whatsapp_flow');

  const [selectedFlutterFile, setSelectedFlutterFile] = useState<'pubspec' | 'quote_model' | 'quote_repo' | 'converter' | 'pdf_service' | 'whatsapp_service' | 'dashboard_screen'>('pubspec');

  const [selectedExampleKey, setSelectedExampleKey] = useState<'plumber' | 'tutor' | 'panelbeater' | 'photographer'>('plumber');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Icon mapping
  const getIcon = (name: string) => {
    switch (name) {
      case 'Droplet': return <Droplet className="w-5 h-5 text-sky-600" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case 'Car': return <Car className="w-5 h-5 text-amber-600" />;
      case 'Camera': return <Camera className="w-5 h-5 text-emerald-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-pink-600" />;
      case 'Wind': return <Wind className="w-5 h-5 text-cyan-600" />;
      default: return <Wrench className="w-5 h-5 text-indigo-600" />;
    }
  };

  // Concrete Example JSON Payloads
  const jsonExamples = {
    plumber: {
      useCase: 'Plumber: Call-out Fee + Parts + Labor',
      description: 'Standard emergency plumbing response with diagnostic call-out fee, parts markup, and hourly labor rate.',
      json: {
        quoteNumber: "QT-2026-PLUMB-01",
        professionCategory: "Plumbers",
        customFields: {
          leakType: "Main Line Leak",
          emergencyCallout: "After-Hours Emergency (+$75)",
          pipeMaterial: "Copper"
        },
        appliedPricingRules: [
          {
            ruleId: "rule_plumb_emerg",
            ruleName: "After-Hours Callout Surcharge",
            amount: 75.00,
            appliedReason: "Emergency Callout == After-Hours"
          }
        ],
        lineItems: [
          {
            description: "Standard Plumbing Call-out & Diagnostic Fee",
            category: "callout",
            quantity: 1,
            unitPrice: 95.00,
            unit: "visit",
            amount: 95.00
          },
          {
            description: "Hydro-Jetting Drain Clearing & Leak Repair Labor",
            category: "labor",
            quantity: 2.5,
            unitPrice: 110.00,
            unit: "hrs",
            amount: 275.00
          },
          {
            description: "High-Pressure Brass Shutoff Valve & Flex Fitting Kit",
            category: "materials",
            quantity: 1,
            unitPrice: 85.00,
            unit: "set",
            amount: 85.00
          }
        ],
        financials: {
          subtotal: 455.00,
          calloutFee: 95.00,
          emergencySurcharge: 75.00,
          taxRate: 8.25,
          total: 573.74,
          depositRequired: true,
          depositAmount: 286.87
        }
      }
    },
    tutor: {
      useCase: 'Tutor: Subject + Session Duration + Travel Mileage',
      description: 'Academic tutoring package with specialized subject markup, hourly instruction, and mileage formula.',
      json: {
        quoteNumber: "QT-2026-TUTOR-04",
        professionCategory: "Private Tutors",
        customFields: {
          subject: "AP Physics 1",
          durationHours: 2,
          travelDistanceKm: 18,
          gradeLevel: "High School AP"
        },
        appliedPricingRules: [
          {
            ruleId: "rule_tutor_ap",
            ruleName: "AP Advanced Subject Premium (+15% labor)",
            amount: 19.50,
            appliedReason: "Subject == AP Physics 1"
          },
          {
            ruleId: "rule_tutor_travel",
            ruleName: "Extended Mileage Fee (18km - 10km limit = 8km @ $1.50/km)",
            amount: 12.00,
            appliedReason: "Travel Distance > 10 km"
          }
        ],
        lineItems: [
          {
            description: "AP Physics 1-on-1 Intensive Tutoring Session",
            category: "labor",
            quantity: 2,
            unitPrice: 65.00,
            unit: "hrs",
            amount: 130.00
          },
          {
            description: "Travel Surcharge to Residence (18 km total)",
            category: "travel",
            quantity: 18,
            unitPrice: 1.20,
            unit: "km",
            amount: 21.60
          },
          {
            description: "AP Exam Practice Problem Set & Answer Key Booklet",
            category: "materials",
            quantity: 1,
            unitPrice: 35.00,
            unit: "set",
            amount: 35.00
          }
        ],
        financials: {
          subtotal: 186.60,
          subjectMarkup: 19.50,
          travelFee: 21.60,
          total: 218.10,
          depositRequired: true,
          depositAmount: 109.05
        }
      }
    },
    panelbeater: {
      useCase: 'Panel Beater: Photos + Damage Area Tagging + Repair Formulas',
      description: 'Auto body collision quote featuring visual damage area tagging, spectrophotometer paint matching, and clear coat specs.',
      json: {
        quoteNumber: "QT-2026-AUTO-88",
        professionCategory: "Panel Beaters & Auto Body",
        customFields: {
          paintMatching: "Custom Metallic Blend",
          clearCoatType: "2K High Gloss",
          framePullingRequired: "Yes - Hydraulic Alignment (+$250)"
        },
        damageTags: [
          {
            id: "dmg_101",
            area: "front_bumper",
            areaName: "Front Bumper",
            repairType: "dent_repair",
            partsCost: 145.00,
            laborHours: 3.5,
            laborRate: 95.00,
            notes: "Crease dent near mounting brackets"
          },
          {
            id: "dmg_102",
            area: "fender_left",
            areaName: "Left Fender",
            repairType: "paint_touchup",
            partsCost: 0.00,
            laborHours: 4.0,
            laborRate: 95.00,
            notes: "Deep key scratch requiring primer & metallic blend"
          }
        ],
        photos: [
          {
            id: "photo_901",
            caption: "Front bumper & fender crease collision point",
            damageArea: "Front Bumper",
            isCustomerVisible: true,
            annotations: [
              { id: "a1", x: 40, y: 65, label: "Hydraulic pull target", color: "#ef4444" }
            ]
          }
        ],
        lineItems: [
          {
            description: "Front Bumper Dent Extraction & Alignment Labor",
            category: "labor",
            quantity: 3.5,
            unitPrice: 95.00,
            unit: "hrs",
            amount: 332.50
          },
          {
            description: "Left Fender Metallic Paint & Refinishing Labor",
            category: "labor",
            quantity: 4.0,
            unitPrice: 95.00,
            unit: "hrs",
            amount: 380.00
          },
          {
            description: "OEM Replacement Bumper Mounting Bracket Kit",
            category: "materials",
            quantity: 1,
            unitPrice: 145.00,
            unit: "set",
            amount: 145.00
          }
        ],
        financials: {
          subtotal: 857.50,
          metallicPaintSurcharge: 29.00,
          framePullingLabor: 250.00,
          total: 1136.50,
          depositRequired: true,
          depositAmount: 568.25
        }
      }
    },
    photographer: {
      useCase: 'Photographer: Shoot Duration + Retouched Edits + Deliverable Packages',
      description: 'Commercial shoot quotation with on-site coverage hours, retouched deliverables, drone footage, and travel.',
      json: {
        quoteNumber: "QT-2026-PHOTO-12",
        professionCategory: "Freelance Photographers",
        customFields: {
          shootType: "Event Photography",
          deliverablePhotos: 75,
          droneCoverage: "Included 4K Drone Add-on (+$250)"
        },
        appliedPricingRules: [
          {
            ruleId: "rule_photo_drone",
            ruleName: "4K Drone Aerial Coverage",
            amount: 250.00,
            appliedReason: "Drone Coverage Selected"
          }
        ],
        lineItems: [
          {
            description: "Half-Day On-Location Commercial Event Photography",
            category: "labor",
            quantity: 4,
            unitPrice: 175.00,
            unit: "hrs",
            amount: 700.00
          },
          {
            description: "High-Res Color Grading & Skin Retouching (75 Photos)",
            category: "labor",
            quantity: 75,
            unitPrice: 8.00,
            unit: "photos",
            amount: 600.00
          },
          {
            description: "Travel Surcharge to Event Venue",
            category: "travel",
            quantity: 45,
            unitPrice: 1.20,
            unit: "miles",
            amount: 54.00
          }
        ],
        financials: {
          subtotal: 1354.00,
          droneAddon: 250.00,
          total: 1604.00,
          depositRequired: true,
          depositAmount: 481.20
        }
      }
    }
  };

  const handleCopyJson = (key: string, data: object) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24 md:pb-8 bg-slate-50">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span>Trade Engine, WhatsApp & Photo Quoting Hub</span>
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Category-based quoting engine, WhatsApp-first 1-tap dispatch, photo damage tagging, and trade schemas.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveTab('whatsapp_flow')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'whatsapp_flow'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Workflow</span>
          </button>

          <button
            onClick={() => setActiveTab('photo_quoting')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'photo_quoting'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photo Quoting System</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'presets' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profession Presets
          </button>

          <button
            onClick={() => setActiveTab('schema_inspector')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'schema_inspector' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Schema & Rules
          </button>

          <button
            onClick={() => setActiveTab('json_examples')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'json_examples' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            JSON Payloads
          </button>

          <button
            onClick={() => setActiveTab('flutter_code')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'flutter_code'
                ? 'bg-sky-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Flutter Clean Architecture</span>
          </button>
        </div>
      </div>

      {/* TAB: WHATSAPP-FIRST WORKFLOW (Prompt 3) */}
      {activeTab === 'whatsapp_flow' && (
        <div className="space-y-6">
          {/* Banner */}
          <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-6 shadow-md border border-emerald-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-800 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">WhatsApp-First Quoting & Invoicing Engine</h2>
                  <p className="text-xs text-emerald-300">
                    One-tap instant dispatch via <code className="font-mono bg-emerald-900 px-1.5 py-0.5 rounded text-white">wa.me</code> deep links, prefilled templates, and &lt;30s friction reduction for repeat customers.
                  </p>
                </div>
              </div>

              <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-700">
                Friction: &lt; 20 Seconds
              </span>
            </div>

            {/* <30s Repeat Customer Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-2">
              <div className="bg-emerald-900/70 border border-emerald-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-mono flex items-center justify-center text-[10px]">1</span>
                  Select Customer (5s)
                </div>
                <p className="text-[11px] text-emerald-200">
                  Pick existing client. Phone number, default trade, and job history autofill instantly.
                </p>
              </div>

              <div className="bg-emerald-900/70 border border-emerald-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-mono flex items-center justify-center text-[10px]">2</span>
                  Trade Preset (8s)
                </div>
                <p className="text-[11px] text-emerald-200">
                  1-tap preset loads callout fee, standard diagnostic labor rate, and parts templates.
                </p>
              </div>

              <div className="bg-emerald-900/70 border border-emerald-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-mono flex items-center justify-center text-[10px]">3</span>
                  Auto Calculations (2s)
                </div>
                <p className="text-[11px] text-emerald-200">
                  Dynamic rules compute deposit terms, tax rates, emergency surcharges, and total.
                </p>
              </div>

              <div className="bg-emerald-900/70 border border-emerald-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-mono flex items-center justify-center text-[10px]">4</span>
                  One-Tap Send (3s)
                </div>
                <p className="text-[11px] text-emerald-200">
                  Click 'Send via WhatsApp' to open prefilled native chat with summary + PDF link.
                </p>
              </div>
            </div>
          </div>

          {/* 6 Message Templates Grid */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>6 High-Conversion WhatsApp Message Templates</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Template 1: Quote Dispatch */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    1. Send Quotation
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Initial Dispatch
                  </span>
                </div>
                <pre className="bg-slate-900 text-emerald-300 p-3 rounded-lg text-[11px] font-mono whitespace-pre-wrap leading-relaxed h-44 overflow-y-auto">
{`Hi Sarah! 👋

Here is your quote from *Apex Plumbing*:

📄 *Quote Ref:* QT-2026-1001
🛠️ *Service:* Emergency Pipe Leak
💵 *Total:* *$455.00*
📌 *Deposit:* $227.50

*Included Services:*
• Diagnostic Call-out ($95.00)
• Pipe Clearing & Repair ($275.00)
• Shutoff Valve Kit ($85.00)

🔗 *View PDF & Photos:* https://app.quote/QT-2026-1001

Reply *'ACCEPT'* to lock in your job date!`}
                </pre>
              </div>

              {/* Template 2: Quote Follow-up */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    2. Quote Follow-Up
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                    3 Days Pending
                  </span>
                </div>
                <pre className="bg-slate-900 text-indigo-300 p-3 rounded-lg text-[11px] font-mono whitespace-pre-wrap leading-relaxed h-44 overflow-y-auto">
{`Hi Sarah! 👋

Following up on Quotation *QT-2026-1001* for *$455.00* sent on Aug 10.

It is scheduled to expire on *Aug 17*.

Would you like us to reserve your job time or adjust any line items for you?

Warm regards,
*Apex Plumbing*
📞 +1 (555) 019-2831`}
                </pre>
              </div>

              {/* Template 3: Quote Accepted Thank-you */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    3. Quote Accepted Thank-You
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Job Confirmed
                  </span>
                </div>
                <pre className="bg-slate-900 text-emerald-300 p-3 rounded-lg text-[11px] font-mono whitespace-pre-wrap leading-relaxed h-44 overflow-y-auto">
{`Hi Sarah! 🎉

Thank you for accepting Quotation *QT-2026-1001* ($455.00)!

We have confirmed your job on our calendar.

📌 *Deposit Received:* $227.50
💳 *Remaining Balance:* $227.50

Our technician will see you at *742 Evergreen Terrace*. See you soon!`}
                </pre>
              </div>

              {/* Template 4: Deposit Request */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    4. Deposit Request
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    Pre-Job Dispatch
                  </span>
                </div>
                <pre className="bg-slate-900 text-amber-300 p-3 rounded-lg text-[11px] font-mono whitespace-pre-wrap leading-relaxed h-44 overflow-y-auto">
{`Hi Sarah! 👋

To confirm Quotation *QT-2026-1001* and reserve materials, please arrange the deposit:

💵 *Deposit Amount:* *$227.50*
💳 *Total Quote:* $455.00

*Payment Details:*
Zelle / Bank Transfer: payments@apexplumbing.com

Please send a screenshot once completed. Thanks!`}
                </pre>
              </div>

              {/* Template 5: Send Invoice */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-sky-600" />
                    5. Send Invoice
                  </span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                    Job Completed
                  </span>
                </div>
                <pre className="bg-slate-900 text-sky-300 p-3 rounded-lg text-[11px] font-mono whitespace-pre-wrap leading-relaxed h-44 overflow-y-auto">
{`Hi Sarah! 👋

Here is Invoice *INV-2026-1001* from *Apex Plumbing*:

📄 *Invoice Ref:* INV-2026-1001
📅 *Due Date:* Aug 26, 2026
💳 *Balance Due:* *$227.50*

🔗 *View Invoice PDF:* https://app.quote/INV-2026-1001

Thank you for choosing Apex Plumbing! Please reply once sent.`}
                </pre>
              </div>

              {/* Template 6: Payment Reminder */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    6. Unpaid Invoice Reminder
                  </span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                    Overdue Notice
                  </span>
                </div>
                <pre className="bg-slate-900 text-rose-300 p-3 rounded-lg text-[11px] font-mono whitespace-pre-wrap leading-relaxed h-44 overflow-y-auto">
{`Hi Sarah,

Friendly reminder regarding Invoice *INV-2026-1001* from *Apex Plumbing*.

💵 *Outstanding Balance:* *$227.50*
📅 *Due Date:* Aug 26, 2026

Please arrange payment via Zelle / Bank Transfer to payments@apexplumbing.com.

If already paid, please send your transfer receipt. Thank you!`}
                </pre>
              </div>
            </div>
          </div>

          {/* Edge Cases & Technical Specs */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <span>WhatsApp Edge Cases & Technical Considerations</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <div className="font-bold text-slate-900">1. Missing or Invalid Phone Number</div>
                <p className="text-slate-600 text-[11px]">
                  If the customer record has no phone, the app prompts for an instant phone input before opening <code className="font-mono bg-slate-200 px-1 rounded">wa.me</code>, or copies text to clipboard.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <div className="font-bold text-slate-900">2. Country Code Auto-Formatting</div>
                <p className="text-slate-600 text-[11px]">
                  All phone numbers are sanitized with <code className="font-mono bg-slate-200 px-1 rounded">formatPhoneNumberForWhatsApp()</code>, stripping non-digit characters to ensure valid E.164 links.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <div className="font-bold text-slate-900">3. Mobile vs Desktop Web Fallback</div>
                <p className="text-slate-600 text-[11px]">
                  Automatically triggers native WhatsApp mobile application on iOS/Android, and falls back gracefully to WhatsApp Web on desktop browsers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PHOTO QUOTING SYSTEM (Prompt 4) */}
      {activeTab === 'photo_quoting' && (
        <div className="space-y-6">
          {/* Banner */}
          <div className="bg-indigo-950 text-indigo-100 rounded-2xl p-6 shadow-md border border-indigo-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-800 rounded-xl">
                  <Camera className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Photo-Based Quotation System</h2>
                  <p className="text-xs text-indigo-300">
                    Engineered specifically for Panel Beaters, Mobile Mechanics, Painters, Renovation, and Cleaning trades.
                  </p>
                </div>
              </div>

              <span className="bg-indigo-800 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full border border-indigo-700">
                Visual Proof Engine
              </span>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-2">
              <div className="bg-indigo-900/70 border border-indigo-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" />
                  Damage Area Tagging
                </div>
                <p className="text-[11px] text-indigo-200">
                  Tag specific body panels, wall areas, or mechanical components directly on captured photos.
                </p>
              </div>

              <div className="bg-indigo-900/70 border border-indigo-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  Customer vs Internal
                </div>
                <p className="text-[11px] text-indigo-200">
                  Toggle photo visibility. Keep internal shop notes hidden while showing clean photos in customer PDFs.
                </p>
              </div>

              <div className="bg-indigo-900/70 border border-indigo-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                  Before / After Pairs
                </div>
                <p className="text-[11px] text-indigo-200">
                  Organize inspection photos into Before/After pairs for pre-repair proof and completion sign-off.
                </p>
              </div>

              <div className="bg-indigo-900/70 border border-indigo-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-pink-400" />
                  Fast Photo Pricing
                </div>
                <p className="text-[11px] text-indigo-200">
                  1-click convert tagged damage areas directly into estimated labor hours, paint materials, and parts cost.
                </p>
              </div>
            </div>
          </div>

          {/* 5 Trade Implementations Matrix */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Wrench className="w-4 h-4 text-indigo-600" />
              <span>5 Trade Applications & Custom Tagging Schemas</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Panel Beaters */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold pb-2 border-b border-slate-100">
                  <Car className="w-4 h-4 text-amber-600" />
                  <span>1. Panel Beaters & Auto Body</span>
                </div>
                <div className="space-y-1 text-slate-600">
                  <div><strong>Tags:</strong> Front Bumper, Left/Right Fender, Hood, Roof, Quarter Panel</div>
                  <div><strong>Repairs:</strong> Dent extraction, metallic paint blend, clear coat 2K</div>
                  <div><strong>Output:</strong> Photos in PDF show red callout pins on bumper creases</div>
                </div>
              </div>

              {/* Mobile Mechanics */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-indigo-800 font-bold pb-2 border-b border-slate-100">
                  <Wrench className="w-4 h-4 text-indigo-600" />
                  <span>2. Mobile Mechanics</span>
                </div>
                <div className="space-y-1 text-slate-600">
                  <div><strong>Tags:</strong> Brake Assembly, Engine Bay OBD, Suspension, Fluids</div>
                  <div><strong>Repairs:</strong> Rotor resurfacing, pad replacement, oil seal replacement</div>
                  <div><strong>Output:</strong> Internal diagnostic photos hidden, brake pad wear photo in PDF</div>
                </div>
              </div>

              {/* Painters */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-pink-800 font-bold pb-2 border-b border-slate-100">
                  <Paintbrush className="w-4 h-4 text-pink-600" />
                  <span>3. House Painters</span>
                </div>
                <div className="space-y-1 text-slate-600">
                  <div><strong>Tags:</strong> Living Room Prep, Trim Enamel, Ceiling Water Stains</div>
                  <div><strong>Repairs:</strong> Sanding, primer coat, two-coat acrylic finish</div>
                  <div><strong>Output:</strong> Wall water-damage before/after comparison layout in quote</div>
                </div>
              </div>

              {/* Renovation */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold pb-2 border-b border-slate-100">
                  <Home className="w-4 h-4 text-emerald-600" />
                  <span>4. Renovation & Handyman</span>
                </div>
                <div className="space-y-1 text-slate-600">
                  <div><strong>Tags:</strong> Drywall Cracks, Subfloor Damage, Tile Grout Access</div>
                  <div><strong>Repairs:</strong> Joint compound patching, subfloor leveling, trim fitting</div>
                  <div><strong>Output:</strong> Multi-photo damage callouts mapped to sub-contractor items</div>
                </div>
              </div>

              {/* Cleaning */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-sky-800 font-bold pb-2 border-b border-slate-100">
                  <Droplet className="w-4 h-4 text-sky-600" />
                  <span>5. Deep Cleaning Trades</span>
                </div>
                <div className="space-y-1 text-slate-600">
                  <div><strong>Tags:</strong> Oven Grease, Bathroom Tile Grout, Carpet Stain Area</div>
                  <div><strong>Repairs:</strong> Steam extraction, bio-hazard sanitize, high-pressure wash</div>
                  <div><strong>Output:</strong> Before/After photo gallery attached to completion invoice</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: PROFESSION PRESETS */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-950 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-indigo-900">8 Priority Launch Segments Pre-Configured</p>
              <p className="mt-0.5 text-indigo-800">
                Select any trade template below to launch the Quote Builder pre-populated with call-out fees, labor rates, parts lists, and custom input schemas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tradeTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 shrink-0">
                        {getIcon(template.iconName)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                          {template.professionName}
                        </h3>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {template.categoryGroup}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Pre-configured Line Items Preview */}
                  <div className="space-y-1.5 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px]">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Pre-configured Line Items
                    </div>
                    {template.defaultLineItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700">
                        <span className="truncate pr-2">• {item.description}</span>
                        <span className="font-mono font-bold shrink-0">
                          {profile.currencySymbol}{item.unitPrice}/{item.unit || 'unit'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Custom Schema Badge */}
                  {template.customInputsSchema && template.customInputsSchema.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mb-4">
                      <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{template.customInputsSchema.length} Custom Trade Inputs</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onSelectTemplateToBuild(template)}
                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Use Template in Builder</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SCHEMA & RULES INSPECTOR */}
      {activeTab === 'schema_inspector' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Generic Quote Model Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">1. Generic Quote Model</h3>
              </div>
              <p className="text-xs text-slate-600">
                Core database entity shared across all trades with unified financial breakdown and status machine.
              </p>
              <div className="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono space-y-1">
                <div>• id: string (UUID)</div>
                <div>• quoteNumber: string ("QT-2026-X")</div>
                <div>• customerId & serviceAddress</div>
                <div>• status: draft | sent | accepted | converted</div>
                <div>• lineItems: QuoteLineItem[]</div>
                <div>• customFields: Record&lt;string, any&gt;</div>
                <div>• appliedPricingRules: RuleSummary[]</div>
                <div>• financials: subtotal, callout, total, deposit</div>
              </div>
            </div>

            {/* Dynamic Service Fields Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">2. Dynamic Custom Fields</h3>
              </div>
              <p className="text-xs text-slate-600">
                Extensible input schema mapping profession-specific parameters directly to line item generators.
              </p>
              <div className="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono space-y-1">
                <div>• Plumber: leakType, emergencyCallout</div>
                <div>• Tutor: subject, durationHours, kmDistance</div>
                <div>• Panel Beater: paintMatching, clearCoatSpec</div>
                <div>• Photographer: shootType, deliverablePhotos</div>
                <div>• Aircon: unitCount, gasTopUpPressure</div>
                <div>• Mechanic: vehicleInfo, roadsideZone</div>
              </div>
            </div>

            {/* Pricing Rules & Formulas Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Calculator className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">3. Pricing Rules & Formulas</h3>
              </div>
              <p className="text-xs text-slate-600">
                Automated surcharge rules, distance formulas, and category percentage markups triggered on-site.
              </p>
              <div className="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono space-y-1">
                <div>• After-Hours: +$75 fixed callout</div>
                <div>• Mileage Tier: (km - 10) * $1.50/km</div>
                <div>• AP / SAT Prep: +15% labor markup</div>
                <div>• Metallic Paint: +20% materials markup</div>
                <div>• Hydraulic Pull: +$250 labor surcharge</div>
                <div>• Wedding Package: +25% total markup</div>
              </div>
            </div>
          </div>

          {/* Trade Schemas Matrix Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-100 border-b border-slate-200 font-bold text-slate-800 text-xs flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span>Category Schema Matrix Comparison</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Profession</th>
                    <th className="p-3">Primary Category Focus</th>
                    <th className="p-3">Dynamic Schema Fields</th>
                    <th className="p-3">Automated Pricing Rules & Formulas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  <tr>
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <Droplet className="w-4 h-4 text-sky-600" /> Plumbers
                    </td>
                    <td className="p-3">Call-out + Parts + Labor</td>
                    <td className="p-3 font-mono text-slate-600">leakType, emergencyCallout, pipeMaterial</td>
                    <td className="p-3 text-slate-600">After-hours +$75 surcharge, weekend +$50</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-600" /> Private Tutors
                    </td>
                    <td className="p-3">Subject + Duration + Travel</td>
                    <td className="p-3 font-mono text-slate-600">subject, durationHours, travelDistanceKm</td>
                    <td className="p-3 text-slate-600">AP/SAT +15% labor markup, mileage &gt;10km formula</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-amber-600" /> Panel Beaters
                    </td>
                    <td className="p-3">Photos + Damage Areas + Repair</td>
                    <td className="p-3 font-mono text-slate-600">damageTags[], paintMatching, framePulling</td>
                    <td className="p-3 text-slate-600">Metallic paint +20% materials, hydraulic pull +$250</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-600" /> Photographers
                    </td>
                    <td className="p-3">Hours + Retouched Edits + Deliverables</td>
                    <td className="p-3 font-mono text-slate-600">shootType, deliverablePhotos, droneCoverage</td>
                    <td className="p-3 text-slate-600">Wedding premium +25%, drone coverage +$250</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: EXAMPLE JSON PAYLOADS */}
      {activeTab === 'json_examples' && (
        <div className="space-y-6">
          {/* Example Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'plumber', label: '🚰 Plumber', sub: 'Call-out + Parts + Labor' },
              { id: 'tutor', label: '📚 Tutor', sub: 'Subject + Duration + Travel' },
              { id: 'panelbeater', label: '🚘 Panel Beater', sub: 'Photos + Damage Areas' },
              { id: 'photographer', label: '📷 Photographer', sub: 'Hours + Edits + Package' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSelectedExampleKey(btn.id as any)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedExampleKey === btn.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="font-bold text-xs">{btn.label}</div>
                <div className="text-[10px] opacity-75 mt-0.5">{btn.sub}</div>
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  <span>{jsonExamples[selectedExampleKey].useCase}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {jsonExamples[selectedExampleKey].description}
                </p>
              </div>

              <button
                onClick={() => handleCopyJson(selectedExampleKey, jsonExamples[selectedExampleKey].json)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedKey === selectedExampleKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 text-[12px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[500px]">
              {JSON.stringify(jsonExamples[selectedExampleKey].json, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* TAB: FLUTTER CLEAN ARCHITECTURE (Prompt 5) */}
      {activeTab === 'flutter_code' && (
        <div className="space-y-6">
          {/* Banner */}
          <div className="bg-sky-950 text-sky-100 rounded-2xl p-6 shadow-md border border-sky-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-800 rounded-xl">
                  <Smartphone className="w-6 h-6 text-sky-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Flutter Mobile Clean Architecture Starter</h2>
                  <p className="text-xs text-sky-300">
                    Production-ready Dart codebase with Riverpod state management, local-first Hive DB, PDF generation, and WhatsApp sharing.
                  </p>
                </div>
              </div>

              <span className="bg-sky-800 text-sky-200 text-xs font-bold px-3 py-1 rounded-full border border-sky-700">
                Android & iOS Ready
              </span>
            </div>

            {/* Architectural Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-2">
              <div className="bg-sky-900/70 border border-sky-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-sky-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  Modular Layers
                </div>
                <p className="text-[11px] text-sky-200">
                  Separation of Data (Repositories/Hive), Domain (Models), and Presentation (Riverpod/Screens).
                </p>
              </div>

              <div className="bg-sky-900/70 border border-sky-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-sky-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Local-First DB
                </div>
                <p className="text-[11px] text-sky-200">
                  Offline-first Hive key-value storage with zero-friction sync readiness for Supabase/Firebase.
                </p>
              </div>

              <div className="bg-sky-900/70 border border-sky-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-sky-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Riverpod State
                </div>
                <p className="text-[11px] text-sky-200">
                  Compile-safe state notifiers for reactive quote builder updates and quote-to-invoice conversions.
                </p>
              </div>

              <div className="bg-sky-900/70 border border-sky-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-sky-300 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-pink-400" />
                  PDF & WhatsApp
                </div>
                <p className="text-[11px] text-sky-200">
                  Native PDF rendering via <code className="font-mono bg-sky-800 px-1 rounded">pdf</code> package and 1-tap WhatsApp deep links via <code className="font-mono bg-sky-800 px-1 rounded">url_launcher</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Directory Structure Inspector */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileCode className="w-4 h-4 text-sky-600" />
              <span>Flutter Project Folder Structure</span>
            </h3>

            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono space-y-1 overflow-x-auto leading-relaxed">
              <div className="text-sky-400 font-bold">quoteflow_mobile/</div>
              <div>├── pubspec.yaml</div>
              <div>├── lib/</div>
              <div>│   ├── main.dart</div>
              <div>│   ├── models/</div>
              <div>│   │   ├── customer.dart</div>
              <div>│   │   ├── quote.dart</div>
              <div>│   │   ├── invoice.dart</div>
              <div>│   │   ├── template.dart</div>
              <div>│   │   └── photo_attachment.dart</div>
              <div>│   ├── repositories/</div>
              <div>│   │   ├── quote_repository.dart</div>
              <div>│   │   ├── invoice_repository.dart</div>
              <div>│   │   └── customer_repository.dart</div>
              <div>│   ├── services/</div>
              <div>│   │   ├── local_storage_service.dart</div>
              <div>│   │   ├── pdf_service.dart</div>
              <div>│   │   ├── whatsapp_sharing_service.dart</div>
              <div>│   │   └── quote_to_invoice_converter.dart</div>
              <div>│   ├── providers/</div>
              <div>│   │   └── quote_provider.dart</div>
              <div>│   ├── screens/</div>
              <div>│   │   ├── dashboard_screen.dart</div>
              <div>│   │   ├── quote_builder_screen.dart</div>
              <div>│   │   ├── quote_detail_screen.dart</div>
              <div>│   │   └── invoices_screen.dart</div>
              <div>│   └── data/</div>
              <div>│       └── seed_data.dart</div>
            </div>
          </div>

          {/* Code File Selector */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span>Inspect Real Starter Dart Code</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'pubspec', label: 'pubspec.yaml', icon: '📦' },
                { id: 'quote_model', label: 'quote.dart (Model)', icon: '📄' },
                { id: 'quote_repo', label: 'quote_repository.dart', icon: '🗄️' },
                { id: 'converter', label: 'quote_to_invoice_converter.dart', icon: '🔄' },
                { id: 'pdf_service', label: 'pdf_service.dart', icon: '🖨️' },
                { id: 'whatsapp_service', label: 'whatsapp_sharing_service.dart', icon: '💬' },
                { id: 'dashboard_screen', label: 'dashboard_screen.dart', icon: '📱' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedFlutterFile(item.id as any)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedFlutterFile === item.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="truncate">{item.icon} {item.label}</div>
                </button>
              ))}
            </div>

            {/* Code Viewer Box */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 font-mono">
                  /flutter_app/{selectedFlutterFile === 'pubspec' ? 'pubspec.yaml' : `lib/.../${selectedFlutterFile}.dart`}
                </span>
                <span className="text-[10px] bg-sky-900 text-sky-200 px-2 py-0.5 rounded font-mono">
                  Dart / Flutter 3.x
                </span>
              </div>

              <pre className="p-4 text-[11px] font-mono text-sky-300 overflow-x-auto leading-relaxed max-h-[450px]">
                {selectedFlutterFile === 'pubspec' && `name: quoteflow_mobile
description: A clean modular Flutter application for local-first trade quoting, invoicing, photo annotations, PDF exports, and WhatsApp sharing.
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.4.9
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  go_router: ^13.1.0
  pdf: ^3.10.7
  printing: ^5.12.0
  url_launcher: ^6.2.4
  uuid: ^4.3.3
  intl: ^0.19.0`}

                {selectedFlutterFile === 'quote_model' && `class Quote extends HiveObject {
  final String id;
  final String quoteNumber;
  final String customerName;
  final QuoteStatus status;
  final List<QuoteLineItem> lineItems;
  final double total;
  final double depositAmount;

  Quote({
    required this.id,
    required this.quoteNumber,
    required this.customerName,
    required this.status,
    required this.lineItems,
    required this.total,
    required this.depositAmount,
  });
}`}

                {selectedFlutterFile === 'quote_repo' && `abstract class IQuoteRepository {
  Future<List<Quote>> getAllQuotes();
  Future<Quote?> getQuoteById(String id);
  Future<void> saveQuote(Quote quote);
  Future<void> updateQuoteStatus(String id, QuoteStatus status);
}

class LocalQuoteRepository implements IQuoteRepository {
  final Map<String, Quote> _store = {};
  @override
  Future<List<Quote>> getAllQuotes() async => _store.values.toList();
  @override
  Future<void> saveQuote(Quote quote) async => _store[quote.id] = quote;
}`}

                {selectedFlutterFile === 'converter' && `class QuoteToInvoiceConverter {
  static Invoice convert(Quote quote, {int paymentTermsDays = 14}) {
    final double initialPaid = quote.depositRequired ? quote.depositAmount : 0.0;
    final double balance = (quote.total - initialPaid).clamp(0.0, double.infinity);

    return Invoice(
      id: const Uuid().v4(),
      invoiceNumber: quote.quoteNumber.replaceAll('QT-', 'INV-'),
      convertedFromQuoteId: quote.id,
      customerName: quote.customerName,
      status: balance == 0.0 ? InvoiceStatus.paid : InvoiceStatus.unpaid,
      balanceDue: balance,
    );
  }
}`}

                {selectedFlutterFile === 'pdf_service' && `class PdfService implements IPdfService {
  @override
  Future<Uint8List> buildQuotePdf(Quote quote, String businessName) async {
    final pdf = pw.Document();
    pdf.addPage(
      pw.Page(
        build: (pw.Context context) => pw.Column(
          children: [
            pw.Text(businessName, style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold)),
            pw.Text('Quote Ref: \${quote.quoteNumber}'),
            pw.TableHelper.fromTextArray(
              headers: ['Description', 'Amount'],
              data: quote.lineItems.map((i) => [i.description, '\$\${i.amount}']).toList(),
            ),
          ],
        ),
      ),
    );
    return pdf.save();
  }
}`}

                {selectedFlutterFile === 'whatsapp_service' && `class WhatsAppSharingService {
  static Future<bool> sendQuote({required Quote quote, required String phone}) async {
    final text = 'Hi \${quote.customerName}! Quote Ref: \${quote.quoteNumber}. Total: \$\${quote.total}';
    final uri = Uri.parse('https://wa.me/\$phone?text=\${Uri.encodeComponent(text)}');
    return await launchUrl(uri, mode: LaunchMode.externalApplication);
  }
}`}

                {selectedFlutterFile === 'dashboard_screen' && `class DashboardScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final quotes = ref.watch(quotesNotifierProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('QuoteFlow Mobile')),
      body: ListView.builder(
        itemCount: quotes.length,
        itemBuilder: (ctx, idx) => ListTile(
          title: Text(quotes[idx].customerName),
          subtitle: Text(quotes[idx].quoteNumber),
        ),
      ),
    );
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
