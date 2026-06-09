import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('nvkm_user');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global response interceptor to handle session expiration (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('nvkm_user');
      window.dispatchEvent(new Event('auth_logout'));
    }
    return Promise.reject(error);
  }
);

export default api;

export const DEFAULT_SETTINGS = {
  contact_phone_1: "9014274293",
  contact_phone_2: "7075604700",
  whatsapp_phone_1: "9014274293",
  whatsapp_phone_2: "7075604700",
  email: "Navakiranamgroup@gmail.com",
  address: "Near bypass Anantapur Road, Bathalapalli, Sri Sathya Sai Dist, Andhra Pradesh 515661",
  footer_address: "NVKM GROUP Manufacturing, Andhra Pradesh, India",
  footer_phone_1: "+91 90142 74293",
  footer_phone_2: "+91 70756 04700",
  seo_title: "NVKM GROUP | Premium Natural Fruit & Vegetable Powders",
  seo_description: "Buy premium natural fruit and vegetable powders including Banana Powder and Moringa Powder from NVKM GROUP. Natural, healthy, and high-quality powders.",
  seo_keywords: "banana powder, moringa powder, natural fruit powder, vegetable powder, organic herbal powder, nvkm group",
  google_site_verification: "",
  robots_txt: "User-agent: *\nAllow: /\n\nSitemap: {site_url}/sitemap.xml"
};

