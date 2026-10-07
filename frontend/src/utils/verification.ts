import { API_URL } from '@/config/api';

/**
 * Generates a verification URL. If no backend is configured, it safely encodes
 * essential certificate data into the URL so verification works offline/locally.
 */
export const generateVerificationUrl = (certId: string, data?: any) => {
  const domain = typeof window !== 'undefined' ? window.location.origin : "https://mywish-eta.vercel.app";
  const baseUrl = `${domain}/verify/${certId}`;
  
  if (API_URL) {
    // Backend exists, no need to encode data in URL
    return baseUrl;
  }

  // No backend: encode minimal data for offline verification
  if (data) {
    try {
      const minimalData = {
        n: data.recipientName,
        t: data.type,
        c: data.courseName || data.internshipRole,
        i: data.issueDate,
        o: data.organization,
        l: data.logoType,
        tm: data.templateId
      };
      // Create a compact base64 string that is safe for URLs
      const encoded = btoa(JSON.stringify(minimalData)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return `${baseUrl}?d=${encoded}`;
    } catch (e) {
      console.warn("Failed to encode certificate data for offline verification");
    }
  }
  
  return baseUrl;
};
