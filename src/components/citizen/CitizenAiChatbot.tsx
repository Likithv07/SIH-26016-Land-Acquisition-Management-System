import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Bot,
  X,
  Send,
  Sparkles,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  CreditCard,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickAction?: {
    label: string;
    view: 'dashboard' | 'citizen_compensation' | 'citizen_land' | 'consent' | 'grievance' | 'documents';
  };
}

const PRESET_QUESTIONS = [
  {
    en: 'How is my compensation calculated?',
    hi: 'मेरी मुआवज़ा राशि की गणना कैसे की जाती है?',
    te: 'నా పరిహారం మొత్తం ఎలా లెక్కించబడుతుంది?',
  },
  {
    en: 'When will the money reach my bank account?',
    hi: 'मुआवज़ा राशि मेरे बैंक खाते में कब आएगी?',
    te: 'నా బ్యాంకు ఖాతాలో డబ్బులు ఎప్పుడు జమ అవుతాయి?',
  },
  {
    en: 'What is 100% Solatium and Rural Multiplier?',
    hi: '100% सोलेशियम और ग्रामीण गुणक क्या है?',
    te: '100% సొలేషియం మరియు గ్రామీణ గుణకం అంటే ఏమిటి?',
  },
  {
    en: 'How do I raise an objection under Section 15(1)?',
    hi: 'धारा 15(1) के तहत आपत्ति कैसे दर्ज करें?',
    te: 'సెక్షన్ 15(1) కింద అభ్యంతరం ఎలా దాఖలు చేయాలి?',
  },
  {
    en: 'What documents are required for Aadhaar eSign?',
    hi: 'आधार ई-हस्ताक्षर के लिए कौन से दस्तावेज़ चाहिए?',
    te: 'ఆధార్ ఈ-సైన్ కోసం ఏ పత్రాలు అవసరం?',
  },
];

