import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, KeyRound, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { getApiError, decodeJwt, validateIndianPhone } from '../../utils';
import { useAuth } from '../../hooks/useAuth';
import type { User } from '../../types';

type Step = 'phone' | 'otp';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
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
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    const validation = validateIndianPhone(phone);
    if (!validation.isValid) {
      setPhoneError(validation.error || 'Invalid Indian mobile number');
      toast.error('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    try {
      await authService.sendOtp({ phone });
      toast.success('OTP sent! (Demo OTP: 123456)');
      setStep('otp');
    } catch (err: unknown) {
      toast.error(getApiError(err, 'Failed to send OTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ phone, otp });
      const token = res.data.token;
      const payload = decodeJwt(token);
      if (payload) {
        signIn(
          {
            id: payload.userId,
            name: payload.name,
            phone: payload.sub,
            role: payload.role as User['role'],
            createdAt: '',
          },
          token
        );
      } else {
        localStorage.setItem('token', token);
      }
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err: unknown) {
      toast.error(getApiError(err, 'Invalid OTP'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {step === 'phone'
          ? 'Enter your phone number to continue'
          : `Enter the OTP sent to ${phone}`}
      </p>

      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                className={`${inputClass} ${phoneError ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter Indian mobile number"
                required
              />
            </div>
            {phoneError && (
              <p className="mt-1 text-xs text-red-500 font-medium animate-[slideDown_0.15s_ease-out]">{phoneError}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>Send OTP <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              One-Time Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
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
              'Verify & Sign In'
            )}
          </button>
          <button
            type="button"
            onClick={() => { setStep('phone'); setOtp(''); }}
            className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            ← Change phone number
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        No account?{' '}
        <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
