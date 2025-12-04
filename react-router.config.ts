import type { Config } from "@react-router/dev/config";

export default {
  // Enable server-side rendering so route loaders/actions (like `/api/contact`) can run
  ssr: false,
} satisfies Config;
