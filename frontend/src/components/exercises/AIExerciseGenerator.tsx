import React, { useState } from 'react';
import { Bot, Sparkles, BookOpen, GraduationCap, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { aiService } from '../../services/ai.service';
import { Subject } from '../../types';
import { LatexRenderer } from '../common/LatexRenderer';

interface AIExerciseGeneratorProps {
    subjects?: Subject[];
    onExerciseGenerated: (exercise: any) => void;
}

export const AIExerciseGenerator: React.FC<AIExerciseGeneratorProps> = ({ subjects = [], onExerciseGenerated }) => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [localSubjects, setLocalSubjects] = useState<Subject[]>(subjects);
    const [formData, setFormData] = useState({
        subject: '',
        level: '',
        topic: '',
        difficulty: 'medium',
        exerciseType: 'qcm' as 'qcm' | 'classic'
    });
    const [generatedExercise, setGeneratedExercise] = useState<any>(null);

    React.useEffect(() => {
        if (subjects.length > 0) {
            setLocalSubjects(subjects);
        } else {
            import('../../services/api').then(({ api }) => {
                api.getSubjects().then(data => {
                    setLocalSubjects(data.results || data);
                }).catch(err => console.error("Error loading subjects:", err));
            });
        }
    }, [subjects]);

    const levels = [
        { value: 'cp1', label: 'CP1' }, { value: 'cp2', label: 'CP2' },
        { value: 'ce1', label: 'CE1' }, { value: 'ce2', label: 'CE2' },
        { value: 'cm1', label: 'CM1' }, { value: 'cm2', label: 'CM2' },
        { value: 'sixieme', label: '6ème' }, { value: 'cinquieme', label: '5ème' },
        { value: 'quatrieme', label: '4ème' }, { value: 'troisieme', label: '3ème' },
        { value: 'seconde', label: 'Seconde' }, { value: 'premiere', label: 'Première' },
        { value: 'terminale', label: 'Terminale' }
    ];

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.subject || !formData.level || !formData.topic) return;

        setLoading(true);
        setGeneratedExercise(null);

        try {
            const exercise = await aiService.generateExercise(
                formData.subject,
                formData.level,
                formData.topic,
                formData.difficulty,
                formData.exerciseType,
                i18n.language
            );
            setGeneratedExercise(exercise);
        } catch (error) {
            console.error(error);
            alert(t('ai_gen.error_msg'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all font-medium"
            >
                <Sparkles className="w-5 h-5" />
                {t('ai_gen.trigger_button')}
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-purple-600">
                        <Bot className="w-6 h-6" />
                        <h2 className="text-xl font-bold">{t('ai_gen.modal_title')}</h2>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                        {t('ai_gen.close')}
                    </button>
                </div>

                <div className="p-6">
                    {!generatedExercise ? (
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('ai_gen.label_subject')}</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select
                                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                            required
                                        >
                                            <option value="">{t('ai_gen.select_subject')}</option>
                                            {localSubjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('ai_gen.label_level')}</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select
                                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            value={formData.level}
                                            onChange={e => setFormData({ ...formData, level: e.target.value })}
                                            required
                                        >
                                            <option value="">{t('ai_gen.select_level')}</option>
                                            {levels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('ai_gen.label_difficulty')}</label>
                                <div className="flex gap-4">
                                    {['easy', 'medium', 'hard'].map(diff => (
                                        <label key={diff} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="difficulty"
                                                value={diff}
                                                checked={formData.difficulty === diff}
                                                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                                className="text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="capitalize">{
                                                diff === 'easy' ? t('ai_gen.diff_easy') :
                                                    diff === 'medium' ? t('ai_gen.diff_medium') :
                                                        t('ai_gen.diff_hard')
                                            }</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('ai_gen.label_topic')}</label>
                                <div className="relative">
                                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder={t('ai_gen.placeholder_topic')}
                                        value={formData.topic}
                                        onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('ai_gen.label_type')}</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:bg-gray-50 flex-1 border-gray-200 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 transition-all">
                                        <input
                                            type="radio"
                                            name="exerciseType"
                                            value="qcm"
                                            checked={formData.exerciseType === 'qcm'}
                                            onChange={e => setFormData({ ...formData, exerciseType: e.target.value as 'qcm' | 'classic' })}
                                            className="text-purple-600 focus:ring-purple-500"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{t('ai_gen.type_qcm')}</span>
                                            <span className="text-xs text-gray-500">{t('ai_gen.type_qcm_desc')}</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:bg-gray-50 flex-1 border-gray-200 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 transition-all">
                                        <input
                                            type="radio"
                                            name="exerciseType"
                                            value="classic"
                                            checked={formData.exerciseType === 'classic'}
                                            onChange={e => setFormData({ ...formData, exerciseType: e.target.value as 'qcm' | 'classic' })}
                                            className="text-purple-600 focus:ring-purple-500"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{t('ai_gen.type_classic')}</span>
                                            <span className="text-xs text-gray-500">{t('ai_gen.type_classic_desc')}</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                                        {t('ai_gen.button_generating')}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        {t('ai_gen.button_generate')}
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{generatedExercise.title}</h3>
                                    <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full uppercase font-bold">
                                        {generatedExercise.difficulty || formData.difficulty || 'Moyen'}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-4"><LatexRenderer text={generatedExercise.description} /></p>

                                {/* Display Question Content Preview */}
                                <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                                    <p className="font-medium mb-3"><LatexRenderer text={generatedExercise.content.question} /></p>

                                    {/* QCM Preview */}
                                    {generatedExercise.content.options && (
                                        <div className="space-y-2">
                                            {generatedExercise.content.options.map((opt: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors">
                                                    <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">
                                                        {String.fromCharCode(65 + idx)}
                                                    </div>
                                                    <span><LatexRenderer text={opt} /></span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Classic Preview */}
                                    {generatedExercise.content.text && (
                                        <div className="mb-4 text-gray-700 italic border-l-4 border-purple-200 pl-3">
                                            <LatexRenderer text={generatedExercise.content.text} />
                                        </div>
                                    )}
                                    {generatedExercise.content.questions && Array.isArray(generatedExercise.content.questions) && (
                                        <div className="space-y-3 mt-4">
                                            {generatedExercise.content.questions.map((q: any, idx: number) => {
                                                if (typeof q === 'string') {
                                                    return (
                                                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                                            <span className="font-bold text-purple-600 mr-2">{idx + 1}.</span>
                                                            <LatexRenderer text={q} />
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                                        <span className="font-bold text-purple-600 mr-2">{idx + 1}.</span>
                                                        <span><LatexRenderer text={q.question || q.text || ''} /></span>
                                                        {q.options && Array.isArray(q.options) && (
                                                            <div className="mt-2 pl-6 space-y-1">
                                                                {q.options.map((opt: string, i: number) => (
                                                                    <div key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                                                        <div className="w-5 h-5 rounded-full bg-white border border-gray-300 text-xs flex items-center justify-center">{String.fromCharCode(65 + i)}</div>
                                                                        <LatexRenderer text={opt} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex gap-2 text-sm text-gray-500">
                                    <span className="italic">{t('ai_gen.ready_msg')}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setGeneratedExercise(null)}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    {t('ai_gen.button_generate_another')}
                                </button>
                                <button
                                    onClick={() => {
                                        onExerciseGenerated(generatedExercise);
                                        setIsOpen(false);
                                    }}
                                    className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-colors"
                                >
                                    {t('ai_gen.button_start')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
