import { type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getRunModelQueryQueryKey, useRunModelQuery } from '@workspace/api-client-react';
import type { ModelCandidate, RunModelQueryParams } from '@workspace/api-client-react';
import {
  AlertTriangle,
  BookOpen,
  Check,
  CircleHelp,
  Database,
  Dna,
  ExternalLink,
  FlaskConical,
  GitBranch,
  Info,
  LoaderCircle,
  Network,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Terminal,
  X,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const defaults: Required<RunModelQueryParams> = {
  hop: 3,
  split: 'test',
  seed: 101,
  queryIndex: 0,
  method: 'poincare',
  topK: 5,
};

const methodLabels: Record<string, string> = {
  lexical: 'Lexical baseline',
  euclidean: 'Euclidean',
  poincare: 'Poincaré',
  poincare_with_path_verification: 'Poincaré + path verification',
};

function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <label className="hairline-label text-[hsl(var(--muted-foreground))]">{children}</label>
      {hint && <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{hint}</span>}
    </div>
  );
}

function SelectField({ id, value, onChange, children }: { id: string; value: string | number; onChange: (value: string) => void; children: ReactNode }) {
  return (
    <select
      id={id}
      data-testid={`select-${id}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="focus-ring h-10 w-full appearance-none rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 text-sm text-[hsl(var(--foreground))] shadow-[var(--shadow-sm)] transition-colors hover:border-[hsl(var(--primary)/.45)]"
    >
      {children}
    </select>
  );
}

function QueryForm({ value, onChange, onRun, isFetching }: { value: Required<RunModelQueryParams>; onChange: (value: Required<RunModelQueryParams>) => void; onRun: () => void; isFetching: boolean }) {
  const set = <K extends keyof Required<RunModelQueryParams>>(key: K, next: Required<RunModelQueryParams>[K]) => onChange({ ...value, [key]: next });
  return (
    <section className="relative overflow-hidden border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/.78)] px-5 py-5 backdrop-blur-sm md:px-8">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/.12),transparent_68%)]" />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[hsl(var(--primary))]">
              <Terminal size={14} />
              <span className="hairline-label">Query configuration</span>
            </div>
            <h2 className="font-display text-xl font-semibold tracking-tight">Deterministic retrieval run</h2>
            <p className="mt-1 max-w-2xl text-sm text-[hsl(var(--muted-foreground))]">Set the exact benchmark slice and inspect how the model got there. Same inputs, same retrieval.</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
            <span>LOCAL MODEL BENCH</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <div><FieldLabel hint="2 / 3">Hop</FieldLabel><SelectField id="hop" value={value.hop} onChange={(next) => set('hop', Number(next) as 2 | 3)}><option value={2}>2-hop</option><option value={3}>3-hop</option></SelectField></div>
          <div><FieldLabel>Split</FieldLabel><SelectField id="split" value={value.split} onChange={(next) => set('split', next as 'validation' | 'test')}><option value="validation">Validation</option><option value="test">Test</option></SelectField></div>
          <div><FieldLabel hint="fixed">Seed</FieldLabel><SelectField id="seed" value={value.seed} onChange={(next) => set('seed', Number(next) as 7 | 17 | 29 | 43 | 101)}><option value={7}>07</option><option value={17}>17</option><option value={29}>29</option><option value={43}>43</option><option value={101}>101</option></SelectField></div>
          <div><FieldLabel hint="≥ 0">Query index</FieldLabel><input id="queryIndex" data-testid="input-query-index" type="number" min={0} value={value.queryIndex} onChange={(event) => set('queryIndex', Math.max(0, Number(event.target.value)))} className="focus-ring h-10 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 font-mono text-sm shadow-[var(--shadow-sm)]" /></div>
          <div className="col-span-2"><FieldLabel>Method</FieldLabel><SelectField id="method" value={value.method} onChange={(next) => set('method', next as Required<RunModelQueryParams>['method'])}>{Object.entries(methodLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</SelectField></div>
          <div><FieldLabel hint="1–10">Top K</FieldLabel><SelectField id="topK" value={value.topK} onChange={(next) => set('topK', Number(next))}>{[3, 5, 7, 10].map((n) => <option key={n} value={n}>{n} candidates</option>)}</SelectField></div>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="button" data-testid="button-run-query" onClick={onRun} disabled={isFetching} className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[hsl(var(--primary))] px-5 text-sm font-semibold text-[hsl(var(--primary-foreground))] shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-px disabled:cursor-wait disabled:opacity-70">
            {isFetching ? <LoaderCircle size={16} className="animate-spin" /> : <Play size={15} fill="currentColor" />}
            {isFetching ? 'Running retrieval…' : 'Run query'}
          </button>
          <button type="button" data-testid="button-reset-query" onClick={() => onChange(defaults)} className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"><RotateCcw size={14} /> Reset defaults</button>
          <span className="hidden font-mono text-[10px] text-[hsl(var(--muted-foreground))] sm:ml-auto sm:block">GET /api/model/query</span>
        </div>
      </div>
    </section>
  );
}

function EvidenceBlock({ candidate }: { candidate: ModelCandidate }) {
  const evidence = candidate.evidence;
  const licensed = evidence.status.toLowerCase().includes('licensed') || evidence.status.toLowerCase().includes('verified') || evidence.status.toLowerCase().includes('available');
  const unavailable = !evidence.title && !evidence.snippet;
  return (
    <div className="mt-4 border-t border-[hsl(var(--border))] pt-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-[hsl(var(--primary))]" />
          <span className="hairline-label text-[hsl(var(--muted-foreground))]">Licensed evidence</span>
        </div>
        <span data-testid={`status-evidence-${candidate.rank}`} className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-mono text-[10px] font-medium ${licensed ? 'bg-[hsl(157_36%_88%)] text-[hsl(158_45%_25%)]' : unavailable ? 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]' : 'bg-[hsl(38_60%_88%)] text-[hsl(30_55%_30%)]'}`}>
          {licensed ? <Check size={11} /> : unavailable ? <X size={11} /> : <Info size={11} />}
          {evidence.status || 'Not available'}
        </span>
      </div>
      {unavailable ? (
        <div data-testid={`empty-evidence-${candidate.rank}`} className="rounded-md bg-[hsl(var(--muted)/.6)] px-3 py-3 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">No licensed evidence record was returned for this candidate. The retrieval result remains inspectable, but should not be treated as clinical support.</div>
      ) : (
        <div className="space-y-2">
          <p data-testid={`text-evidence-title-${candidate.rank}`} className="text-sm font-semibold leading-snug">{evidence.title || 'Untitled source'}</p>
          {evidence.snippet && <p data-testid={`text-evidence-snippet-${candidate.rank}`} className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{evidence.snippet}</p>}
          {evidence.sourceUrl && <a data-testid={`link-evidence-source-${candidate.rank}`} href={evidence.sourceUrl} target="_blank" rel="noreferrer" className="focus-ring inline-flex max-w-full items-center gap-1 truncate font-mono text-[10px] text-[hsl(var(--primary))] underline decoration-[hsl(var(--primary)/.3)] underline-offset-2 hover:decoration-[hsl(var(--primary))]"><ExternalLink size={11} /> {evidence.sourceUrl}</a>}
        </div>
      )}
    </div>
  );
}

