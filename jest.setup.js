// Configuration globale pour Jest
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock des variables d'environnement
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';