import { GraduationCap, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function TermsOfService() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> retour
                </button>

                <div className="card p-8 lg:p-12">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Conditions Générales d'Utilisation</h1>
                    </div>

                    <div className="prose prose-primary max-w-none text-gray-600 space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">1. Présentation du site</h2>
                            <p>
                                Le site <strong>Tuteur Intelligent</strong> est une plateforme éducative numérique conçue pour accompagner les élèves du primaire et du secondaire dans leur apprentissage quotidien grâce à des outils pédagogiques classiques et basés sur l'Intelligence Artificielle.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">2. Conditions d'accès</h2>
                            <p>
                                L'accès au site est ouvert à tout élève, parent ou enseignant dûment inscrit. L'utilisateur s'engage à fournir des informations exactes lors de sa création de compte. L'utilisation d'identifiants par des tiers est strictement interdite.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">3. Utilisation des services d'IA</h2>
                            <p>
                                Tuteur Intelligent intègre des services d'Intelligence Artificielle pour la génération d'exercices et le tutorat interactif. Bien que nous nous efforcions d'assurer la précision pédagogique, les réponses générées par l'IA doivent être utilisées comme un support pédagogique et ne remplacent pas l'expertise d'un enseignant qualifié.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">4. Propriété intellectuelle</h2>
                            <p>
                                Les contenus pédagogiques originaux (leçons, structures d'exercices) sont la propriété de Tuteur Intelligent. Toute reproduction totale ou partielle sans autorisation est interdite.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">5. Responsabilités</h2>
                            <p>
                                Tuteur Intelligent ne saurait être tenu responsable des interruptions temporaires du service ou des erreurs mineures dans les contenus générés dynamiquement. Nous nous réservons le droit de suspendre tout compte ne respectant pas les règles élémentaires de courtoisie (notamment lors des interactions avec le chat).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">6. Modifications</h2>
                            <p>
                                Ces conditions peuvent être modifiées à tout moment pour s'adapter aux évolutions techniques et législatives.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-gray-100 text-sm italic">
                            Dernière mise à jour : 17 février 2026
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
