import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

/**
 * wouter base for root-relative deploys.
 * - Domain root (/): empty base
 * - Project Pages (/repo/…): first path segment
 * - Explicit VITE_BASE subpath: use that
 */
export function routerBase(
  envBase: string = import.meta.env.BASE_URL || "./",
  pathname: string = typeof window !== "undefined" ? window.location.pathname : "/",
): string {
  if (envBase && envBase !== "/" && envBase !== "./" && envBase !== ".") {
    return envBase.endsWith("/") ? envBase.slice(0, -1) : envBase;
  }

  // Relative or absolute root base — derive project prefix if present
  const clean = pathname.replace(/\/index\.html$/i, "");
  if (clean === "/" || clean === "") return "";

  const segments = clean.split("/").filter(Boolean);
  if (segments.length === 0) return "";

  // Ignore known asset roots when inferring (shouldn't be navigation paths)
  const first = segments[0];
  if (["assets", "data", "uploads"].includes(first)) return "";

  return `/${first}`;
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router base={routerBase()}>
        <AppRouter />
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
