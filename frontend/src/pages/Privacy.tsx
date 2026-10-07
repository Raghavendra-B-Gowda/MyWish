import { SEO } from "@/components/layout/SEO";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pt-24">
      <SEO title="Privacy Policy" canonicalUrl="/privacy" />
      <h1 className="text-4xl font-bold mb-8 tracking-tight">Privacy Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to the MyWish Certificate Platform. We respect your privacy and are committed to protecting the personal data we collect. This Privacy Policy explains how we handle the information you provide when using our certificate generation and verification tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-2">Information Provided During Certificate Creation</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you generate a certificate, we collect the necessary details to populate the document, such as recipient names, email addresses, certificate or course titles, roles, and duration details.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-2">Uploaded Signatures and Logos</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Any custom signatures, logos, or institutional marks you upload are stored solely for the purpose of placing them onto the generated certificates.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-2">Administrative Account Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you hold an administrative or issuer account, we collect your login credentials and contact details to manage your access to the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Information</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-2">Certificate Generation and Verification</h3>
            <p className="text-muted-foreground leading-relaxed">
              The primary use of the data we collect is to generate digital certificates and enable our QR code and ID-based verification systems. We do not use this data for marketing or sell it to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Public Certificate Verification</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-2">What Information Is Publicly Visible</h3>
            <p className="text-muted-foreground leading-relaxed">
              Certificates generated on MyWish are designed to be publicly verifiable. Anyone with the unique certificate ID or QR code can access a verification page. The verification page may display information such as the recipient's name, certificate/course title, role, duration, issue date, issuer details, and the current verification status. 
            </p>
            <div className="bg-muted p-4 rounded-lg mt-4">
              <p className="text-sm font-medium text-foreground">
                Important: Users should only enter information they are explicitly authorized to publish. MyWish does not independently verify whether the real-world achievement, course, employment, or qualification described on a certificate actually occurred.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect the data stored on our servers. While we strive to protect your personal information, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain certificate data for as long as necessary to provide the verification service. If a certificate is deleted by the issuer, the associated data is removed from our active verification database.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Certificate Deletion and Revocation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Issuers have the ability to revoke or delete certificates they have generated. A revoked certificate will still exist in the system but will display a "Revoked" status upon verification. A deleted certificate will be entirely removed, and verification attempts will indicate that the record does not exist.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. User Data Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Depending on your jurisdiction, you may have rights to access, correct, or request the deletion of your personal data. Certificate recipients who wish to have their data removed from our verification system should first contact the issuing organization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may utilize third-party hosting, database, and analytics providers to operate our platform. These providers are authorized to use your personal data only as necessary to provide these services to us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected such data, we will take steps to delete it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to the Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes in our practices. We will notify users of significant changes by updating the date at the top of this page. Continued use of the platform constitutes acceptance of the revised policy.
            </p>
          </section>


        </div>
    </div>
  );
}
