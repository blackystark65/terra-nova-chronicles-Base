import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import BiomeTemperateForestPage from './pages/BiomeTemperateForest';
import BiomeWetlandsPage from './pages/BiomeWetlands';
import BiomeMountainsPage from './pages/BiomeMountains';
import BiodiversitePage from './pages/Biodiversite';
import AdminAudioPage from './pages/AdminAudio';
import GuidePage from './pages/Guide';
import EcospherePage from './pages/Ecosphere';
import AdminEcospherePage from './pages/AdminEcosphere';
import PollinisationPage from './pages/Pollinisation';
import BioFocusPage from './pages/BioFocus';
import PresentationPage from './pages/Presentation';
import AbonnementPage from './pages/Abonnement';
import AgendaPage from './pages/Agenda';
import BilanPedagogiquePage from './pages/BilanPedagogiquePage';
import BiomeSolPage from './pages/BiomeSol';
import GestionElevesPage from './pages/GestionEleves';
import GithubIssuesPage from './pages/GithubIssues';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/BiomeTemperateForest" element={<LayoutWrapper currentPageName="BiomeTemperateForest"><BiomeTemperateForestPage /></LayoutWrapper>} />
      <Route path="/BiomeWetlands" element={<LayoutWrapper currentPageName="BiomeWetlands"><BiomeWetlandsPage /></LayoutWrapper>} />
      <Route path="/BiomeMountains" element={<LayoutWrapper currentPageName="BiomeMountains"><BiomeMountainsPage /></LayoutWrapper>} />
      <Route path="/Biodiversite" element={<LayoutWrapper currentPageName="Biodiversite"><BiodiversitePage /></LayoutWrapper>} />
      <Route path="/AdminAudio" element={<LayoutWrapper currentPageName="AdminAudio"><AdminAudioPage /></LayoutWrapper>} />
      <Route path="/Guide" element={<LayoutWrapper currentPageName="Guide"><GuidePage /></LayoutWrapper>} />
      <Route path="/Ecosphere" element={<LayoutWrapper currentPageName="Ecosphere"><EcospherePage /></LayoutWrapper>} />
      <Route path="/AdminEcosphere" element={<LayoutWrapper currentPageName="AdminEcosphere"><AdminEcospherePage /></LayoutWrapper>} />
      <Route path="/Pollinisation" element={<LayoutWrapper currentPageName="Pollinisation"><PollinisationPage /></LayoutWrapper>} />
      <Route path="/BioFocus" element={<LayoutWrapper currentPageName="BioFocus"><BioFocusPage /></LayoutWrapper>} />
      <Route path="/Presentation" element={<LayoutWrapper currentPageName="Presentation"><PresentationPage /></LayoutWrapper>} />
      <Route path="/Abonnement" element={<LayoutWrapper currentPageName="Abonnement"><AbonnementPage /></LayoutWrapper>} />
      <Route path="/Agenda" element={<LayoutWrapper currentPageName="Agenda"><AgendaPage /></LayoutWrapper>} />
      <Route path="/BilanPedagogique" element={<LayoutWrapper currentPageName="BilanPedagogique"><BilanPedagogiquePage /></LayoutWrapper>} />
      <Route path="/BiomeSol" element={<LayoutWrapper currentPageName="BiomeSol"><BiomeSolPage /></LayoutWrapper>} />
      <Route path="/GestionEleves" element={<LayoutWrapper currentPageName="GestionEleves"><GestionElevesPage /></LayoutWrapper>} />
      <Route path="/GithubIssues" element={<LayoutWrapper currentPageName="GithubIssues"><GithubIssuesPage /></LayoutWrapper>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App