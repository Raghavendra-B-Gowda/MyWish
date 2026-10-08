import { generateVerificationUrl } from './src/utils/verification.js';

const data = {
  recipientName: 'Test Student',
  type: 'course',
  courseName: 'Web Dev',
  issueDate: '2026-10-07',
  organization: 'MyWish Academy',
  logoType: 'mywish',
  templateId: 'modern-1'
};

const url = generateVerificationUrl('MW-2026-TEST', data);
console.log('URL:', url);

if (url.includes('?d=')) {
  const d = url.split('?d=')[1];
  console.log('Decoded data:', JSON.parse(atob(d.replace(/-/g, '+').replace(/_/g, '/'))));
}
