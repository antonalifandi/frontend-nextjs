/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',  
        destination: '/auth/login',  
        permanent: false,  
      },
    ];
  },
};

export default nextConfig;
