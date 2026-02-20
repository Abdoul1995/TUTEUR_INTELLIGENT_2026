import { ArrowLeft, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function PrivacyPolicy() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    retour
                </button>

                <div className="card p-8 lg:p-12">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Politique de Confidentialité</h1>
                    </div>

                    <div className="prose prose-primary max-w-none text-gray-600 space-y-6">
                        <p className="lead text-lg">
                            La protection de vos données personnelles est une priorité absolue pour Tuteur Intelligent. Cette politique vous explique comment nous traitons vos informations.
                        </p>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">1. Données collectées</h2>
                            <p>Nous collectons uniquement les informations nécessaires au bon fonctionnement pédagogique :</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Informations de compte : Nom, prénom, email, niveau scolaire.</li>
                                <li>Données de progression : Scores aux exercices, leçons consultées.</li>
                                <li>Interactions IA : Historique des conversations avec le tuteur pour améliorer l'aide apportée.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">2. Utilisation des données</h2>
                            <p>Vos données sont utilisées pour :</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Personnaliser votre parcours d'apprentissage.</li>
                                <li>Identifier vos points faibles et vous proposer des révisions adaptées.</li>
                                <li>Assurer le suivi pour les parents et enseignants liés à votre compte.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">3. Partage des données</h2>
                            <p>
                                Nous ne vendons jamais vos données personnelles. Elles sont partagées uniquement avec :
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Vos parents ou enseignants (si vous avez lié vos comptes).</li>
                                <li>Nos partenaires technologiques indispensables (ex: Groq pour l'IA), de manière anonymisée ou sécurisée.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">4. Sécurité</h2>
                            <p>
                                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé ou perte accidentelle.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">5. Vos droits</h2>
                            <p>
                                Conformément à la réglementation sur la protection des données, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez exercer ces droits depuis votre espace profil ou en nous contactant.
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
