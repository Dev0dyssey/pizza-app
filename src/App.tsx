import { lazy, Suspense, type ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";

const Landing = lazy(() => import("./Components/LandingPage"));
const LogIn = lazy(() => import("./Components/LogIn"));
const MainPage = lazy(() => import("./Components/MainPage"));
const NewPizzasOverview = lazy(
  () => import("./Components/NewPizzaSection/NewPizzasOverview"),
);
const OtherMeals = lazy(() => import("./Components/OtherMeals/OtherMeals"));
const ProfileSettings = lazy(
  () => import("./Components/ProfileSettings/ProfileSettings"),
);
const MyGroups = lazy(() => import("./Components/Groups/MyGroups"));
const SignUp = lazy(() => import("./Components/SignUp"));

function Protected({ children }: { children: ReactElement }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}

export default function App() {
  return (
    <AuthProvider>
      <main className="container min-vh-100">
        <Suspense fallback={<p className="text-center mt-5">Loading…</p>}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/main"
              element={
                <Protected>
                  <MainPage />
                </Protected>
              }
            />
            <Route
              path="/main/newpizzas"
              element={
                <Protected>
                  <NewPizzasOverview />
                </Protected>
              }
            />
            <Route
              path="/main/othermeals"
              element={
                <Protected>
                  <OtherMeals />
                </Protected>
              }
            />
            <Route
              path="/main/profilesettings"
              element={
                <Protected>
                  <ProfileSettings />
                </Protected>
              }
            />
            <Route
              path="/main/groups"
              element={
                <Protected>
                  <MyGroups />
                </Protected>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </AuthProvider>
  );
}
