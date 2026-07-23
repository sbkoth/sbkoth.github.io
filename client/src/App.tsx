import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Router, Switch } from "wouter";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { queryClient } from "./lib/queryClient";

/**
 * wouter base for https://sbkoth.github.io/ (user site root).
 * Empty string when BASE_URL is / or ./ so routes are absolute from domain root.
 */
export function routerBase(envBase: string = import.meta.env.BASE_URL || "/"): string {
  if (!envBase || envBase === "/" || envBase === "./" || envBase === ".") {
    return "";
  }
  return envBase.endsWith("/") ? envBase.slice(0, -1) : envBase;
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
    </QueryClientProvider>
  );
}

export default App;
