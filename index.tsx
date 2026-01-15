import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

/**
 * PANKBASE DESIGN SYSTEM - Compact High-Fidelity Restoration
 */

// --- Types ---

interface TurnData {
  id: string;
  query: string;
  aiOverview: {
    gene: string;
    qtl: string;
    relation: string;
  };
  citations: Array<{
    id: number;
    title: string;
    authors: string;
    journal: string;
    pmid: string;
  }>;
  followUpQuestions: string[];
}

// --- Mock Data ---

const INITIAL_TURN: TurnData = {
  id: 'turn-1',
  query: 'How does the SNP rs2402203 influence the expression of CFTR in Pancreas tissue, as reported by GTEx?',
  aiOverview: {
    gene: "The gene CFTR (ENSG0000001626) encodes the cystic fibrosis transmembrane conductance regulator protein, which plays a crucial role in ion transport and is implicated in immune regulation. It is associated with type 1 diabetes (MONDO_0005147), indicating its potential role in autoimmune processes. CFTR is involved in regulatory pathways, interacting with other proteins such as CSK (ENSG00000103653) and ITGB7 (ENSG00000139626), which are also linked to immune functions. Notably, the SNP rs2402203 is related to CFTR and shows significant association with gene expression regulation in pancreatic tissues, highlighting its relevance in diabetes",
    qtl: "The SNP rs2402203 is associated with the gene CFTR (ENSG0000001626) in the pancreas. The effect allele is C, with a slope of -2.36, indicating a negative association with gene expression. The posterior inclusion probability (PIP) is 0.70, suggesting a strong likelihood that this SNP is a causal variant. The nominal p-value is extremely low (4.84 x 10^-17), indicating high statistical significance for its association with CFTR expression in this tissue. There is no mention of a lead SNP different from rs2402203 in the provided data. This relationship is relevant to type 1 diabetes (MONDO_0005147)",
    relation: "The gene CFTR (ENSG0000001626) is associated with Type 1 diabetes (MONDO_0005147) as an effector gene, indicating its potential role in the disease's pathogenesis. Evidence includes the identification of genetic variants, such as the SNP rs2402203, which is linked to CFTR and shows significant association with Type 1 diabetes (nominal p-value of 4.84e-17). Additionally, CFTR's expression is influenced by colocalized eQTLs, suggesting that variations in this gene may affect its expression and contribute to the disease"
  },
  citations: [
    { id: 1, title: "Fine-mapping, trans-ancestral and genomic analyses identify causal variants...", authors: "Robertson CC, ..., Rich SS", journal: "NATURE GENETICS. 2021;53(7):962-971.", pmid: "34127860" },
    { id: 2, title: "Interpreting type 1 diabetes risk with genetics and single-cell epigenomics.", authors: "Chiou J, ..., Gaulton KJ", journal: "NATURE. 2021;538(7838):252-257.", pmid: "34012112" }
  ],
  followUpQuestions: [
    "What are the target cells for CFTR in the pancreas?",
    "Are there other SNPs in the same locus linked to T1D?",
    "How does CFTR interact with CSK in autoimmune processes?"
  ]
};

// --- Standardized Shared Components ---

const TabButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}> = ({ isActive, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 transition-all duration-200 h-8 px-3 rounded-full font-bold text-[13px] border whitespace-nowrap ${
      isActive
        ? 'text-[#008c8c] bg-white border-[#008c8c]/20 shadow-sm'
        : 'text-slate-500 hover:text-slate-700 border-transparent'
    }`}
  >
    <span className="w-3.5 h-3.5 flex items-center justify-center">
      {icon}
    </span>
    <span>{label}</span>
  </button>
);

const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-3 mb-1.5">
    <span className="text-slate-400 text-[9px] font-bold tracking-[0.15em] uppercase whitespace-nowrap">
      {label}
    </span>
    <div className="h-px w-full bg-slate-100"></div>
  </div>
);

// --- Layout Components ---

/**
 * Header（贴近你截图的结构）：
 * - 顶部一行：左品牌 + 右侧工具区 + 右侧主导航
 * - 下方：青绿色分隔线
 * - 左下：beta 小标签
 */
const Header: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 bg-white z-50">
    <div className="max-w-[1600px] mx-auto px-6 h-[72px] flex items-center justify-between">
      {/* Left: Branding */}
      {/* Left: Branding (logo image) */}
    <a href="#" className="flex items-center">
      <img
        src="img/PanKbase_logo-black-tagline.svg"
        alt="PanKbase"
        className="h-10 w-auto"
      />
    </a>


      {/* Right: TWO ROWS (utilities on top, nav on bottom) */}
      {/* Right: two-row layout with logo spanning 2 rows */}
      <div className="grid grid-rows-2 grid-cols-[1fr_auto] items-center gap-x-4">
        {/* Row 1, Col 1: utilities (right aligned) */}
        <div className="row-start-1 col-start-1 flex items-center justify-end gap-5 text-[11px] font-semibold text-slate-700">
          <a href="#" className="hover:text-[#008c8c]">Funding Opportunities</a>

          <button className="flex items-center gap-1.5 hover:text-[#008c8c]">
            <span>Search</span>
            <span aria-hidden>🔍</span>
          </button>

          <a href="#" className="hover:text-[#008c8c]">Analysis</a>

          {/* ✅ Login 会跟下面 Help 对齐到同一条竖线（logo 左边界） */}
          <a href="#" className="flex items-center gap-1.5 hover:text-[#008c8c]">
            <span>Login</span>
            <span aria-hidden>👤</span>
          </a>
        </div>

        {/* Row 2, Col 1: nav (right aligned) */}
        <div className="row-start-2 col-start-1 flex items-center justify-end gap-4">
          <a
            href="#"
            className="h-8 px-4 bg-[#008c8c] text-white flex items-center justify-center rounded-[8px] shadow-sm font-bold text-[13px]"
          >
            PanKgraph
          </a>

          <a href="#" className="text-[#008c8c] font-bold text-[13px] hover:underline">
            Integrated Cell Browser
          </a>

          <span className="h-4 w-px bg-slate-200 mx-1" />

          <a href="#" className="font-bold text-[13px] text-slate-800 hover:text-[#008c8c]">Data</a>
          <a href="#" className="font-bold text-[13px] text-slate-800 hover:text-[#008c8c]">Resources</a>
          <a href="#" className="font-bold text-[13px] text-slate-800 hover:text-[#008c8c]">About</a>

          {/* ✅ Help 的右边界也会跟 Login 对齐 */}
          <a href="#" className="font-bold text-[13px] text-slate-800 hover:text-[#008c8c]">Help</a>
        </div>

        {/* Col 2: HiRN logo spans two rows */}
        <div className="col-start-2 row-span-2 flex items-center justify-end pl-3">
          <img
            src="img/logo-hirn.svg"
            alt="HiRN"
            className="h-12 w-auto"   // ✅ logo 变大，并且视觉上跨两行
          />
        </div>
      </div>

    </div>

    {/* teal divider line */}
    <div className="h-[3px] bg-[#008c8c]" />

    {/* beta tag */}
    <div className="max-w-[1600px] mx-auto px-6">
      <span className="inline-flex -mt-3 translate-y-3 text-[11px] px-2 py-0.5 rounded bg-[#008c8c] text-white font-bold">
        beta
      </span>
    </div>
  </header>
);

const Sidebar: React.FC<{
  turns: TurnData[];
  activeTurnId: string;
  activeSectionType: string;
  onNavClick: (tid: string, st?: string) => void;
}> = ({ turns, activeTurnId, activeSectionType, onNavClick }) => {
  const sections = [
    { id: 'ai-overview', label: 'AI OVERVIEW' },
    { id: 'visualizations', label: 'VISUALIZATIONS' },
    { id: 'evidence', label: 'EVIDENCE' },
    { id: 'follow-up', label: 'FOLLOW UP' },
  ];

  return (
    <div className="flex flex-col gap-4 max-h-[85vh] overflow-y-auto pr-4 scrollbar-hide py-1">
      {turns.map((turn, idx) => (
        <div key={turn.id} className="flex flex-col gap-1">
          {turns.length > 1 && (
            <button
              onClick={() => onNavClick(turn.id)}
              className={`text-left transition-all mb-1 ${
                activeTurnId === turn.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-[8px] ${
                    activeTurnId === turn.id ? 'bg-[#008c8c] text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  Q{idx + 1}
                </span>
              </div>
              <p
                className={`text-[13px] font-bold leading-tight line-clamp-2 px-0.5 ${
                  activeTurnId === turn.id ? 'text-[#1e293b]' : 'text-[#64748b]'
                }`}
              >
                {turn.query}
              </p>
            </button>
          )}

          {(turns.length === 1 || activeTurnId === turn.id) && (
            <div
              className={`relative ${
                turns.length > 1 ? 'ml-2 mt-0.5' : 'ml-0 mt-0'
              } flex flex-col gap-0 animate-in fade-in duration-300`}
            >
              <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-slate-100"></div>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onNavClick(turn.id, s.id)}
                  className={`relative text-left h-8 flex items-center gap-4 transition-all group ${
                    activeSectionType === s.id ? 'text-[#008c8c]' : 'text-[#94a3b8] hover:text-[#64748b]'
                  }`}
                >
                  <div className="flex items-center justify-center w-[7px] shrink-0 z-10">
                    <div
                      className={`rounded-full transition-all duration-200 ${
                        activeSectionType === s.id ? 'w-2 h-2 bg-[#008c8c]' : 'w-1 h-1 bg-slate-200'
                      }`}
                    ></div>
                  </div>
                  <span className="text-[10px] font-extrabold tracking-[0.08em] uppercase whitespace-nowrap">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// --- Sub-Section Contents ---

const CitationMarker: React.FC<{ num: number }> = ({ num }) => (
  <span className="inline-flex items-center justify-center w-[16px] h-[16px] bg-[#008c8c] text-white text-[8px] font-black rounded-full align-middle ml-1 mb-0.5 cursor-default">
    {num}
  </span>
);

const AIOverviewContent: React.FC<{ data: TurnData['aiOverview'] }> = ({ data }) => (
  <div className="flex flex-col gap-6">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-[#008c8c] text-[10px] font-extrabold tracking-[0.05em] uppercase">
          GENE OVERVIEW:
        </h4>
      </div>
      <p className="text-[#475569] leading-relaxed text-[14px] font-normal text-justify">
        {data.gene} <CitationMarker num={1} />
      </p>
    </div>

    <div>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-[#008c8c] text-[10px] font-extrabold tracking-[0.05em] uppercase">
          QTL OVERVIEW:
        </h4>
      </div>
      <p className="text-[#475569] leading-relaxed text-[14px] font-normal text-justify">
        {data.qtl} <CitationMarker num={1} />
      </p>
    </div>

    <div>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-[#008c8c] text-[10px] font-extrabold tracking-[0.05em] uppercase">
          SPECIFIC RELATION TO TYPE 1 DIABETES:
        </h4>
      </div>
      <p className="text-[#475569] leading-relaxed text-[14px] font-normal text-justify">
        {data.relation} <CitationMarker num={2} />
      </p>
    </div>
  </div>
);

const VisualContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'empirical'>('knowledge');

  return (
    <div className="flex flex-col gap-1.5">
      <SectionHeader label="Visualizations" />
      <div className="flex items-center gap-2 mb-1.5 overflow-x-auto scrollbar-hide">
        <TabButton
          isActive={activeTab === 'knowledge'}
          onClick={() => setActiveTab('knowledge')}
          label="Knowledge Graph"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <circle cx="5" cy="5" r="3" />
              <circle cx="19" cy="19" r="3" />
              <path d="M7.5 7.5l9 9" />
            </svg>
          }
        />
        <TabButton
          isActive={activeTab === 'empirical'}
          onClick={() => setActiveTab('empirical')}
          label="Empirical Evidence"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          }
        />
      </div>

      <div className="relative w-full aspect-[21/7] bg-white rounded-[20px] border border-slate-100 overflow-hidden">
        <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-10">
          <button className="flex items-center gap-2 px-2.5 py-1 hover:bg-slate-50 rounded-md transition-colors">
            <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 3h6v6M9 21H3v-6" />
            </svg>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">FULLSCREEN</span>
          </button>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-60">
          <svg className="w-3/4 h-3/4" viewBox="0 0 800 300">
            <line x1="330" y1="100" x2="390" y2="150" stroke="#e2e8f0" strokeWidth="2" />
            <line x1="330" y1="200" x2="390" y2="160" stroke="#e2e8f0" strokeWidth="2" />
            <g transform="translate(320, 100)">
              <circle r="8" fill="white" stroke="#3b82f6" strokeWidth="2" />
              <text x="15" y="4" className="text-[12px] font-bold fill-slate-400">Pancreas</text>
            </g>
            <g transform="translate(290, 210)">
              <circle r="8" fill="white" stroke="#f97316" strokeWidth="2" />
              <text x="15" y="4" className="text-[12px] font-bold fill-slate-400">rs2402203</text>
            </g>
            <g transform="translate(410, 150)">
              <circle r="10" fill="white" stroke="#008c8c" strokeWidth="2" />
              <text x="20" y="5" className="text-[14px] font-black fill-slate-600">CFTR</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

const EvidenceContent: React.FC<{ citations: TurnData['citations'] }> = ({ citations }) => {
  const [activeTab, setActiveTab] = useState<'reference' | 'provenance' | 'pankbase-links' | 'external-links'>('reference');

  return (
    <div className="flex flex-col gap-1.5">
      <SectionHeader label="Evidence" />
      <div className="flex items-center gap-3 mb-1.5 flex-wrap">
        <TabButton
          isActive={activeTab === 'reference'}
          onClick={() => setActiveTab('reference')}
          label="Reference"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          }
        />
        <TabButton
          isActive={activeTab === 'provenance'}
          onClick={() => setActiveTab('provenance')}
          label="Provenance"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          }
        />
        <TabButton
          isActive={activeTab === 'pankbase-links'}
          onClick={() => setActiveTab('pankbase-links')}
          label="PanKbase Links"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          }
        />
        <TabButton
          isActive={activeTab === 'external-links'}
          onClick={() => setActiveTab('external-links')}
          label="External Links"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          }
        />
      </div>

      <div className="grid gap-2">
        {activeTab === 'reference' && citations.map(c => (
          <div key={c.id} className="flex gap-4 p-4 rounded-[16px] border border-slate-100 bg-white transition-all items-start group hover:border-[#008c8c]/30">
            <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 font-black text-[13px] flex items-center justify-center shrink-0 group-hover:bg-[#008c8c] group-hover:text-white transition-all duration-200">
              {c.id}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4 mb-0.5">
                <h5 className="text-[#0f172a] font-bold text-[15px] leading-snug group-hover:text-[#008c8c] transition-colors line-clamp-2">
                  {c.title}
                </h5>
                <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 text-slate-500 hover:text-[#008c8c] hover:bg-teal-50 text-[10px] font-bold shrink-0">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  Cite
                </button>
              </div>
              <p className="text-slate-500 text-[13px] mb-2 font-medium">{c.authors}</p>
              <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                <span className="uppercase tracking-tight">{c.journal}</span>
                <span className="px-2 py-0.5 bg-teal-50/50 text-[#008c8c] rounded-md border border-[#008c8c]/10">
                  PMID: {c.pmid}
                </span>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'provenance' && (
          <div className="p-4 bg-white border border-slate-100 rounded-[16px] text-slate-600 text-[13px] leading-relaxed">
            Data synthesized from high-quality sources including GTEx Project V8 (expression and QTL data), NCBI RefSeq, and peer-reviewed literature indexed in PubMed. Statistical thresholds and causal variants were validated using fine-mapping pipelines.
          </div>
        )}

        {activeTab === 'pankbase-links' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <a href="#" className="p-3 bg-white border border-slate-100 rounded-xl hover:border-teal-200 transition-colors flex items-center justify-between group shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#008c8c]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M7 21h10M12 3v18M3 12h18" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-700">Gene Detail: CFTR</span>
                  <span className="text-[10px] text-slate-400 font-medium">Internal Genomics Data</span>
                </div>
              </div>
              <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#008c8c]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#" className="p-3 bg-white border border-slate-100 rounded-xl hover:border-teal-200 transition-colors flex items-center justify-between group shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#008c8c]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M2.45 14.97c.56 1.7 1.5 3.2 2.7 4.5l1.4-1.4m11.1-12.2l1.4-1.4c1.2 1.3 2.1 2.8 2.7 4.5m-15.4 0c-.6 1.7-.9 3.5-.9 5.4 0 1.9.3 3.7.9 5.4m15.4 0c.6-1.7.9-3.5.9-5.4 0-1.9-.3-3.7-.9-5.4" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-700">Locus: rs2402203</span>
                  <span className="text-[10px] text-slate-400 font-medium">PanKbase Variant Info</span>
                </div>
              </div>
              <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#008c8c]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}

        {activeTab === 'external-links' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <a href="https://gtexportal.org" target="_blank" className="p-3 bg-white border border-slate-100 rounded-xl hover:border-orange-100 transition-colors flex items-center justify-between group shadow-sm" rel="noreferrer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-700">GTEx Portal (CFTR)</span>
                  <span className="text-[10px] text-slate-400 font-medium">External Reference</span>
                </div>
              </div>
            </a>
            <a href="https://pubmed.ncbi.nlm.nih.gov" target="_blank" className="p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-100 transition-colors flex items-center justify-between group shadow-sm" rel="noreferrer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-700">PubMed Central</span>
                  <span className="text-[10px] text-slate-400 font-medium">Scientific Articles</span>
                </div>
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const FollowUpContent: React.FC<{ questions: string[]; onAsk: (q: string) => void }> = ({ questions, onAsk }) => (
  <div className="flex flex-col gap-1.5">
    <SectionHeader label="Follow up" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {questions.map((q, idx) => (
        <button
          key={idx}
          onClick={() => onAsk(q)}
          className="text-left p-3 rounded-[12px] border border-slate-100 bg-white hover:border-teal-200 hover:bg-teal-50/10 transition-all group flex justify-between items-center"
        >
          <span className="text-slate-800 text-[12px] font-bold group-hover:text-[#008c8c]">{q}</span>
          <svg className="w-3 h-3 text-[#008c8c] opacity-0 group-hover:opacity-100 transition-all shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      ))}
    </div>
  </div>
);

// --- Main App ---

const App: React.FC = () => {
  const [turns, setTurns] = useState<TurnData[]>([INITIAL_TURN]);
  const [activeTurnId, setActiveTurnId] = useState('turn-1');
  const [activeSectionType, setActiveSectionType] = useState('ai-overview');
  const [isLoading, setIsLoading] = useState(false);
  const sectionsRefs = useRef<{ [turnId: string]: { [type: string]: HTMLElement | null } }>({});

  const handleFollowUp = (query: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const turnId = `turn-${Date.now()}`;
      setTurns((prev) => [...prev, { ...INITIAL_TURN, id: turnId, query }]);
      setIsLoading(false);
      setTimeout(() => scrollTo(turnId), 100);
    }, 600);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (const turn of turns) {
        for (const type of ['ai-overview', 'visualizations', 'evidence', 'follow-up']) {
          const el = sectionsRefs.current[turn.id]?.[type];
          if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
            setActiveTurnId(turn.id);
            setActiveSectionType(type);
            return;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [turns]);

  const scrollTo = (tid: string, st?: string) => {
    setActiveTurnId(tid);
    if (st) setActiveSectionType(st);

    const el = sectionsRefs.current[tid]?.[st || 'ai-overview'];
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900 selection:bg-teal-50 selection:text-teal-900">
      <Header />

      {/* 这里保持 92px，确保 header + divider + beta 不会挡内容 */}
      <div className="flex justify-center pt-[92px]">
        <div className="flex gap-6 max-w-[1600px] w-full px-6">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-[92px]">
              <Sidebar
                turns={turns}
                activeTurnId={activeTurnId}
                activeSectionType={activeSectionType}
                onNavClick={scrollTo}
              />
            </div>
          </aside>

          <main className="flex-1 min-w-0 flex flex-col gap-4">
            {turns.map((turn, idx) => (
              <div key={turn.id} className="bg-white rounded-[20px] border border-slate-200/60 overflow-hidden flex flex-col shadow-sm">
                <div className="bg-slate-50/30 px-6 py-4 border-b border-slate-100">
                  <span className="text-slate-400 text-[8px] font-black uppercase tracking-widest block mb-1">
                    Question {idx + 1}
                  </span>
                  <h2 className="text-[18px] font-extrabold text-slate-900 leading-tight tracking-tight">
                    {turn.query}
                  </h2>
                </div>

                <div className="px-6 py-6 flex flex-col gap-6">
                  <section
                    ref={(el) => {
                      if (!sectionsRefs.current[turn.id]) sectionsRefs.current[turn.id] = {};
                      sectionsRefs.current[turn.id]['ai-overview'] = el;
                    }}
                  >
                    <AIOverviewContent data={turn.aiOverview} />
                  </section>

                  <section
                    ref={(el) => {
                      if (sectionsRefs.current[turn.id]) sectionsRefs.current[turn.id]['visualizations'] = el;
                    }}
                  >
                    <VisualContent />
                  </section>

                  <section
                    ref={(el) => {
                      if (sectionsRefs.current[turn.id]) sectionsRefs.current[turn.id]['evidence'] = el;
                    }}
                  >
                    <EvidenceContent citations={turn.citations} />
                  </section>

                  <section
                    ref={(el) => {
                      if (sectionsRefs.current[turn.id]) sectionsRefs.current[turn.id]['follow-up'] = el;
                    }}
                  >
                    <FollowUpContent questions={turn.followUpQuestions} onAsk={handleFollowUp} />
                  </section>
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none flex justify-center px-6">
        <div className="flex gap-6 max-w-[1600px] w-full">
          <div className="hidden lg:block w-56 flex-shrink-0"></div>
          <div className="flex-1 flex justify-center pointer-events-auto">
            <div className="bg-white/95 backdrop-blur rounded-[16px] p-1 border border-slate-200 flex items-center gap-3 h-12 w-full max-w-[600px] pl-4 pr-1 shadow-lg shadow-slate-200/50">
              <svg className="w-3.5 h-3.5 text-slate-300 ml-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Ask a follow-up..."
                className="flex-1 bg-transparent border-none outline-none text-slate-800 text-[13px] font-semibold placeholder-slate-400"
              />
              <button className="h-9 px-4 bg-[#008c8c] text-white rounded-[12px] flex items-center gap-1.5 hover:bg-teal-700 transition-all font-bold text-[11px] shadow-sm">
                Ask AI{' '}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) ReactDOM.createRoot(rootElement).render(<App />);
