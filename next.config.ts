import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        // 允许worker-frame路由被同源iframe嵌入
        source: '/worker-frame',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // 允许同源嵌入
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'", // CSP版本的frame控制
          },
        ],
      },
      {
        // 为主页面保持默认安全设置
        source: '/((?!worker-frame).*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // 主页面仍然拒绝被嵌入
          },
        ],
      },
    ];
  },
  // FIXME: REMEMBER TO REMOVE IT, IF YOU NOT NEEDED
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
