import { SEO } from "@/components/layout/SEO";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pt-24">
      <SEO title="Terms and Conditions" canonicalUrl="/terms" />
      <h1 className="text-4xl font-bold mb-8 tracking-tight">Terms and Conditions</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the MyWish Certificate Platform, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of the Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              MyWish provides a platform for generating, managing, and verifying digital certificates. Our technology allows users to design certificates, assign unique identifiers (QR codes and IDs), and host a public verification page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Certificate Generation</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-2">User Responsibilities & Accuracy of Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Users are solely responsible for ensuring that all certificate information they provide is completely accurate. You must have the explicit authorization and legal right to create and issue any certificate through our platform.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-2">Uploaded Logos and Signatures</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When uploading custom logos or signatures, you warrant that you hold the necessary rights or licenses to use these assets. MyWish assumes no responsibility for intellectual property infringements caused by user uploads.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Prohibited Uses</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You explicitly agree NOT to use the MyWish Certificate Platform to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Create fraudulent, forged, or misleading certificates.</li>
              <li>Impersonate any person, organization, educational institution, or government authority.</li>
              <li>Generate fake academic degrees, employment records, experience certificates, or achievement awards intended to deceive third parties.</li>
              <li>Engage in any activity that violates local, national, or international law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. QR Verification System</h2>
            <div className="bg-muted p-5 rounded-lg border-l-4 border-primary my-4">
              <p className="text-base font-semibold text-foreground">
                QR verification confirms that a certificate record exists in the MyWish system and that the displayed information matches the stored certificate record. It does not independently prove that the underlying course, employment, achievement, qualification, or event actually occurred.
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              MyWish provides certificate generation and verification technology. We do not guarantee or independently verify the truth of claims made by certificate issuers. The responsibility for the legitimacy and accuracy of any generated certificate lies entirely with the issuer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Certificate Revocation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Issuers may revoke certificates at any time. If an issuer revokes a certificate, the associated QR code and verification link will remain active but will explicitly display that the certificate has been <strong>Revoked</strong>, rather than presenting it as currently valid.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Account and Administrative Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Users holding administrative accounts are responsible for maintaining the confidentiality of their login credentials. Any activity occurring under your account is your responsibility. You must immediately notify us of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Service Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              While we strive to provide a reliable service, MyWish does not guarantee uninterrupted access to the platform or the verification pages. We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The MyWish platform, including its original content, features, and functionality, are owned by MyWish and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of the data and assets you input into the certificates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials and services on MyWish are provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall MyWish, its directors, employees, or suppliers be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of, or inability to access or use, the platform or any certificates generated through it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. By continuing to access or use our service after revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>


        </div>
    </div>
  );
}
