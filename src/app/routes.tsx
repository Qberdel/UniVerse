import { createBrowserRouter, redirect } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { LoginPage } from "./pages/LoginPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ProfilePage } from "./pages/ProfilePage";
import { UniversityPage } from "./pages/UniversityPage";
import { CartPage } from "./pages/CartPage";
import { MenuPage } from "./pages/MenuPage";
import { AddActivityPage } from "./pages/AddActivityPage";
import { ModeratorPage } from "./pages/ModeratorPage";
import { CompareUniversitiesPage } from "./pages/CompareUniversitiesPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AboutPage } from "./pages/AboutPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { isRegistered } from "./lib/auth";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        loader: () => {
          if (isRegistered()) return redirect("/dashboard");
          return null;
        },
        Component: AboutPage,
      },
      { path: "dashboard", Component: DashboardPage },
      { path: "register", Component: RegistrationPage },
      { path: "login", Component: LoginPage },
      { path: "forgot-password", Component: ForgotPasswordPage },
      {
        path: "profile",
        loader: () => {
          if (!isRegistered()) return redirect("/register");
          return null;
        },
        Component: ProfilePage,
      },
      { path: "university/:id", Component: UniversityPage },
      { path: "cart", Component: CartPage },
      { path: "menu", Component: MenuPage },
      { path: "add-activity", Component: AddActivityPage },
      { path: "moderator", Component: ModeratorPage },
      { path: "compare", Component: CompareUniversitiesPage },
      { path: "privacy", Component: PrivacyPolicyPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
