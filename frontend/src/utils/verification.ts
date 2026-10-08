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
        tm: data.templateId,
        e: data.email,
        dv: data.durationValue,
        dt: data.durationType,
        dn: data.directorName
      };
      // Create a compact base64 string and safely URL-encode it
      const base64Str = btoa(JSON.stringify(minimalData));
      return `${baseUrl}?d=${encodeURIComponent(base64Str)}`;
    } catch (e) {
      console.warn("Failed to encode certificate data for offline verification");
    }
  }
  
  return baseUrl;
};
