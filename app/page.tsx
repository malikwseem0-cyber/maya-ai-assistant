'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Sparkles,
  Bookmark,
  Heart,
  Briefcase,
  Settings as SettingsIcon,
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Code2,
  ListTodo,
  ShieldCheck,
  Zap,
  RefreshCw,
  FolderOpen,
  Terminal,
  HelpCircle,
  Menu,
  X,
  Compass,
  Moon,
  Sun,
  Smile,
  Sliders,
  FileText
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  persona: string;
}

interface VaultItem {
  id: string;
  title: string;
  content: string;
  category: 'Prompt' | 'Snippet' | 'Note' | 'Summary';
  tags: string[];
  date: string;
}

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  aiSuggested?: boolean;
}

const PERSONAS = [
  { id: 'zen', name: 'MasterPeace Zen', desc: 'Calm, mindful, philosophical guide', instruction: 'You are MasterPeace Zen, a peaceful, wise, and grounding meditation and life coach.' },
  { id: 'coder', name: 'Code Architect', desc: 'Senior full-stack engineering expert', instruction: 'You are Code Architect, an expert software engineer providing clean, secure, and production-ready TypeScript/React code.' },
  { id: 'muse', name: 'Creative Muse', desc: 'Imaginative storyteller & writer', instruction: 'You are Creative Muse, an evocative, imaginative storyteller with exquisite vocabulary.' },
  { id: 'analyst', name: 'Logical Analyst', desc: 'Rigorous problem solver & researcher', instruction: 'You are Logical Analyst, a precise researcher who breaks down complex problems into structured insights.' },
];

const PROMPT_TEMPLATES = [
  { id: '1', title: 'React Component Architecture', category: 'Coding', prompt: 'Design a high-performance React component for {{feature}} with Tailwind CSS, accessibility compliance, and smooth animations using motion/react.' },
  { id: '2', title: 'Mindful Morning Reflection', category: 'Mindfulness', prompt: 'Write a grounding morning reflection focusing on intention-setting for {{goal}} with gentle encouragement.' },
  { id: '3', title: 'Executive Summary', category: 'Productivity', prompt: 'Summarize the following notes or text into 3 key takeaways and actionable bullet points: {{text}}' },
  { id: '4', title: 'Bug Root Cause Analysis', category: 'Coding', prompt: 'Analyze this bug report or error stack trace and provide step-by-step troubleshooting and fix: {{error}}' },
];