const BOT_KNOWLEDGE: Record<string, { answerEn: string; answerHi: string; answerTe: string; action?: { label: string; view: any } }> = {
  compensation: {
    answerEn:
      'Under the RFCTLARR Act 2013 (First Schedule), compensation is calculated using this statutory formula:\n\n1. Basic Market Rate × Area\n2. Rural Multiplier Factor (1.5x in your district)\n3. 100% Statutory Solatium (equal to 100% of market value)\n4. Asset Valuation (trees, wells, structures)\n5. 12% Per Annum Additional Market Value (from notification date)\n\nFor your Survey No. 145/2 (2.5 Acres), your sanctioned gross award is ₹72,25,000, deposited directly via PFMS DBT.',
    answerHi:
      'RFCTLARR अधिनियम 2013 की पहली अनुसूची के अनुसार, मुआवज़े की गणना इस प्रकार की जाती है:\n1. मूल बाज़ार दर × क्षेत्रफल\n2. ग्रामीण गुणक (आपके जिले में 1.5x)\n3. 100% अनिवार्य सोलेशियम (बाजार मूल्य का 100%)\n4. परिसंपत्ति मूल्यांकन (पेड़, कुएं, निर्माण)\n\nआपके सर्वे सं. 145/2 (2.5 एकड़) के लिए कुल स्वीकृत राशि ₹72,25,000 है जो सीधे आपके बैंक खाते में जमा होगी।',
    answerTe:
      'RFCTLARR చట్టం 2013 ప్రకారం పరిహారం ఈ క్రింది విధంగా లెక్కించబడుతుంది:\n1. ప్రాథమిక మార్కెట్ విలువ × విస్తీర్ణం\n2. గ్రామీణ గుణకం (1.5x)\n3. 100% చట్టబద్ధమైన సొలేషియం (మార్కెట్ విలువకు సమానం)\n4. ఆస్తుల విలువ (చెట్లు, బావులు, నిర్మాణాలు)\n\nమీ సర్వే నం. 145/2 (2.5 ఎకరాలు) కోసం మొత్తం ₹72,25,000 మంజూరు చేయబడింది.',
    action: { label: 'View Full Compensation Award', view: 'citizen_compensation' },
  },
  disbursement: {
    answerEn:
      'Compensation disbursement takes place via Public Financial Management System (PFMS) Direct Benefit Transfer (DBT):\n\n• Once you execute digital Aadhaar eSign consent, the award is sealed by the Competent Authority (CALA).\n• Treasury bank mandate (RBI NEFT) processes funds within 3 to 7 working days.\n• Funds are credited directly to your registered State Bank of India account (•••4892) without any middlemen or deductions.',
    answerHi:
      'मुआवजा राशि का भुगतान सार्वजनिक वित्तीय प्रबंधन प्रणाली (PFMS) के माध्यम से सीधे लाभार्थी के खाते (DBT) में किया जाता है:\n• आधार ई-हस्ताक्षर पूरा होने के बाद आदेश जारी होता है।\n• 3 से 7 कार्य दिवसों में राशि आपके भारतीय स्टेट बैंक (SBI •••4892) खाते में क्रेडिट हो जाएगी।',
    answerTe:
      'పరిహారం చెల్లింపు PFMS DBT ద్వారా నేరుగా జరుగుతుంది:\n• మీరు ఆధార్ ఈ-సైన్ పూర్తి చేసిన వెంటనే ఆర్డర్ జారీ అవుతుంది.\n• 3 నుండి 7 పని దినాలలో మీ స్టేట్ బ్యాంక్ ఆఫ్ ఇండియా ఖాతాలో (•••4892) నగదు జమ అవుతుంది.',
    action: { label: 'Complete Aadhaar eSign Now', view: 'consent' },
  },
  solatium: {
    answerEn:
      '100% Solatium is a statutory compensation mandated under Section 30(1) of the RFCTLARR Act 2013. It is paid over and above the total market value of the acquired land to compensate landowners for the compulsory nature of the acquisition. In addition, rural lands benefit from a 1.25x to 2.0x distance multiplier factor.',
    answerHi:
      '100% सोलेशियम (Solatium) RFCTLARR अधिनियम 2013 की धारा 30(1) के तहत अनिवार्य अतिरिक्त राशि है। यह अनिवार्य अधिग्रहण के कारण हुए कष्ट की भरपाई के लिए ज़मीन के बाज़ार मूल्य का शत-प्रतिशत (100%) अतिरिक्त दिया जाता है।',
    answerTe:
      '100% సొలేషియం అనేది RFCTLARR చట్టం 2013 సెక్షన్ 30(1) క్రింద చట్టబద్ధమైన చెల్లింపు. ఇది బలవంతపు భూసేకరణకు గాను మార్కెట్ విలువపై అదనంగా ఇచ్చే 100% బోనస్ లేదా నష్టపరిహారం.',
    action: { label: 'Check Award Solatium Slip', view: 'citizen_compensation' },
  },
  objection: {
    answerEn:
      'Under Section 15(1) of the RFCTLARR Act (or Section 3C of the NH Act 1956), any interested landowner has the legal right to submit written objections within 21 to 30 days of the Preliminary Notification.\n\nYou can submit an objection regarding:\n• Discrepancy in acquired area or survey boundaries\n• Inadequate circle rate valuation\n• Non-inclusion of standing crops, wells, or trees\n\nYou can file your grievance directly on the BhoomiSetu Grievance Portal.',
    answerHi:
      'अधिनियम की धारा 15(1) के तहत प्रारंभिक अधिसूचना के 21 से 30 दिनों के भीतर कोई भी भू-स्वामी आपत्ति दर्ज कर सकता है। आप भूमि माप, बाज़ार दर, या पेड़ों/संरचनाओं के मूल्यांकन के संबंध में भूमिसेतु पोर्टल से सीधे शिकायत दर्ज कर सकते हैं।',
    answerTe:
      'సెక్షన్ 15(1) ప్రకారం నోటిఫికేషన్ వచ్చిన 21-30 రోజులలోపు ఎవరైనా భూయజమాని లిఖితపూర్వక అభ్యంతరం తెలపవచ్చు. విస్తీర్ణం, రేటు లేదా చెట్లు/బావుల పరిహారం విషయంలో మీరు నేరుగా భూమిసేతు పోర్టల్ ద్వారా ఫిర్యాదు చేయవచ్చు.',
    action: { label: 'Submit Grievance / Objection', view: 'grievance' },
  },
  esign: {
    answerEn:
      'Aadhaar eSign is fully recognized under Section 3A of the Information Technology Act 2000 and CDAC/NSDL e-Governance standards. To complete consent:\n\n1. Ensure your mobile number is linked with your Aadhaar card.\n2. Click "Execute Aadhaar eSign" on your Citizen Portal.\n3. Enter the 6-digit OTP received on your mobile.\n4. Your digital consent signature is cryptographically stamped on Form 16-C.',
    answerHi:
      'आधार ई-हस्ताक्षर सूचना प्रौद्योगिकी अधिनियम 2000 के तहत पूर्णतः वैध है। इसके लिए आपका मोबाइल नंबर आधार से जुड़ा होना चाहिए। OTP दर्ज करते ही आपका फॉर्म 16-C डिजिटल रूप से सत्यापित हो जाएगा।',
    answerTe:
      'ఆధార్ ఈ-సైన్ IT చట్టం 2000 ప్రకారం చట్టబద్ధమైనది. మీ ఆధార్‌కు లింక్ అయిన మొబైల్ నంబర్‌కు వచ్చే 6 అంకెల OTP నమోదు చేయడం ద్వారా మీరు డిజిటల్ సమ్మతిని సులభంగా పూర్తి చేయవచ్చు.',
    action: { label: 'Go to Digital eSign Page', view: 'consent' },
  },
};

