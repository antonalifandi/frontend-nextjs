import '@fortawesome/fontawesome-free/css/all.min.css';
import '../src/app/globals.css';
import { AuthProvider } from "../src/app/context/AuthContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