export default function MasterPeaceApp() {
  const [activeTab, setActiveTab] = useState<'chat' | 'studio' | 'vault' | 'peace' | 'workspace' | 'mobile' | 'agents' | 'settings'>('chat');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Chat state
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Welcome to MasterPeace AI',
      persona: 'zen',
      messages: [
        {
          id: 'm1',
          role: 'assistant',
          content: 'Hello! I am your MasterPeace AI companion. How can I assist your workflow, inspire your creativity, or bring tranquility to your day?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState('1');
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [temperature, setTemperature] = useState(0.7);

  // Prompt Studio state
  const [selectedTemplate, setSelectedTemplate] = useState(PROMPT_TEMPLATES[0]);
  const [templateVars, setTemplateVars] = useState<Record<string, string>>({ feature: 'Dashboard Analytics', goal: 'Clarity and Focus', text: '', error: '' });
  const [studioOutput, setStudioOutput] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Memory Vault state
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([
    { id: 'v1', title: 'Clean Architecture Principles', content: 'Separate domain logic from UI presentation. Use dependency injection and robust error boundaries.', category: 'Snippet', tags: ['architecture', 'clean-code'], date: '2026-09-26' },
    { id: 'v2', title: 'Daily Breathing Routine', content: 'Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat 5 cycles.', category: 'Note', tags: ['mindfulness', 'health'], date: '2026-09-25' }
  ]);
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultCategoryFilter, setVaultCategoryFilter] = useState<string>('All');
  const [newVaultTitle, setNewVaultTitle] = useState('');
  const [newVaultContent, setNewVaultContent] = useState('');
  const [newVaultCategory, setNewVaultCategory] = useState<'Prompt' | 'Snippet' | 'Note' | 'Summary'>('Note');
  const [showVaultModal, setShowVaultModal] = useState(false);

  // Peace / Meditation state
  const [breathingState, setBreathingState] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [ambientSound, setAmbientSound] = useState<'rain' | 'forest' | 'waves' | 'none'>('none');
  const [dailyQuote, setDailyQuote] = useState('Peace comes from within. Do not seek it without.');

  // Workspace state
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 't1', text: 'Review Gemini API server integration', completed: true, priority: 'High' },
    { id: 't2', text: 'Draft system prompt for mindful assistant', completed: false, priority: 'Medium' },
    { id: 't3', text: 'Optimize CSS animations and layout hierarchy', completed: false, priority: 'Low' },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [workspaceNote, setWorkspaceNote] = useState('# Project Workspace Notes\n\nWelcome to your MasterPeace AI workspace. Use this space to draft documents, synthesize notes with AI, and manage daily objectives.');
  const [isAiSynthesizing, setIsAiSynthesizing] = useState(false);

  // Audio / Speech simulation state
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, currentSessionId]);

  // Breathing timer effect
  useEffect(() => {
    let interval: any;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev > 1) return prev - 1;
          // Transition state
          if (breathingState === 'Inhale') { setBreathingState('Hold'); return 4; }
          if (breathingState === 'Hold') { setBreathingState('Exhale'); return 4; }
          if (breathingState === 'Exhale') { setBreathingState('Rest'); return 4; }
          if (breathingState === 'Rest') { setBreathingState('Inhale'); return 4; }
          return 4;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathingState]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isGenerating) return;

    const userMsgText = inputMessage.trim();
    setInputMessage('');

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedSessions = sessions.map(s => {
      if (s.id === currentSessionId) {
        return { ...s, messages: [...s.messages, newUserMessage] };
      }
      return s;
    });
    setSessions(updatedSessions);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsgText,
          model: selectedModel,
          systemInstruction: selectedPersona.instruction,
          temperature: temperature,
        })
      });
      const data = await res.json();
      const assistantText = data.text || "I apologize, I couldn't generate a response at this moment.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, assistantMessage] };
        }
        return s;
      }));
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Error communicating with Gemini server. Please check your connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, errorMsg] };
        }
        return s;
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: `Session ${sessions.length + 1}`,
      persona: selectedPersona.id,
      messages: [
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `New session started with ${selectedPersona.name}. How can we collaborate?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newId);
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) return;
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (currentSessionId === id) {
      setCurrentSessionId(filtered[0].id);
    }
  };

  const handleRunPromptStudio = async () => {
    setIsOptimizing(true);
    let filledPrompt = selectedTemplate.prompt;
    Object.keys(templateVars).forEach(key => {
      filledPrompt = filledPrompt.replace(new RegExp(`{{${key}}}`, 'g'), templateVars[key] || '');
    });

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Enhance and execute this prompt with high precision and professional quality:\n\n${filledPrompt}`,
          model: selectedModel,
          systemInstruction: 'You are an expert prompt engineer and AI optimization specialist.',
          temperature: 0.5
        })
      });
      const data = await res.json();
      setStudioOutput(data.text || filledPrompt);
    } catch (e) {
      setStudioOutput(filledPrompt);
    } finally {
      setIsOptimizing(false);
    }
  };

  const saveToVaultFromStudio = () => {
    if (!studioOutput) return;
    const newItem: VaultItem = {
      id: Date.now().toString(),
      title: selectedTemplate.title,
      content: studioOutput,
      category: 'Prompt',
      tags: [selectedTemplate.category.toLowerCase(), 'prompt-studio'],
      date: new Date().toISOString().split('T')[0]
    };
    setVaultItems([newItem, ...vaultItems]);
    setActiveTab('vault');
  };

  const handleAddVaultItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVaultTitle.trim() || !newVaultContent.trim()) return;
    const newItem: VaultItem = {
      id: Date.now().toString(),
      title: newVaultTitle.trim(),
      content: newVaultContent.trim(),
      category: newVaultCategory,
      tags: ['user-saved'],
      date: new Date().toISOString().split('T')[0]
    };
    setVaultItems([newItem, ...vaultItems]);
    setNewVaultTitle('');
    setNewVaultContent('');
    setShowVaultModal(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: TaskItem = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      priority: newTaskPriority
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAiSynthesizeWorkspace = async () => {
    setIsAiSynthesizing(true);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Review and expand these workspace notes into a polished executive summary with actionable roadmap:\n\n${workspaceNote}`,
          model: selectedModel,
          systemInstruction: 'You are an executive chief of staff and productivity expert.',
        })
      });
      const data = await res.json();
      if (data.text) {
        setWorkspaceNote(prev => prev + '\n\n### AI Synthesis & Roadmap\n' + data.text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiSynthesizing(false);
    }
  };

  const speakText = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* 3-Zone Top Bar Contract */}
      <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            MasterPeace AI
          </span>
        </div>

        {/* Zone 2: 4-6 clean navigation links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${activeTab === 'chat' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${activeTab === 'studio' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            Prompt Studio
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${activeTab === 'vault' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
          >
            <Bookmark className="w-4 h-4 text-violet-600" />
            Memory Vault
          </button>
          <button
            onClick={() => setActiveTab('peace')}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${activeTab === 'peace' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            Peace Mode
          </button>
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${activeTab === 'workspace' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
          >
            <Briefcase className="w-4 h-4 text-emerald-600" />
            Workspace
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${activeTab === 'agents' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
          >
            <Compass className="w-4 h-4 text-indigo-500" />
            AI Agents (5 Free)
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${activeTab === 'mobile' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
          >
            <Terminal className="w-4 h-4 text-violet-600" />
            Android App
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('settings')}
            aria-label="Settings"
            className={`p-2 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
          <button
            onClick={createNewChat}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Session
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-2 shadow-lg z-40 sticky top-16"
          >
            <button
              onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 ${activeTab === 'chat' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'}`}
            >
              <MessageSquare className="w-4 h-4" /> Chat & Companion
            </button>
            <button
              onClick={() => { setActiveTab('studio'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 ${activeTab === 'studio' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'}`}
            >
              <Zap className="w-4 h-4" /> Prompt Studio
            </button>
            <button
              onClick={() => { setActiveTab('vault'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 ${activeTab === 'vault' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'}`}
            >
              <Bookmark className="w-4 h-4" /> Memory Vault
            </button>
            <button
              onClick={() => { setActiveTab('peace'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 ${activeTab === 'peace' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'}`}
            >
              <Heart className="w-4 h-4" /> Peace Mode
            </button>
            <button
              onClick={() => { setActiveTab('workspace'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 ${activeTab === 'workspace' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'}`}
            >
              <Briefcase className="w-4 h-4" /> Workspace
            </button>
            <button
              onClick={() => { setActiveTab('agents'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 ${activeTab === 'agents' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'}`}
            >
              <Compass className="w-4 h-4" /> AI Agents (5 Free)
            </button>
            <button
              onClick={() => { setActiveTab('mobile'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 ${activeTab === 'mobile' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'}`}
            >
              <Terminal className="w-4 h-4" /> Android App
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'}`}
            >
              <SettingsIcon className="w-4 h-4" /> Settings
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'chat' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)]">
            {/* Sidebar Sessions */}
            <div className="hidden lg:flex flex-col bg-white border border-slate-200 rounded-2xl p-4 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Conversations</span>
                <button onClick={createNewChat} className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    onClick={() => setCurrentSessionId(session.id)}
                    className={`group px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all flex items-center justify-between ${currentSessionId === session.id ? 'bg-indigo-50 text-indigo-900 border border-indigo-100 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <MessageSquare className={`w-4 h-4 shrink-0 ${currentSessionId === session.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="truncate">{session.title}</span>
                    </div>
                    {sessions.length > 1 && (
                      <button
                        onClick={(e) => deleteChat(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                        aria-label="Delete chat session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Persona Selector */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">AI Persona</label>
                <select
                  value={selectedPersona.id}
                  onChange={(e) => {
                    const p = PERSONAS.find(item => item.id === e.target.value);
                    if (p) setSelectedPersona(p);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {PERSONAS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-3 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{currentSession.title}</h2>
                  <p className="text-xs text-slate-500">Persona: <span className="font-medium text-indigo-600">{selectedPersona.name}</span> · Model: <span className="font-mono text-slate-600">{selectedModel}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs text-slate-500 font-medium">Gemini Ready</span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                {currentSession.messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                    <div className={`max-w-xl rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-slate-800 border border-slate-200'}`}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div className={`flex items-center justify-between mt-2 pt-2 border-t text-[11px] ${msg.role === 'user' ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-400'}`}>
                        <span>{isMounted ? msg.timestamp : ''}</span>
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => speakText(msg.content, msg.id)}
                              className={`flex items-center gap-1 hover:text-indigo-600 transition-colors ${speakingId === msg.id ? 'text-indigo-600 font-semibold' : ''}`}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              {speakingId === msg.id ? 'Speaking...' : 'Listen'}
                            </button>
                            <span>·</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(msg.content)}
                              className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isGenerating && (
                  <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-500 shadow-sm flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                      MasterPeace AI is synthesizing your response...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Message ${selectedPersona.name}...`}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={isGenerating || !inputMessage.trim()}
                  className="bg-slate-900 text-white px-5 py-3 rounded-xl font-medium text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'studio' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Advanced Prompt Studio</h2>
              <p className="text-sm text-slate-500">Design, optimize, and test structured prompt templates with Gemini.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Template Selectors */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Prompt Templates</h3>
                <div className="space-y-2">
                  {PROMPT_TEMPLATES.map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${selectedTemplate.id === tpl.id ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                    >
                      <div className="text-sm font-semibold">{tpl.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{tpl.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Editor & Variables */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{selectedTemplate.title}</h3>
                  <p className="text-xs text-slate-500 font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">{selectedTemplate.prompt}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Variable Substitution</h4>
                  {selectedTemplate.prompt.includes('{{feature}}') && (
                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">feature</label>
                      <input
                        type="text"
                        value={templateVars.feature || ''}
                        onChange={(e) => setTemplateVars({ ...templateVars, feature: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                  {selectedTemplate.prompt.includes('{{goal}}') && (
                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">goal</label>
                      <input
                        type="text"
                        value={templateVars.goal || ''}
                        onChange={(e) => setTemplateVars({ ...templateVars, goal: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                  {selectedTemplate.prompt.includes('{{text}}') && (
                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">text</label>
                      <textarea
                        rows={3}
                        value={templateVars.text || ''}
                        onChange={(e) => setTemplateVars({ ...templateVars, text: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Paste text to summarize..."
                      />
                    </div>
                  )}
                  {selectedTemplate.prompt.includes('{{error}}') && (
                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">error</label>
                      <textarea
                        rows={3}
                        value={templateVars.error || ''}
                        onChange={(e) => setTemplateVars({ ...templateVars, error: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Paste error stack trace..."
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleRunPromptStudio}
                    disabled={isOptimizing}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {isOptimizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Optimize & Run with Gemini</span>
                  </button>
                  {studioOutput && (
                    <button
                      onClick={saveToVaultFromStudio}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center gap-2 text-sm"
                    >
                      <Bookmark className="w-4 h-4" /> Save to Vault
                    </button>
                  )}
                </div>

                {studioOutput && (
                  <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gemini Studio Output</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(studioOutput)}
                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy Output
                      </button>
                    </div>
                    <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{studioOutput}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Memory Vault</h2>
                <p className="text-sm text-slate-500">Your secure repository of saved prompts, code snippets, and reflections.</p>
              </div>
              <button
                onClick={() => setShowVaultModal(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Add Vault Entry
              </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={vaultSearch}
                  onChange={(e) => setVaultSearch(e.target.value)}
                  placeholder="Search memory vault..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['All', 'Prompt', 'Snippet', 'Note', 'Summary'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setVaultCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${vaultCategoryFilter === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Vault Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vaultItems
                .filter(item => {
                  const matchesSearch = item.title.toLowerCase().includes(vaultSearch.toLowerCase()) || item.content.toLowerCase().includes(vaultSearch.toLowerCase());
                  const matchesCat = vaultCategoryFilter === 'All' || item.category === vaultCategoryFilter;
                  return matchesSearch && matchesCat;
                })
                .map(item => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">{item.category}</span>
                        <span className="text-xs text-slate-400">{item.date}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{item.content}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">#{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(item.content)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                          aria-label="Copy item"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setVaultItems(vaultItems.filter(v => v.id !== item.id))}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          aria-label="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Add Vault Modal */}
            {showVaultModal && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">New Vault Entry</h3>
                    <button onClick={() => setShowVaultModal(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddVaultItem} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Title</label>
                      <input
                        type="text"
                        value={newVaultTitle}
                        onChange={(e) => setNewVaultTitle(e.target.value)}
                        placeholder="Entry title..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                      <select
                        value={newVaultCategory}
                        onChange={(e: any) => setNewVaultCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Note">Note</option>
                        <option value="Prompt">Prompt</option>
                        <option value="Snippet">Snippet</option>
                        <option value="Summary">Summary</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Content</label>
                      <textarea
                        rows={4}
                        value={newVaultContent}
                        onChange={(e) => setNewVaultContent(e.target.value)}
                        placeholder="Write or paste content..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowVaultModal(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
                      >
                        Save Entry
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'peace' && (
          <div className="space-y-8 max-w-4xl mx-auto w-full">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Mindfulness & Peace Sanctuary</h2>
              <p className="text-sm text-slate-500 max-w-lg mx-auto">Center your focus with guided breathing visualization and calming mindfulness tools.</p>
            </div>

            {/* Breathing Circle Widget */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-rose-50 text-rose-600 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" /> Box Breathing
              </div>

              <div className="relative w-64 h-64 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: breathingState === 'Inhale' ? 1.25 : breathingState === 'Exhale' ? 0.85 : 1.05,
                    opacity: breathingState === 'Hold' || breathingState === 'Rest' ? 0.9 : 0.75,
                  }}
                  transition={{ duration: 3.5, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-tr from-rose-400 to-indigo-500 rounded-full blur-xl opacity-40"
                />
                <div className="relative z-10 w-48 h-48 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center shadow-xl">
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">{breathingState}</span>
                  <span className="text-4xl font-extrabold font-mono mt-1">{breathingTimer}s</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setBreathingActive(!breathingActive)}
                  className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center gap-2 ${breathingActive ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                >
                  {breathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{breathingActive ? 'Pause Exercise' : 'Start Breathing'}</span>
                </button>
                <button
                  onClick={() => { setBreathingActive(false); setBreathingState('Inhale'); setBreathingTimer(4); }}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  aria-label="Reset breathing"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Daily Mindful Quote & AI Reflection */}
            <div className="bg-indigo-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50 pointer-events-none" />
              <div className="space-y-3 z-10 max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">Daily Wisdom</span>
                <blockquote className="text-lg font-medium italic text-indigo-50 leading-relaxed">
                  &ldquo;{dailyQuote}&rdquo;
                </blockquote>
              </div>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('/api/gemini/generate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        prompt: 'Provide a short, profound mindfulness quote or reflection about inner peace and focus.',
                        model: selectedModel
                      })
                    });
                    const data = await res.json();
                    if (data.text) setDailyQuote(data.text.replace(/["']/g, ''));
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="z-10 bg-white text-indigo-900 hover:bg-indigo-50 px-5 py-3 rounded-xl font-semibold text-xs shadow-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" /> New Reflection
              </button>
            </div>
          </div>
        )}

        {activeTab === 'workspace' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Productivity Workspace</h2>
                <p className="text-sm text-slate-500">Manage tasks, organize documentation, and synthesize projects with Gemini.</p>
              </div>
              <button
                onClick={handleAiSynthesizeWorkspace}
                disabled={isAiSynthesizing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-md transition-colors disabled:opacity-50"
              >
                {isAiSynthesizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>AI Workspace Synthesis</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Task Manager */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-emerald-600" /> Objectives
                  </h3>
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-600">
                    {tasks.filter(t => t.completed).length}/{tasks.length} Done
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 max-h-72">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className={`text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>{task.text}</span>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-1"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddTask} className="space-y-2 pt-3 border-t border-slate-100">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="New objective..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex items-center justify-between">
                    <select
                      value={newTaskPriority}
                      onChange={(e: any) => setNewTaskPriority(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                      Add Task
                    </button>
                  </div>
                </form>
              </div>

              {/* Workspace Notes Editor */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" /> Document Canvas
                  </h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(workspaceNote)}
                    className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Document
                  </button>
                </div>
                <textarea
                  rows={14}
                  value={workspaceNote}
                  onChange={(e) => setWorkspaceNote(e.target.value)}
                  className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mobile' && (
          <div className="space-y-6 max-w-5xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">MasterPeace AI · Android Companion App</h2>
              <p className="text-sm text-slate-500">Kotlin & Jetpack Compose native mobile architecture with Hilt DI, Room DB, Retrofit, and offline JNI Llama LLM integration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Architecture & DI</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Built using Clean Architecture principles, Jetpack Compose, Hilt Dependency Injection (v2.52), and Kotlin Coroutines (v1.9.0).
                </p>
                <div className="text-[11px] font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div>• Hilt Modules (di/)</div>
                  <div>• Coroutine Dispatchers</div>
                  <div>• SettingsDataStore & Security Crypto</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Room DB & Local Vault</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Local-first offline persistence with Room (v2.6.1) caching chat history, message entities, and memory vault items securely on device.
                </p>
                <div className="text-[11px] font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div>• AppDatabase & Converters</div>
                  <div>• ChatDao & MessageDao</div>
                  <div>• ChatRepository & Sync Worker</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Offline LLM & Speech</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  JNI C++ Llama bridge (`llama_bridge.cpp`) for offline on-device LLM inference alongside Whisper engine and TTS speech synthesis.
                </p>
                <div className="text-[11px] font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div>• LlamaBridge & ModelManager</div>
                  <div>• WhisperEngine & TtsEngine</div>
                  <div>• FloatingButtonService</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">libs.versions.toml (Version Catalog)</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`[versions]
agp = "8.5.2"
kotlin = "2.0.20"
coreKtx = "1.13.1"
hilt = "2.52"
room = "2.6.1"
coroutines = "1.9.0"
retrofit = "2.11.0"

[libraries]
hilt-android = { module = "com.google.dagger:hilt-android", version.ref = "hilt" }
room-runtime = { module = "androidx.room:room-runtime", version.ref = "room" }`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Root build.gradle.kts</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.hilt) apply false
    alias(libs.plugins.ksp) apply false
}`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">settings.gradle.kts</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "MasterPeaceAI"
include(":app")`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">app/build.gradle.kts</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto max-h-96 leading-relaxed">
{`plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.masterpeace.ai"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.masterpeace.ai"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables { useSupportLibrary = true }

        externalNativeBuild {
            cmake { cppFlags += "-std=c++17" }
        }
    }

    externalNativeBuild {
        cmake {
            path = file("src/main/cpp/CMakeLists.txt")
            version = "3.22.1"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug { isMinifyEnabled = false }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    packaging {
        resources.excludes += "/META-INF/{AL2.0,LGPL2.1}"
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(libs.coroutines.android)
    implementation(platform(libs.compose.bom))
    implementation(libs.compose.ui)
    implementation(libs.compose.ui.graphics)
    implementation(libs.compose.ui.tooling.preview)
    implementation(libs.compose.material3)
    implementation(libs.compose.material.icons)
    implementation(libs.navigation.compose)
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.hilt.navigation.compose)
    implementation(libs.room.runtime)
    implementation(libs.room.ktx)
    ksp(libs.room.compiler)
    implementation(libs.datastore.preferences)
    implementation(libs.retrofit)
    implementation(libs.retrofit.gson)
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)
    implementation(libs.coil.compose)
    implementation(libs.work.runtime)
    implementation(libs.security.crypto)
}`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">MasterPeaceApp.kt (Application Entry Point)</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`package com.masterpeace.ai

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class MasterPeaceApp : Application()`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">MainActivity.kt (Host Activity & Hilt Entry)</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`package com.masterpeace.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import com.masterpeace.ai.presentation.navigation.MasterPeaceNavHost
import com.masterpeace.ai.presentation.settings.MainViewModel
import com.masterpeace.ai.presentation.theme.AppMode
import com.masterpeace.ai.presentation.theme.MasterPeaceTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val vm: MainViewModel = hiltViewModel()
            val state by vm.uiState.collectAsState()
            MasterPeaceTheme(
                mode = AppMode.valueOf(state.themeMode),
                accent = state.accentColor
            ) {
                MasterPeaceNavHost(startDestination = state.startDestination)
            }
        }
    }
}`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">ChatEntity.kt (Room Local Database Entity)</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`package com.masterpeace.ai.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "chats")
data class ChatEntity(
    @PrimaryKey val id: String,
    val title: String,
    val workspace: String = "personal", // study/business/coding/personal/content
    val folder: String? = null,
    val isFavorite: Boolean = false,
    val tags: String = "",              // comma separated
    val createdAt: Long,
    val updatedAt: Long
)`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">MessageEntity.kt (Room Local Database Entity with Foreign Key)</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`package com.masterpeace.ai.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "messages",
    foreignKeys = [ForeignKey(
        entity = ChatEntity::class,
        parentColumns = ["id"],
        childColumns = ["chatId"],
        onDelete = ForeignKey.CASCADE
    )],
    indices = [Index("chatId")]
)
data class MessageEntity(
    @PrimaryKey val id: String,
    val chatId: String,
    val role: String,          // user / assistant / system
    val content: String,
    val language: String,      // ur / en / roman
    val imageUri: String? = null,
    val isStreaming: Boolean = false,
    val timestamp: Long
)`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">PromptEntity.kt & MemoryEntity.kt (Room Entities)</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`package com.masterpeace.ai.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "prompts")
data class PromptEntity(
    @PrimaryKey val id: String,
    val title: String,
    val content: String,
    val category: String,
    val isCustom: Boolean = true,
    val createdAt: Long
)

@Entity(tableName = "memory_vault")
data class MemoryEntity(
    @PrimaryKey val id: String,
    val key: String,
    val value: String,
    val userApproved: Boolean = false,
    val updatedAt: Long
)`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">ChatDao.kt (Room Data Access Object)</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`package com.masterpeace.ai.data.local.dao

import androidx.room.*
import com.masterpeace.ai.data.local.entity.ChatEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ChatDao {
    @Query("SELECT * FROM chats ORDER BY updatedAt DESC")
    fun observeAll(): Flow<List<ChatEntity>>

    @Query("SELECT * FROM chats WHERE title LIKE '%' || :q || '%' ORDER BY updatedAt DESC")
    fun search(q: String): Flow<List<ChatEntity>>

    @Query("SELECT * FROM chats WHERE isFavorite = 1 ORDER BY updatedAt DESC")
    fun favorites(): Flow<List<ChatEntity>>

    @Query("SELECT * FROM chats WHERE id = :id LIMIT 1")
    suspend fun getById(id: String): ChatEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(chat: ChatEntity)

    @Delete
    suspend fun delete(chat: ChatEntity)

    @Query("DELETE FROM chats WHERE workspace = :workspace")
    suspend fun clearWorkspace(workspace: String)
}`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">MessageDao.kt (Room Data Access Object)</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`package com.masterpeace.ai.data.local.dao

import androidx.room.*
import com.masterpeace.ai.data.local.entity.MessageEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface MessageDao {
    @Query("SELECT * FROM messages WHERE chatId = :chatId ORDER BY timestamp ASC")
    fun observeByChat(chatId: String): Flow<List<MessageEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(message: MessageEntity)

    @Update
    suspend fun update(message: MessageEntity)

    @Delete
    suspend fun delete(message: MessageEntity)

    @Query("SELECT * FROM messages WHERE chatId = :chatId ORDER BY timestamp DESC LIMIT :limit")
    suspend fun lastMessages(chatId: String, limit: Int): List<MessageEntity>
}`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">AppDatabase.kt (Room Database Definition)</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`package com.masterpeace.ai.data.local.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.masterpeace.ai.data.local.dao.ChatDao
import com.masterpeace.ai.data.local.dao.MessageDao
import com.masterpeace.ai.data.local.dao.PromptDao
import com.masterpeace.ai.data.local.dao.MemoryDao
import com.masterpeace.ai.data.local.entity.*

@Database(
    entities = [
        ChatEntity::class,
        MessageEntity::class,
        PromptEntity::class,
        MemoryEntity::class
    ],
    version = 1,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun chatDao(): ChatDao
    abstract fun messageDao(): MessageDao
    abstract fun promptDao(): PromptDao
    abstract fun memoryDao(): MemoryDao

    companion object { const val NAME = "master_peace.db" }
}`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Security.kt (EncryptedSharedPreferences & MasterKey)</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

EncryptedSharedPreferences.create(
    context,
    "secure_keys",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">LlamaBridge.kt (JNI Native LLM Bridge)</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`package com.masterpeace.ai.data.llm

/**
 * C++ side is in app/src/main/cpp/llama_bridge.cpp
 * Loads a GGUF file and streams tokens.
 */
class LlamaBridge private constructor() {

    external fun nativeInit(modelPath: String, threads: Int, contextSize: Int): Long
    external fun nativeGenerate(handle: Long, prompt: String, maxTokens: Int): String
    external fun nativeStream(handle: Long, prompt: String, maxTokens: Int, cb: StreamCallback)
    external fun nativeRelease(handle: Long)
    external fun nativeFree()

    interface StreamCallback { fun onToken(token: String); fun onDone() }

    fun load(modelPath: String, threads: Int = 4, ctx: Int = 2048): Long =
        nativeInit(modelPath, threads, ctx)

    fun unload(handle: Long) = nativeRelease(handle)

    companion object {
        init { System.loadLibrary("masterpeace_llm") }
        fun create(): LlamaBridge = LlamaBridge()
    }
}`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">ModelManager.kt (Local GGUF Model Downloader & Catalog)</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`package com.masterpeace.ai.data.llm

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL

class ModelManager(private val context: Context) {

    val modelsDir: File = File(context.filesDir, "models").apply { mkdirs() }

    data class ModelInfo(val name: String, val url: String, val sizeMb: Int)

    val catalog = listOf(
        ModelInfo("Qwen2.5-1.5B-Instruct-Q4", "https://huggingface.co/.../qwen2.5-1.5b-q4.gguf", 1100),
        ModelInfo("Llama-3.2-1B-Instruct-Q4",  "https://huggingface.co/.../llama3.2-1b-q4.gguf", 700)
    )

    suspend fun download(
        info: ModelInfo,
        onProgress: (Int) -> Unit
    ): File = withContext(Dispatchers.IO) {
        val target = File(modelsDir, "\${info.name}.gguf")
        if (target.exists()) return@withContext target

        val tmp = File(modelsDir, "\${info.name}.part")
        val conn = (URL(info.url).openConnection() as HttpURLConnection).apply {
            connectTimeout = 15_000; readTimeout = 30_000; connect()
        }
        val total = conn.contentLength
        conn.inputStream.use { input ->
            FileOutputStream(tmp).use { out ->
                val buf = ByteArray(1 shl 16)
                var read: Int; var done = 0
                while (input.read(buf).also { read = it } != -1) {
                    out.write(buf, 0, read); done += read
                    if (total > 0) onProgress((done * 100 / total))
                }
            }
        }
        tmp.renameTo(target); target
    }

    fun isDownloaded(info: ModelInfo): Boolean = File(modelsDir, "\${info.name}.gguf").exists()
}`}
                </pre>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">WhisperEngine.kt (Offline STT JNI Bridge)</h3>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`package com.masterpeace.ai.data.speech

/**
 * Whisper.cpp JNI bridge for offline speech-to-text.
 * Feed 16kHz mono PCM float samples.
 */
class WhisperEngine {
    external fun init(modelPath: String): Long
    external fun transcribe(handle: Long, pcm: FloatArray, lang: String): String
    external fun release(handle: Long)

    companion object {
        init { System.loadLibrary("whisper") }
    }
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-6 max-w-5xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">5 Free AI Agents (Online & Offline)</h2>
              <p className="text-sm text-slate-500">Autonomous and specialized AI agents ready for your workflows — working seamlessly across cloud APIs and offline local runtimes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">1</div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">Alpha Research Agent</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">Online Cloud</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">Performs deep web synthesis, multi-source fact finding, and generates executive structured reports using Gemini & Cloud AI.</p>
                </div>
                <button
                  onClick={() => { setActiveTab('chat'); setSelectedPersona(PERSONAS[3]); }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Deploy Research Agent
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">2</div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">CodeCraft Expert Agent</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">Online & Offline</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">Architects production-grade full-stack React/Next.js components, fixes bugs, and optimizes C++/JNI bridges.</p>
                </div>
                <button
                  onClick={() => { setActiveTab('chat'); setSelectedPersona(PERSONAS[1]); }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Deploy Coder Agent
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">3</div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">ZenLife Wellness Agent</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">Online Cloud</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">Guides mindful meditation, emotional balance, breathing exercises, and personalized tranquility coaching.</p>
                </div>
                <button
                  onClick={() => { setActiveTab('peace'); }}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Open Zen Garden
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">4</div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">LlamaEdge Local Agent</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">100% Offline GGUF</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">Runs Qwen & Llama models locally on mobile hardware via C++ JNI and LlamaBridge without internet connection.</p>
                </div>
                <button
                  onClick={() => { setActiveTab('mobile'); }}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  View Local GGUF Bridge
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between md:col-span-2 lg:col-span-1">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">5</div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">WhisperVoice STT Agent</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">100% Offline Audio</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">Processes 16kHz mono PCM float audio samples using Whisper.cpp for high-accuracy offline speech-to-text.</p>
                </div>
                <button
                  onClick={() => { setActiveTab('mobile'); }}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  View Whisper Bridge
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Application Settings</h2>
              <p className="text-sm text-slate-500">Configure AI model parameters, system preferences, and secure environment credentials.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Default AI Model (Gemini, DeepSeek, ChatGPT & Cloud AI)</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Latest Versatile Model)</option>
                  <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended, Fast & Capable)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Advanced Reasoning & Coding)</option>
                  <option value="gemini-3.8-flash-lite">gemini-3.8-flash-lite (Ultra Low Latency)</option>
                  <option value="deepseek-chat">deepseek-chat (DeepSeek-V3 General & Coding)</option>
                  <option value="deepseek-reasoner">deepseek-reasoner (DeepSeek-R1 Advanced Chain-of-Thought)</option>
                  <option value="gpt-4o">gpt-4o (OpenAI ChatGPT 4o Flagship)</option>
                  <option value="o3-mini">o3-mini (OpenAI Advanced Reasoning)</option>
                  <option value="claude-3-5-sonnet">claude-3-5-sonnet (Anthropic Claude Cloud AI)</option>
                  <option value="claude-3-opus">claude-3-opus (Anthropic Deep Research & Writing)</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Model Temperature ({temperature})</label>
                  <span className="text-xs font-mono text-slate-600">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">Lower values are more deterministic and precise; higher values are more creative.</p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">System Environment & Security</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">GEMINI_API_KEY Status</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Configured via Server Secrets
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Architecture Runtime</span>
                    <span className="text-slate-900 font-mono">Next.js App Router (Server-Side SDK)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 text-center text-xs text-slate-500">
        <p>© 2026 MasterPeace AI. All rights reserved. Powered by Google Gemini AI SDK.</p>
      </footer>
    </div>
  );
}
