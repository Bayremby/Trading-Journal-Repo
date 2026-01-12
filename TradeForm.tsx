
import React, { useState } from 'react';
import { 
  Plus, X, Image as ImageIcon, Check, AlertCircle, Save 
} from 'lucide-react';
import { Trade, Pair, Session, CRT, EntryType, RiskLevel, Rating, Result, POICategories } from '../types';
import { 
  PAIRS, SESSIONS, CRTS, ENTRY_TYPES, RISK_LEVELS, RATINGS, RESULTS, 
  POI_FVG, POI_OB, POI_OTHER, SMT_TYPES 
} from '../constants';

interface TradeFormProps {
  onSave: (trade: Trade) => void;
  onCancel: () => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Trade>>({
    id: crypto.randomUUID(),
    pair: 'NQ',
    date: new Date().toISOString().split('T')[0],
    entryTime: '10:00',
    exitTime: '10:30',
    session: 'NY',
    crt: 'M15',
    poi: { fvg: [], ob: [], other: [] },
    smtTypes: [],
    entryType: 'Confirmation Entry',
    risk: '0.5%',
    rr: '',
    rating: 'B',
    result: 'Small Win',
    images: [],
    review: {
      rulesFollowed: true,
      recap: {
        drawOnLiquidity: '',
        htfNarrative: '',
      },
      mistakes: [],
      whatWentWell: [],
      whatWentWrong: [],
      keyLesson: '',
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    (Array.from(files) as File[]).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const toggleMultiSelect = (category: keyof POICategories, value: string) => {
    setFormData((prev) => {
      const currentPoi = prev.poi || { fvg: [], ob: [], other: [] };
      const currentCategory = currentPoi[category];
      const newCategory = currentCategory.includes(value)
        ? currentCategory.filter((v) => v !== value)
        : [...currentCategory, value];
      return { ...prev, poi: { ...currentPoi, [category]: newCategory } };
    });
  };

  const toggleSmt = (value: string) => {
    setFormData((prev) => {
      const current = prev.smtTypes || [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, smtTypes: next };
    });
  };

  const handleReviewChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      review: {
        ...prev.review!,
        [field]: value,
      },
    }));
  };

  const handleRecapChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      review: {
        ...prev.review!,
        recap: {
          ...prev.review!.recap,
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rr) return alert('Please enter R:R');
    onSave(formData as Trade);
  };

  const addListItem = (field: 'mistakes' | 'whatWentWell' | 'whatWentWrong', value: string) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      review: {
        ...prev.review!,
        [field]: [...prev.review![field], value],
      },
    }));
  };

  const removeListItem = (field: 'mistakes' | 'whatWentWell' | 'whatWentWrong', index: number) => {
    setFormData((prev) => ({
      ...prev,
      review: {
        ...prev.review!,
        [field]: prev.review![field].filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center sticky top-0 bg-zinc-950/90 backdrop-blur py-4 z-20 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-100 uppercase tracking-wider">Log New Execution</h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-zinc-100 text-zinc-950 text-sm font-bold uppercase tracking-tighter hover:bg-zinc-300 transition-colors flex items-center gap-2 rounded-sm"
          >
            <Save size={16} /> Save Trade
          </button>
        </div>
      </div>

      <section className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs uppercase tracking-widest mb-4">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Metadata
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-bold uppercase">Pair</label>
            <select
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
              value={formData.pair}
              onChange={(e) => setFormData({ ...formData, pair: e.target.value as Pair })}
            >
              {PAIRS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-bold uppercase">Date</label>
            <input
              type="date"
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-bold uppercase">Session</label>
            <select
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
              value={formData.session}
              onChange={(e) => setFormData({ ...formData, session: e.target.value as Session })}
            >
              {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-bold uppercase">Entry Time</label>
            <input
              type="time"
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
              value={formData.entryTime}
              onChange={(e) => setFormData({ ...formData, entryTime: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-bold uppercase">Exit Time</label>
            <input
              type="time"
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
              value={formData.exitTime}
              onChange={(e) => setFormData({ ...formData, exitTime: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-bold uppercase">CRT</label>
            <select
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
              value={formData.crt}
              onChange={(e) => setFormData({ ...formData, crt: e.target.value as CRT })}
            >
              {CRTS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-xl space-y-8">
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs uppercase tracking-widest mb-4">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Confluence
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">FVG</h4>
            <div className="grid grid-cols-1 gap-2">
              {POI_FVG.map((fvg) => (
                <label key={fvg} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.poi?.fvg.includes(fvg)}
                    onChange={() => toggleMultiSelect('fvg', fvg)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-500"
                  />
                  <span className="text-sm text-zinc-300 group-hover:text-zinc-100">{fvg}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">Order Blocks</h4>
            <div className="grid grid-cols-1 gap-2">
              {POI_OB.map((ob) => (
                <label key={ob} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.poi?.ob.includes(ob)}
                    onChange={() => toggleMultiSelect('ob', ob)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-500"
                  />
                  <span className="text-sm text-zinc-300 group-hover:text-zinc-100">{ob}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase border-b border-zinc-800 pb-2">Other PD Arrays</h4>
            <div className="grid grid-cols-1 gap-2">
              {POI_OTHER.map((other) => (
                <label key={other} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.poi?.other.includes(other)}
                    onChange={() => toggleMultiSelect('other', other)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-500"
                  />
                  <span className="text-sm text-zinc-300 group-hover:text-zinc-100">{other}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <h4 className="text-xs font-bold text-zinc-400 uppercase">SMT Type</h4>
          <div className="flex flex-wrap gap-4">
            {SMT_TYPES.map((smt) => (
              <label key={smt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.smtTypes?.includes(smt)}
                  onChange={() => toggleSmt(smt)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-500"
                />
                <span className="text-sm text-zinc-300">{smt}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs uppercase tracking-widest mb-4">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Execution
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-bold uppercase">Entry Type</label>
            <select
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
              value={formData.entryType}
              onChange={(e) => setFormData({ ...formData, entryType: e.target.value as EntryType })}
            >
              {ENTRY_TYPES.map((et) => <option key={et} value={et}>{et}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-bold uppercase">Risk %</label>
            <select
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
              value={formData.risk}
              onChange={(e) => setFormData({ ...formData, risk: e.target.value as RiskLevel })}
            >
              {RISK_LEVELS.map((rl) => <option key={rl} value={rl}>{rl}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-bold uppercase">R:R Achieved</label>
            <input
              type="text"
              placeholder="e.g. 2.7"
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
              value={formData.rr}
              onChange={(e) => setFormData({ ...formData, rr: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-bold uppercase">Rating</label>
            <select
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value as Rating })}
            >
              {RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-bold uppercase">Result</label>
            <select
              className={`w-full bg-zinc-950 border border-zinc-800 rounded p-2 font-bold ${
                formData.result?.includes('Win') ? 'text-emerald-500' : 'text-rose-500'
              }`}
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value as Result })}
            >
              {RESULTS.map((res) => <option key={res} value={res}>{res}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs uppercase tracking-widest mb-4">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Media
        </div>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-800 border-dashed rounded-lg cursor-pointer bg-zinc-950 hover:bg-zinc-900 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-8 h-8 mb-3 text-zinc-500" />
              <p className="mb-2 text-sm text-zinc-400"><span className="font-semibold">Click to upload</span> charts</p>
            </div>
            <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images?.map((img, idx) => (
            <div key={idx} className="relative group aspect-video rounded overflow-hidden border border-zinc-800">
              <img src={img} className="object-cover w-full h-full" alt="upload" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, images: formData.images?.filter((_, i) => i !== idx) })}
                className="absolute top-1 right-1 p-1 bg-zinc-950/80 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} className="text-rose-500" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-xl space-y-8">
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs uppercase tracking-widest mb-4">
          <span className="w-2 h-2 bg-amber-500 rounded-full"></span> Psychology & Review
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase">Trading Rules Compliance</h4>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.review?.rulesFollowed === true}
                onChange={() => handleReviewChange('rulesFollowed', true)}
                className="w-4 h-4 text-emerald-500 bg-zinc-950 border-zinc-700"
              />
              <span className="text-sm flex items-center gap-1 text-emerald-400"><Check size={14} /> Followed</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.review?.rulesFollowed === false}
                onChange={() => handleReviewChange('rulesFollowed', false)}
                className="w-4 h-4 text-rose-500 bg-zinc-950 border-zinc-700"
              />
              <span className="text-sm flex items-center gap-1 text-rose-400"><AlertCircle size={14} /> Broken</span>
            </label>
          </div>
          {!formData.review?.rulesFollowed && (
            <div className="mt-2">
              <label className="text-xs text-rose-500 font-bold uppercase mb-1 block">Rule Breach Explanation</label>
              <textarea
                className="w-full bg-zinc-950 border border-rose-900/30 rounded p-2 text-zinc-100 text-sm focus:outline-none focus:border-rose-700"
                rows={2}
                value={formData.review?.brokenRuleDescription}
                onChange={(e) => handleReviewChange('brokenRuleDescription', e.target.value)}
                placeholder="Explicitly define the breach..."
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold text-zinc-400 uppercase">Guided Trade Recap</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Draw on Liquidity</label>
              <textarea
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 text-sm h-24"
                value={formData.review?.recap.drawOnLiquidity}
                onChange={(e) => handleRecapChange('drawOnLiquidity', e.target.value)}
                placeholder="Where was the target?"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">HTF Narrative</label>
              <textarea
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 text-sm h-24"
                value={formData.review?.recap.htfNarrative}
                onChange={(e) => handleRecapChange('htfNarrative', e.target.value)}
                placeholder="What was the story on the HTF?"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(['mistakes', 'whatWentWell', 'whatWentWrong'] as const).map((listKey) => (
            <div key={listKey} className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                {listKey === 'mistakes' ? '❌ Mistakes' : listKey === 'whatWentWell' ? '✅ What Went Well' : '⚠️ What Went Wrong'}
              </h4>
              <div className="space-y-2">
                {formData.review?.[listKey].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-zinc-950 p-2 rounded border border-zinc-800 text-xs">
                    <span className="mt-0.5">•</span>
                    <span className="flex-1">{item}</span>
                    <button type="button" onClick={() => removeListItem(listKey, idx)} className="text-zinc-600 hover:text-rose-500"><X size={12} /></button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add item..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-100"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addListItem(listKey, (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = (e.currentTarget.previousSibling as HTMLInputElement);
                      addListItem(listKey, input.value);
                      input.value = '';
                    }}
                    className="p-2 bg-zinc-800 text-zinc-100 rounded hover:bg-zinc-700"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-1 pt-4 border-t border-zinc-800">
          <label className="text-xs text-zinc-400 font-bold uppercase">Key Lesson</label>
          <input
            type="text"
            className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-zinc-100 font-medium"
            value={formData.review?.keyLesson}
            onChange={(e) => handleReviewChange('keyLesson', e.target.value)}
            placeholder="Single takeaway..."
          />
        </div>
      </section>
    </form>
  );
};

export default TradeForm;