function CandidateRow({ candidate }: { candidate: ModelCandidate }) {
  return (
    <article data-testid={`card-candidate-${candidate.rank}`} className="animate-enter-up rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]" style={{ animationDelay: `${candidate.rank * 55}ms` }}>
      <div className="flex gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[hsl(var(--primary))] font-mono text-sm font-medium text-[hsl(var(--primary-foreground))]">0{candidate.rank}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div>
              <p className="hairline-label mb-1 text-[hsl(var(--muted-foreground))]">Compound candidate</p>
              <h3 data-testid={`text-compound-${candidate.rank}`} className="font-display text-lg font-semibold tracking-tight">{candidate.compound}</h3>
            </div>
            <span data-testid={`status-path-${candidate.rank}`} className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-1 font-mono text-[10px] font-medium ${candidate.pathVerifiedInTrainGraph ? 'border-[hsl(157_36%_72%)] bg-[hsl(157_36%_93%)] text-[hsl(158_45%_25%)]' : 'border-[hsl(var(--border))] bg-[hsl(var(--muted)/.45)] text-[hsl(var(--muted-foreground))]'}`}>
              <GitBranch size={11} /> {candidate.pathVerifiedInTrainGraph ? 'Path verified' : 'Path not verified'}
            </span>
          </div>
          <EvidenceBlock candidate={candidate} />
        </div>
      </div>
    </article>
  );
}

function ResultSkeleton() {
  return <div className="space-y-3" data-testid="loading-results">{[1, 2, 3].map((n) => <div key={n} className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5"><div className="flex gap-4"><div className="h-9 w-9 animate-pulse rounded-md bg-[hsl(var(--muted))]" /><div className="flex-1 space-y-3"><div className="h-3 w-24 animate-pulse rounded bg-[hsl(var(--muted))]" /><div className="h-5 w-48 animate-pulse rounded bg-[hsl(var(--muted))]" /><div className="h-px w-full bg-[hsl(var(--muted))]" /><div className="h-3 w-3/4 animate-pulse rounded bg-[hsl(var(--muted))]" /></div></div></div>)}</div>;
}

function ModelTester() {
  const [draft, setDraft] = useState(defaults);
  const [submitted, setSubmitted] = useState<Required<RunModelQueryParams>>(defaults);
  const queryKey = useMemo(() => getRunModelQueryQueryKey(submitted), [submitted]);
  const { data, isLoading, isFetching, isError, error, refetch } = useRunModelQuery(submitted, { query: { queryKey } });

  const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string } | null)?.response?.data?.error || (error as { message?: string } | null)?.message || 'The retrieval service did not return a result.';
  const run = () => setSubmitted({ ...draft });
  const verifiedCount = data?.candidates.filter((candidate) => candidate.pathVerifiedInTrainGraph).length ?? 0;
  const evidenceCount = data?.candidates.filter((candidate) => candidate.evidence.title || candidate.evidence.snippet).length ?? 0;

  return (
    <div className="min-h-[100dvh] bg-[hsl(var(--background))]">
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><Dna size={20} strokeWidth={1.7} /></div>
            <div><div className="font-display text-sm font-bold tracking-tight">RMF<span className="text-[hsl(var(--accent))]">·</span>RAG</div><div className="hairline-label mt-0.5 text-[hsl(var(--muted-foreground))]">Model tester</div></div>
          </div>
          <div className="hidden items-center gap-5 md:flex">
            <div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(157_47%_42%)]" /> deterministic run environment</div>
            <div className="h-5 w-px bg-[hsl(var(--border))]" />
            <div className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">v0.1 / research console</div>
          </div>
          <button type="button" data-testid="button-help" className="focus-ring flex h-8 w-8 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]" aria-label="About this console"><CircleHelp size={17} /></button>
        </div>
      </header>
      <QueryForm value={draft} onChange={setDraft} onRun={run} isFetching={isFetching} />
      <main className="console-grid mx-auto grid max-w-[1440px] grid-cols-1 gap-5 px-5 py-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <section>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><div className="mb-2 flex items-center gap-2 text-[hsl(var(--primary))]"><Search size={14} /><span className="hairline-label">Ranked retrieval</span></div><h1 className="font-display text-2xl font-semibold tracking-tight">Candidate compounds</h1></div>
            {data && <div data-testid="text-result-count" className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{data.candidates.length} of {submitted.topK} returned</div>}
          </div>
          {isLoading ? <ResultSkeleton /> : isError ? <div data-testid="state-error" className="rounded-lg border border-[hsl(var(--destructive)/.28)] bg-[hsl(var(--destructive)/.06)] p-6"><div className="flex gap-3"><AlertTriangle className="mt-0.5 text-[hsl(var(--destructive))]" size={19} /><div><h2 className="font-display font-semibold">Query could not be completed</h2><p className="mt-1 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{errorMessage}</p><button type="button" data-testid="button-retry-query" onClick={() => refetch()} className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md bg-[hsl(var(--destructive))] px-3 py-2 text-xs font-semibold text-[hsl(var(--destructive-foreground))]"><RotateCcw size={13} /> Try again</button></div></div></div> : !data || data.candidates.length === 0 ? <div data-testid="state-empty" className="rounded-lg border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card)/.65)] px-6 py-14 text-center"><FlaskConical className="mx-auto mb-3 text-[hsl(var(--muted-foreground))]" size={25} /><h2 className="font-display font-semibold">No candidates in this slice</h2><p className="mx-auto mt-1 max-w-md text-sm text-[hsl(var(--muted-foreground))]">Try a different query index or benchmark split. An empty result is valid evidence about this retrieval configuration.</p></div> : <div className="space-y-3">{data.candidates.map((candidate) => <CandidateRow key={`${candidate.rank}-${candidate.compound}`} candidate={candidate} />)}</div>}
        </section>
        <aside className="space-y-4">
          <section className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[var(--shadow-sm)]">
            <div className="mb-4 flex items-center gap-2 text-[hsl(var(--primary))]"><Network size={14} /><span className="hairline-label">Run metadata</span></div>
            {data ? <div className="space-y-3">{[['Query ID', data.query.queryId], ['Source gene', data.query.sourceGene], ['Disease', data.query.disease], ['Intermediate', data.query.intermediateGene || 'None'], ['Method', methodLabels[data.method] || data.method]].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-4 border-b border-[hsl(var(--border)/.7)] pb-2 last:border-0 last:pb-0"><span className="text-xs text-[hsl(var(--muted-foreground))]">{label}</span><span data-testid={`meta-${label.toLowerCase().replace(' ', '-')}`} className="max-w-[180px] text-right font-mono text-[11px] font-medium">{value}</span></div>)}</div> : <p data-testid="empty-metadata" className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Run a query to populate the retrieval metadata and benchmark context.</p>}
          </section>
          <section className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[var(--shadow-sm)]">
            <div className="mb-4 flex items-center gap-2 text-[hsl(var(--primary))]"><ShieldCheck size={14} /><span className="hairline-label">Verification ledger</span></div>
            {data ? <div className="grid grid-cols-2 gap-2"><div data-testid="metric-path-verified" className="rounded-md bg-[hsl(var(--muted)/.7)] p-3"><div className="font-display text-2xl font-semibold">{verifiedCount}<span className="text-sm text-[hsl(var(--muted-foreground))]">/{data.candidates.length}</span></div><div className="mt-1 text-[10px] leading-tight text-[hsl(var(--muted-foreground))]">paths verified in train graph</div></div><div data-testid="metric-evidence-found" className="rounded-md bg-[hsl(var(--muted)/.7)] p-3"><div className="font-display text-2xl font-semibold">{evidenceCount}<span className="text-sm text-[hsl(var(--muted-foreground))]">/{data.candidates.length}</span></div><div className="mt-1 text-[10px] leading-tight text-[hsl(var(--muted-foreground))]">evidence records found</div></div></div> : <div className="space-y-2">{[1, 2].map((n) => <div key={n} className="h-14 animate-pulse rounded-md bg-[hsl(var(--muted))]" />)}</div>}
          </section>
          <section className="rounded-lg border border-[hsl(var(--accent)/.3)] bg-[hsl(var(--accent)/.06)] p-5">
            <div className="mb-3 flex items-center gap-2 text-[hsl(var(--accent))]"><Info size={15} /><span className="hairline-label">Research boundary</span></div>
            <p className="text-xs leading-relaxed text-[hsl(var(--foreground)/.74)]">This console reports model retrieval, graph verification, and evidence provenance only. It is not clinical advice, a treatment recommendation, or a substitute for expert review.</p>
          </section>
        </aside>
      </main>
      <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card)/.75)] px-5 py-4 md:px-8"><div className="mx-auto flex max-w-[1440px] flex-col gap-2 text-[10px] text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2"><Database size={12} /> Evidence status is returned by the licensed source layer.</span><span className="font-mono">RMF-RAG / inspect before interpreting</span></div></footer>
    </div>
  );
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={ModelTester} /><Route component={() => <div className="p-10">Not found</div>} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;