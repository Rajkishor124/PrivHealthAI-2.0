import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, User, Mail, KeyRound, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { getApiError, validateIndianPhone } from '../../utils';

type Step = 'details' | 'otp';

interface FormData {
  name: string;
  phone: string;
  email: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('details');
  const [form, setForm] = useState<FormData>({ name: '', phone: '', email: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'phone') {
      if (value) {
        const validation = validateIndianPhone(value);
        if (!validation.isValid) {
          setPhoneError(validation.error || 'Invalid phone number');
        } else {
          setPhoneError('');
        }
      } else {
        setPhoneError('');
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateIndianPhone(form.phone);
    if (!validation.isValid) {
      setPhoneError(validation.error || 'Invalid Indian mobile number');
      toast.error('Please fix validation errors before registering');
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        name: form.name,
        phone: form.phone,
        email: form.email.trim() || undefined,
      });
      toast.success('Account created! (Demo OTP: 123456)');
      setStep('otp');
    } catch (err: unknown) {
      toast.error(getApiError(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ phone: form.phone, otp });
      localStorage.setItem('token', res.data.token);
      toast.success('Welcome to PrivHealthAI!');
      navigate('/');
    } catch (err: unknown) {
      toast.error(getApiError(err, 'Invalid OTP'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

  const iconClass = 'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create Account</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {step === 'details'
          ? 'Join PrivHealthAI — free, private, AI-powered'
          : `Enter the OTP sent to ${form.phone}`}
      </p>

      {step === 'details' ? (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className={labelClass}>
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className={iconClass} />
              <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="John Doe" required />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Phone Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone className={iconClass} />
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={`${inputClass} ${phoneError ? 'border-red-500 focus:ring-red-500' : ''}`} placeholder="Enter Indian mobile number" required />
            </div>
            {phoneError && (
              <p className="mt-1 text-xs text-red-500 font-medium animate-[slideDown_0.15s_ease-out]">{phoneError}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Email{' '}
              <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Mail className={iconClass} />
              <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>Create Account <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className={labelClass}>One-Time Password</label>
            <div className="relative">
              <KeyRound className={iconClass} />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={`${inputClass} tracking-widest text-center text-lg font-mono`}
                placeholder="123456"
                maxLength={6}
                required
              />
            </div>
            <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              Demo mode — OTP is always{' '}
              <span className="font-mono">123456</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Verify & Finish'
            )}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Register;
