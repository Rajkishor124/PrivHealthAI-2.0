import { Link } from 'react-router-dom';
import {
  Heart,
  Search,
  Brain,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Users,
  Star,
  Activity,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const stats = [
  { icon: Users, label: 'Registered Users', value: '1,000+' },
  { icon: Search, label: 'Doctors Listed', value: '200+' },
  { icon: Activity, label: 'Assessments Done', value: '5,000+' },
  { icon: Star, label: 'Average Rating', value: '4.7 / 5' },
];

const features = [
  {
    icon: Search,
    title: 'Find Doctors',
    description:
      'Search specialists by field or city. View qualifications, experience, hospital affiliations, and ratings.',
    to: '/doctors',
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Brain,
    title: 'Symptom Assessment',
    description:
      'Select your symptoms and get an AI-powered risk score in seconds — no account needed to start.',
    to: '/assessment',
    color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  },
  {
    icon: MessageCircle,
    title: 'AI Health Chat',
    description:
      'Ask any health question and get instant, evidence-informed guidance from our AI assistant.',
    to: '/chatbot',
    color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    description:
      'Your data stays yours. We never share or sell your health information to third parties.',
    to: '/',
    color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white px-6 sm:px-8 py-16 sm:py-20 mb-12 text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-8 right-8 h-48 w-48 rounded-full bg-purple-300 blur-3xl" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Heart className="h-4 w-4" />
            AI-Powered Healthcare
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            Your Health,{' '}
            <span className="text-purple-200">Intelligently</span> Managed
          </h1>
          <p className="text-indigo-100 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Search verified doctors, assess your symptoms with AI, and get
            personalised health guidance — all in one private, secure platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Find a Doctor <ArrowRight className="h-4 w-4" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Get Started Free
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Check Symptoms
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm px-4 sm:px-6 py-5 flex items-center gap-3 sm:gap-4"
          >
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-none">{value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Feature cards */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Everything you need</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            One platform for smarter, safer healthcare decisions.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, description, to, color }) => (
            <Link
              key={title}
              to={to}
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 hover:shadow-md dark:hover:shadow-gray-950/50 hover:-translate-y-0.5 transition-all"
            >
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900 px-6 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ready to take control of your health?</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Create a free account and unlock all features in under a minute.
            </p>
          </div>
          <Link
            to="/register"
            className="shrink-0 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
          >
            Sign Up Free <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;
