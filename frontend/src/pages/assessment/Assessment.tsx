import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, AlertTriangle, CheckCircle, AlertOctagon, Info, Circle,
  Pill, Stethoscope, Star, MapPin, Sparkles, ClipboardList,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { assessmentService } from '../../services/assessmentService';
import type { AssessmentResult } from '../../types';
import { getApiError } from '../../utils';
import Spinner from '../../components/common/Spinner';

const SYMPTOMS = [
  { key: 'chest_pain', label: 'Chest Pain' },
  { key: 'shortness_of_breath', label: 'Shortness of Breath' },
  { key: 'severe_headache', label: 'Severe Headache' },
  { key: 'high_fever', label: 'High Fever (38°C+)' },
  { key: 'dizziness', label: 'Dizziness' },
  { key: 'vomiting', label: 'Vomiting / Nausea' },
  { key: 'abdominal_pain', label: 'Abdominal Pain' },
  { key: 'fatigue', label: 'Fatigue / Weakness' },
  { key: 'mild_headache', label: 'Mild Headache' },
  { key: 'cough', label: 'Cough' },
  { key: 'runny_nose', label: 'Runny Nose' },
  { key: 'sore_throat', label: 'Sore Throat' },
] as const;

const ANALYZE_STEPS = [
  'Reading symptom data',
  'Consulting AI medical engine',
  'Matching specialist doctors',
  'Generating your report',
];

const STEP_DELAYS_MS = [0, 1200, 2600, 4200];
const MIN_ANALYZE_MS = 5000;

const riskConfig = {
  LOW: {
    color: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    text: 'text-green-800 dark:text-green-300',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    icon: CheckCircle,
    iconColor: 'text-green-500 dark:text-green-400',
  },
  MODERATE: {
    color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-300',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    icon: Info,
    iconColor: 'text-yellow-500 dark:text-yellow-400',
  },
  HIGH: {
    color: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
    text: 'text-orange-800 dark:text-orange-300',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    icon: AlertTriangle,
    iconColor: 'text-orange-500 dark:text-orange-400',
  },
  CRITICAL: {
    color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    text: 'text-red-800 dark:text-red-300',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    icon: AlertOctagon,
    iconColor: 'text-red-500 dark:text-red-400',
  },
};

const progressForStep = [12, 38, 65, 88];

