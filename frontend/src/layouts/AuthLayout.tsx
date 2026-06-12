import { Outlet } from 'react-router-dom';
import { Heart, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 border border-gray-200/60 dark:border-gray-700/60 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">PrivHealthAI</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Your private healthcare companion</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-gray-950/50 p-8 border border-transparent dark:border-gray-800">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
