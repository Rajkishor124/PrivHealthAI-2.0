export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const classNames = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(' ');
};

export const getApiError = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const msg = (err as { response?: { data?: { message?: string } } })
      .response?.data?.message;
    if (typeof msg === 'string' && msg) return msg;
  }
  return fallback;
};

export interface JwtPayload {
  sub: string;
  userId: string;
  name: string;
  role: 'USER' | 'DOCTOR' | 'ADMIN';
  iat: number;
  exp: number;
}

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4);
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};

export const validateIndianPhone = (phone: string): { isValid: boolean; normalized?: string; error?: string } => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  const cleaned = phone.replace(/[ \-\(\)]/g, '');

  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, normalized: '+91' + cleaned };
  }
  if (/^0[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, normalized: '+91' + cleaned.slice(1) };
  }
  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, normalized: cleaned };
  }
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, normalized: '+' + cleaned };
  }

  return { isValid: false, error: 'Please enter a valid Indian mobile number' };
};

export const formatIndianPhone = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+91') && cleaned.length === 13) {
    return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
};