const Assessment = () => {
  const { isAuthenticated } = useAuth();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [additionalSymptoms, setAdditionalSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // Advance analysis steps on a timer while analyzing
  useEffect(() => {
    if (!analyzing) return;
    const timers = STEP_DELAYS_MS.slice(1).map((delay, i) =>
      setTimeout(() => setAnalyzeStep(i + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [analyzing]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-4">
          <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Symptom Assessment</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Sign in to use the AI-powered symptom assessment tool.</p>
        <Link to="/login" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  const toggleSymptom = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (selected.size === 0 || !age || !gender) return;
    setAnalyzing(true);
    setAnalyzeStep(0);

    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, MIN_ANALYZE_MS));

    try {
      const [res] = await Promise.all([
        assessmentService.submit({
          symptoms: Array.from(selected),
          age: parseInt(age, 10),
          gender,
          additionalSymptoms: additionalSymptoms.trim() || undefined,
        }),
        minDelay,
      ]);
      setResult(res.data);
    } catch (err) {
      toast.error(getApiError(err, 'Assessment failed. Please try again.'));
    } finally {
      setAnalyzing(false);
      setAnalyzeStep(0);
    }
  };

  /* ── Analyzing overlay ── */
  if (analyzing) {
    const progress = progressForStep[analyzeStep] ?? 12;
    return (
      <div className="max-w-lg mx-auto py-8 animate-[fadeInUp_0.3s_ease-out]">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 sm:p-10 text-center">
          {/* Spinner with brain */}
          <div className="relative h-20 w-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-900/60" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Analyzing Your Symptoms</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Our AI engine is evaluating your health profile…
          </p>

          {/* Step list */}
          <div className="space-y-3 text-left max-w-xs mx-auto mb-8">
            {ANALYZE_STEPS.map((label, i) => {
              const isDone = i < analyzeStep;
              const isActive = i === analyzeStep;
              return (
                <div key={label} className="flex items-center gap-3">
                  {isDone && (
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 shrink-0" />
                  )}
                  {isActive && (
                    <Spinner size="sm" className="shrink-0" />
                  )}
                  {!isDone && !isActive && (
                    <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600 shrink-0" />
                  )}
                  <span
                    className={`text-sm transition-colors ${
                      isDone
                        ? 'text-gray-400 dark:text-gray-500 line-through'
                        : isActive
                        ? 'text-gray-800 dark:text-gray-100 font-medium'
                        : 'text-gray-400 dark:text-gray-600'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{progress}% complete</p>
        </div>
      </div>
    );
  }

  /* ── Result view ── */
  if (result) {
    const cfg = riskConfig[result.riskLevel];
    const Icon = cfg.icon;
    return (
      <div className="max-w-2xl mx-auto animate-[fadeInUp_0.3s_ease-out]">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Assessment Result</h1>

        <div className={`rounded-2xl border-2 p-6 ${cfg.color} mb-6`}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Icon className={`h-8 w-8 ${cfg.iconColor} shrink-0`} />
            <div>
              <p className={`text-xs font-medium uppercase tracking-wide ${cfg.text} opacity-70`}>Risk Level</p>
              <p className={`text-2xl font-bold ${cfg.text}`}>{result.riskLevel}</p>
            </div>
            <div className="ml-auto text-right">
              <p className={`text-xs font-medium uppercase tracking-wide ${cfg.text} opacity-70`}>Risk Score</p>
              <p className={`text-2xl font-bold ${cfg.text}`}>{result.riskScore} <span className="text-base font-normal">/ 100</span></p>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${cfg.text}`}>{result.recommendation}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Reported Symptoms</h3>
          <div className="flex flex-wrap gap-2">
            {result.symptoms.map((s) => {
              const sym = SYMPTOMS.find((x) => x.key === s);
              return (
                <span key={s} className={`text-xs rounded-full px-3 py-1 font-medium ${cfg.badge}`}>
                  {sym?.label ?? s}
                </span>
              );
            })}
          </div>
          {result.additionalSymptoms && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 italic">
              “{result.additionalSymptoms}”
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Age: {result.age} · Gender: {result.gender}
          </p>
        </div>

        {/* AI: possible conditions */}
        {result.aiPowered && result.possibleConditions.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              Possible Conditions
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              AI-suggested possibilities based on your symptoms — not a diagnosis.
            </p>
            <div className="space-y-3">
              {result.possibleConditions.map((c) => (
                <div key={c.name} className="rounded-xl border border-gray-100 dark:border-gray-800 p-3">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{c.name}</span>
                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                      c.likelihood.toLowerCase() === 'high'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        : c.likelihood.toLowerCase() === 'moderate'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                    }`}>
                      {c.likelihood} likelihood
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI: medicines */}
        {result.aiPowered && result.medicines.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Pill className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              Suggested Medicines (OTC)
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              Common over-the-counter options. Always confirm with a doctor or pharmacist before taking any medicine.
            </p>
            <div className="space-y-3">
              {result.medicines.map((m) => (
                <div key={m.name} className="flex gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                    <Pill className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{m.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{m.purpose}</p>
                    {m.note && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">⚠ {m.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI: advice */}
        {result.aiPowered && result.aiAdvice && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 p-5 mb-6">
            <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4" /> AI Advice
            </h3>
            <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed">{result.aiAdvice}</p>
          </div>
        )}

        {/* AI: recommended doctors */}
        {result.aiPowered && result.recommendedDoctors.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              Recommended Specialists
              {result.recommendedSpecialization && (
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full px-2 py-0.5 font-medium">
                  {result.recommendedSpecialization}
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              Top-rated doctors on PrivHealthAI for your condition.
            </p>
            <div className="space-y-3">
              {result.recommendedDoctors.map((d) => (
                <Link
                  key={d.id}
                  to={`/doctors/${d.id}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {d.fullName.replace('Dr. ', '').charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{d.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {d.hospital}
                      {d.city && (
                        <span className="inline-flex items-center gap-0.5 ml-2">
                          <MapPin className="h-3 w-3" /> {d.city}
                        </span>
                      )}
                    </p>
                  </div>
                  {d.rating != null && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                      <Star className="h-3.5 w-3.5 fill-current" /> {Number(d.rating).toFixed(1)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-6">
          This assessment is AI-generated and informational only — it is not a medical diagnosis.
          Always consult a licensed doctor.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { setResult(null); setSelected(new Set()); setAdditionalSymptoms(''); setAge(''); setGender(''); }}
            className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Take Another Assessment
          </button>
          <Link
            to="/doctors"
            className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium text-center hover:bg-indigo-700 transition-colors"
          >
            Find a Doctor
          </Link>
        </div>
      </div>
    );
  }

  /* ── Form view ── */
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Symptom Assessment</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select your symptoms and get an AI-powered risk evaluation</p>
      </div>

      {/* Symptoms */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Select Symptoms <span className="text-red-400">*</span>
          {selected.size > 0 && (
            <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full px-2 py-0.5">
              {selected.size} selected
            </span>
          )}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SYMPTOMS.map(({ key, label }) => {
            const active = selected.has(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleSymptom(key)}
                className={`text-left p-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual symptoms */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          Describe Other Symptoms <span className="text-xs font-normal text-gray-400 dark:text-gray-500">(optional)</span>
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Anything not listed above — in your own words. The AI will factor this into its analysis.
        </p>
        <textarea
          value={additionalSymptoms}
          onChange={(e) => setAdditionalSymptoms(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="e.g. burning sensation in my left arm for 2 days, worse at night…"
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        {additionalSymptoms.length > 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">{additionalSymptoms.length}/1000</p>
        )}
      </div>

      {/* Profile */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Your Profile</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Age <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min={1}
              max={120}
              placeholder="e.g. 35"
              className="w-28 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Gender <span className="text-red-400">*</span>
            </p>
            <div className="flex gap-4 flex-wrap">
              {['MALE', 'FEMALE', 'OTHER'].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={() => setGender(g)}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {g.charAt(0) + g.slice(1).toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={selected.size === 0 || !age || !gender}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Brain className="h-5 w-5" /> Analyze Symptoms
      </button>
    </div>
  );
};

export default Assessment;
