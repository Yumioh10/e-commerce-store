import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/terms')({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-medical-text mb-8">Medical Terms of Service</h1>
      
      <section className="prose prose-medical max-w-none">
        <h2>1. Professional Use Only</h2>
        <p>MaparaSanté platform is exclusively for licensed healthcare professionals...</p>
        
        <h2>2. Medical Device Regulations</h2>
        <p>All products comply with EU MDR 2017/745...</p>
        
        <h2>3. Prescription Verification</h2>
        <p>Medical license verification required for prescription-only products...</p>
        
        {/* Add full legal content */}
      </section>
    </div>
  );
}