interface CitizenAiChatbotProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CitizenAiChatbot: React.FC<CitizenAiChatbotProps> = ({ isOpen, onClose }) => {
  const { setCurrentView, showToast, isChatbotOpen, setIsChatbotOpen, userRole, landParcels, selectedParcelId } = useApp();
  const effectiveIsOpen = isOpen !== undefined ? isOpen : isChatbotOpen;
  const handleClose = onClose || (() => setIsChatbotOpen(false));

  // Strictly restricted to Citizen Portal
  if (userRole !== 'citizen') {
    return null;
  }

  const citizenParcel =
    landParcels.find((p) => p.id === selectedParcelId) || landParcels[0];

  const [language, setLanguage] = useState<'en' | 'hi' | 'te'>('en');
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const initialGreeting =
    language === 'hi'
      ? 'नमस्ते! मैं भूमिमित्र (BhoomiMitra) हूँ - नागरिक पोर्टल हेतु आपका भूमि अधिग्रहण एवं मुआवज़ा AI सहायक। आप अपनी ज़मीन, मुआवज़े की गणना, 100% सोलेशियम या आधार ई-हस्ताक्षर के बारे में कोई भी प्रश्न पूछ सकते हैं।'
      : language === 'te'
      ? 'నమస్కారం! నేను భూమిమిత్ర (BhoomiMitra) - సిటిజన్ పోర్టల్ కోసం మీ భూసేకరణ మరియు పరిహార AI సహాయకుడిని. మీ భూమి సర్వే, RFCTLARR పరిహారం లెక్కింపు లేదా ఆధార్ ఈ-సైన్ గురించి నన్ను ఏదైనా అడగవచ్చు.'
      : 'Namaste! I am BhoomiMitra, your Citizen Portal National Land Acquisition AI Assistant. Ask me anything regarding your land survey, RFCTLARR 2013 compensation calculation, Solatium, or Aadhaar eSign status.';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: initialGreeting,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!effectiveIsOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const qLower = query.toLowerCase();

