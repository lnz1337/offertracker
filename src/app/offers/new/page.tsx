import { AddOfferForm } from "@/components/add-offer-form";

export default function NewOfferPage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <a
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Voltar ao Dashboard
        </a>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nova Oferta</h1>
      <div className="card p-6">
        <AddOfferForm />
      </div>
    </div>
  );
}
