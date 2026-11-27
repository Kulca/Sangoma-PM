import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The app is served publicly under /app on the marketing site's origin (see
  // /home/team/shared/site/src/routes/app/$.ts). basePath makes every in-app
  // link, asset and route resolve under /app so navigating inside the app stays
  // inside the app instead of falling back to the marketing site.
  basePath: "/app",
};

export default nextConfig;