    // 1. Try real backend Gemini API call with citizen case context and abort timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
          context: citizenParcel
            ? {
                landownerName: citizenParcel.landownerName,
                surveyNumber: citizenParcel.surveyNumber,
                areaAcres: citizenParcel.areaAcres,
                landType: citizenParcel.landType,
                projectName: citizenParcel.projectName,
                village: citizenParcel.village,
                district: citizenParcel.district,
                totalCompensation: citizenParcel.totalCompensation,
                consentStatus: citizenParcel.consentReceived ? 'Consent Given' : 'Pending',
              }
            : undefined,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          let quickAction = undefined;
          if (qLower.includes('compensat') || qLower.includes('award') || qLower.includes('money') || qLower.includes('rate') || qLower.includes('मुआवज़') || qLower.includes('పరిహార')) {
            quickAction = { label: 'View My Compensation Award', view: 'citizen_compensation' as const };
          } else if (qLower.includes('sign') || qLower.includes('consent') || qLower.includes('aadhaar') || qLower.includes('आधार') || qLower.includes('ఈ-సైన్')) {
            quickAction = { label: 'Complete Aadhaar eSign', view: 'consent' as const };
          } else if (qLower.includes('grievance') || qLower.includes('object') || qLower.includes('dispute') || qLower.includes('शिकायत') || qLower.includes('ఫిర్యాదు')) {
            quickAction = { label: 'File Statutory Grievance', view: 'grievance' as const };
          } else if (qLower.includes('map') || qLower.includes('fmb') || qLower.includes('survey') || qLower.includes('నక్షా')) {
            quickAction = { label: 'Open Cadastral FMB Map', view: 'citizen_land' as const };
          } else if (qLower.includes('document') || qLower.includes('record') || qLower.includes('दस्तावेज़')) {
            quickAction = { label: 'Open Documents Vault', view: 'documents' as const };
          }

          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: data.reply,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              quickAction,
            },
          ]);
          setIsTyping(false);
          return;
        }
      }
    } catch (err) {
      console.warn('BhoomiMitra API request error, proceeding with statutory fallback knowledge:', err);
    }

    // 2. Intelligent statutory domain fallback if API is unreachable or times out
    setTimeout(() => {
      let botResponse: ChatMessage;

      if (qLower.includes('calculat') || qLower.includes('how much') || qLower.includes('formula') || qLower.includes('गणना') || qLower.includes('లెక్కిం')) {
        const item = BOT_KNOWLEDGE.compensation;
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'hi' ? item.answerHi : language === 'te' ? item.answerTe : item.answerEn,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickAction: item.action,
        };
      } else if (qLower.includes('when') || qLower.includes('bank') || qLower.includes('disburs') || qLower.includes('account') || qLower.includes('खाते') || qLower.includes('ఎప్పుడు') || qLower.includes('ఖాతా')) {
        const item = BOT_KNOWLEDGE.disbursement;
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'hi' ? item.answerHi : language === 'te' ? item.answerTe : item.answerEn,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickAction: item.action,
        };
      } else if (qLower.includes('solatium') || qLower.includes('multiplier') || qLower.includes('सोलेशियम') || qLower.includes('సొలేషియం')) {
        const item = BOT_KNOWLEDGE.solatium;
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'hi' ? item.answerHi : language === 'te' ? item.answerTe : item.answerEn,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickAction: item.action,
        };
      } else if (qLower.includes('object') || qLower.includes('grievance') || qLower.includes('dispute') || qLower.includes('complain') || qLower.includes('आपत्ति') || qLower.includes('ఫిర్యాదు') || qLower.includes('అభ్యంతరం')) {
        const item = BOT_KNOWLEDGE.objection;
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'hi' ? item.answerHi : language === 'te' ? item.answerTe : item.answerEn,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickAction: item.action,
        };
      } else if (qLower.includes('esign') || qLower.includes('sign') || qLower.includes('aadhaar') || qLower.includes('otp') || qLower.includes('आधार') || qLower.includes('ఆధార్') || qLower.includes('సంతకం')) {
        const item = BOT_KNOWLEDGE.esign;
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'hi' ? item.answerHi : language === 'te' ? item.answerTe : item.answerEn,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickAction: item.action,
        };
      } else {
        const fallbackText =
          language === 'hi'
            ? `आपके प्रश्न "${query}" के संबंध में:\n\nभूमि अधिग्रहण एवं पुनर्वास अधिनियम 2013 के अनुसार, आपके समस्त विधिक अधिकार पूर्णतः सुरक्षित हैं। सर्वे सं. 145/2 (2.5 एकड़) के लिए 100% सोलेशियम सहित कुल ₹72,25,000 की राशि स्वीकृत है। आप पोर्टल के माध्यम से सीधे मुआवज़ा आदेश देख सकते हैं या शिकायत दर्ज कर सकते हैं।`
            : language === 'te'
            ? `మీ ప్రశ్న "${query}" గురించి:\n\nRFCTLARR చట్టం 2013 ప్రకారం మీ సర్వే నెం. 145/2 (2.5 ఎకరాలు) కు 100% సొలేషియంతో కలిపి ₹72,25,000 పరిహారం నిర్ణయించబడింది. మీరు పోర్టల్ ద్వారా పరిహార వివరాలు చూడవచ్చు లేదా నేరుగా ఆన్‌లైన్‌లో వినతిపత్రం దాఖలు చేయవచ్చు.`
            : `Regarding your query "${query}":\n\nUnder the statutory provisions of the RFCTLARR Act 2013 & NH Act 1956, your survey particulars (Sy 145/2, 2.5 Acres) have completed Section 3D declaration. You are entitled to 100% Solatium plus statutory interest totaling ₹72,25,000. You can inspect your itemized valuation or file a formal inquiry directly on BhoomiSetu.`;

        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickAction: { label: 'Open My Compensation Award', view: 'citizen_compensation' },
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 400);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        sender: 'bot',
        text: initialGreeting,
        timestamp: 'Just now',
      },
    ]);
    showToast('BhoomiMitra chat restarted', 'info');
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-200 shadow-2xl rounded-2xl bg-white border border-slate-200 flex flex-col overflow-hidden ${
        isMinimized
          ? 'bottom-6 right-6 w-72 h-14'
          : 'bottom-6 right-4 sm:right-8 w-[94vw] sm:w-[440px] h-[580px] max-h-[85vh]'
      }`}
    >
      {/* Chat Window Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between shrink-0 shadow-xs select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-blue-200">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm leading-tight text-white">BhoomiMitra AI</h3>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                Citizen Sahayak
              </span>
            </div>
            <p className="text-[10px] text-blue-200 leading-tight">
              Statutory Land Acquisition Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-200">
          {/* Language Switcher */}
          {!isMinimized && (
            <div className="flex items-center bg-white/10 rounded-lg p-0.5 mr-1 border border-white/10 text-[10.5px]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  language === 'en' ? 'bg-white text-blue-950 font-bold' : 'text-blue-100 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  language === 'hi' ? 'bg-white text-blue-950 font-bold' : 'text-blue-100 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  language === 'te' ? 'bg-white text-blue-950 font-bold' : 'text-blue-100 hover:text-white'
                }`}
              >
                తెలుగు
              </button>
            </div>
          )}

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
            title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
            title="Close Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs">
            {/* Disclaimer pill */}
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200/80 text-[11px] text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                Statutory guidance based on <strong>RFCTLARR Act 2013</strong> & <strong>National Highways Act</strong>. All DBT payouts are authorized by District Competent Authorities.
              </span>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Frequently Asked Citizen Questions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUESTIONS.map((pq, idx) => {
                  const text = language === 'hi' ? pq.hi : language === 'te' ? pq.te : pq.en;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(text)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200/90 text-[11px] font-medium transition-all shadow-2xs text-left"
                    >
                      {text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Messages */}
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-2xs ${
                      isBot
                        ? 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                        : 'bg-blue-700 text-white rounded-tr-xs'
                    }`}
                  >
                    {isBot && (
                      <div className="flex items-center gap-1.5 mb-1.5 text-blue-900 font-bold text-[11px]">
                        <Sparkles className="w-3 h-3 text-blue-700" />
                        <span>BhoomiMitra AI</span>
                      </div>
                    )}
                    <p>{msg.text}</p>

                    {/* Optional Quick Action inside bot response */}
                    {msg.quickAction && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => {
                            if (msg.quickAction) {
                              setCurrentView(msg.quickAction.view);
                              handleClose();
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <span>{msg.quickAction.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-[9.5px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl w-fit shadow-2xs">
                <Bot className="w-3.5 h-3.5 text-blue-700 animate-pulse" />
                <span className="text-slate-500 text-xs font-medium">BhoomiMitra is analyzing statutory guidelines...</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'अपना प्रश्न यहां पूछें (उदा. मुआ‌वज़ा कब मिलेगा)...'
                    : language === 'te'
                    ? 'మీ ప్రశ్నను ఇక్కడ అడగండి (ఉదా: పరిహారం ఎప్పుడు)...'
                    : 'Ask your land or compensation question...'
                }
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-colors shadow-2xs shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleResetChat}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Restart Chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
