/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */

const config = {
    async rewrites() {
        return [
            {
                source: '/pricing',
                destination: '/upgrade'
            },
            {
                source: '/checkout',
                destination: '/upgrade'
            },
            {
                source: '/checkout/success',
                destination: '/upgrade/success'
            },
        ];
    },
    
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    },

    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
          },
        ],
      },

};

export default config;


