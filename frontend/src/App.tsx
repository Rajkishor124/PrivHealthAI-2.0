import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import AppRouter from './routes/AppRouter';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white dark:border dark:border-gray-700',
          }}
        />
        <AppRouter />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
