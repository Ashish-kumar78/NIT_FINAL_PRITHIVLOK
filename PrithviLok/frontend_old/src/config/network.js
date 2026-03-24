const runtimeOrigin = typeof window !== 'undefined' ? window.location.origin : '';
const defaultDevOrigin = 'http://localhost:5000';

const normalizeApiBase = (apiBase) => apiBase.replace(/\/+$/, '');
const toOriginFromApi = (apiBase) => normalizeApiBase(apiBase).replace(/\/api$/, '');

export const API_BASE = import.meta.env.DEV
  ? normalizeApiBase(import.meta.env.VITE_API_URL || `${defaultDevOrigin}/api`)
  : '/api';

export const SOCKET_URL = import.meta.env.DEV
  ? import.meta.env.VITE_SOCKET_URL || toOriginFromApi(API_BASE)
  : runtimeOrigin;

export const MEDIA_BASE_URL = import.meta.env.DEV ? toOriginFromApi(API_BASE) : '';
