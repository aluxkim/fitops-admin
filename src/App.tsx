import type { ReactNode } from "react";
import { ColorSchemeProvider, GlobalEventsHandlerProvider } from "gestalt";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AppLayout } from "./components/AppLayout";
import { OverviewPage } from "./pages/Overview";
import { MembersPage } from "./pages/Members";
import { MemberDetailPage } from "./pages/MemberDetail";
import { ClassesPage } from "./pages/Classes";
import { AppointmentsPage } from "./pages/Appointments";
import { StaffPage } from "./pages/Staff";
import { CommercePage } from "./pages/Commerce";
import { MarketingPage } from "./pages/Marketing";
import { InsightsPage } from "./pages/Insights";
import { AiFab } from "./components/AiFab";

function GestaltNavigation({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <GlobalEventsHandlerProvider
      linkHandlers={{
        onNavigation:
          ({ href }) =>
          ({ event }) => {
            if (href.startsWith("http")) return;
            event.preventDefault();
            navigate(href);
          },
      }}
    >
      {children}
    </GlobalEventsHandlerProvider>
  );
}

export default function App() {
  return (
    <ColorSchemeProvider colorScheme="light">
      <BrowserRouter>
        <GestaltNavigation>
          <AppProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/members/:memberId" element={<MemberDetailPage />} />
                <Route path="/classes" element={<ClassesPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/staff" element={<StaffPage />} />
                <Route path="/commerce" element={<CommercePage />} />
                <Route path="/marketing" element={<MarketingPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
            <AiFab />
          </AppProvider>
        </GestaltNavigation>
      </BrowserRouter>
    </ColorSchemeProvider>
  );
}
