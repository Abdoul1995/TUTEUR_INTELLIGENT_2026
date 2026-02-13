import React, { useState } from 'react';
import { Bot, Sparkles, BookOpen, GraduationCap, Layers } from 'lucide-react';
import { aiService } from '../../services/ai.service';
import { Subject } from '../../types';

interface AIExerciseGeneratorProps {
    subjects: Subject[];
    onExerciseGenerated: (exercise: any) => void;
}

export const AIExerciseGenerator: React.FC<AIExerciseGeneratorProps> = ({ subjects, onExerciseGenerated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        level: '',
        topic: '',
        difficulty: 'medium'
    });
    const [generatedExercise, setGeneratedExercise] = useState<any>(null);

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
                formData.difficulty
            );
            setGeneratedExercise(exercise);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la génération de l'exercice");
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
                Générer avec l'IA
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-purple-600">
                        <Bot className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Générateur d'Exercices IA</h2>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                        Fermer
                    </button>
                </div>

                <div className="p-6">
                    {!generatedExercise ? (
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select
                                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                            required
                                        >
                                            <option value="">Choisir une matière</option>
                                            {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select
                                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            value={formData.level}
                                            onChange={e => setFormData({ ...formData, level: e.target.value })}
                                            required
                                        >
                                            <option value="">Choisir un niveau</option>
                                            {levels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulté</label>
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
                                                diff === 'easy' ? 'Facile' : diff === 'medium' ? 'Moyen' : 'Difficile'
                                            }</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet / Thème</label>
                                <div className="relative">
                                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Ex: Fractions, Verbes du 1er groupe, La révolution française..."
                                        value={formData.topic}
                                        onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                        required
                                    />
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
                                        Génération en cours...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Générer l'exercice
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
                                        {generatedExercise.difficulty || 'Moyen'}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-4">{generatedExercise.description}</p>

                                {/* Display Question Content Preview */}
                                <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                                    <p className="font-medium mb-3">{generatedExercise.content.question}</p>
                                    <div className="space-y-2">
                                        {generatedExercise.content.options?.map((opt: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                                <span>{opt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2 text-sm text-gray-500">
                                    <span className="italic">L'exercice est prêt à être résolu !</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setGeneratedExercise(null)}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Générer un autre
                                </button>
                                <button
                                    onClick={() => {
                                        onExerciseGenerated({
                                            ...generatedExercise,
                                            level: formData.level,
                                            subject: formData.subject
                                        });
                                        setIsOpen(false);
                                    }}
                                    className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-colors"
                                >
                                    Commencer cet exercice
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
