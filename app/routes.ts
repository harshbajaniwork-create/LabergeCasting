import {
  type RouteConfig,
  index,
  route,
  layout,
  redirect,
} from "@react-router/dev/routes";

export default [
  // Redirect root to /fr
  route("/", "routes/redirect.tsx"),

  // Language grouped routes
  route(":lang", "routes/lang-handler.tsx", [
    index("routes/home.tsx"),
    route("privacy-policy", "routes/privacy-policy.tsx"),
  ]),

  // API routes remain outside language prefix
  route("api/contact", "routes/api.contact.ts"),
] satisfies RouteConfig;
