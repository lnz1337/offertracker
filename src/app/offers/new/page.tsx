import { AddOfferForm } from "@/components/add-offer-form";

export default function NewOfferPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nova Oferta</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <AddOfferForm />
      </div>
    </div>
  );
}
