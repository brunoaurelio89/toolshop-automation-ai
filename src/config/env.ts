import 'dotenv/config';

/**
 * Ambientes do Toolshop. A mesma suíte roda nos dois (E8).
 * Escolha com TEST_ENV=normal | with-bugs (padrão: normal).
 */
const ENVIRONMENTS = {
  normal: {
    uiURL: 'https://practicesoftwaretesting.com',
    apiURL: 'https://api.practicesoftwaretesting.com',
  },
  'with-bugs': {
    uiURL: 'https://with-bugs.practicesoftwaretesting.com',
    apiURL: 'https://api-with-bugs.practicesoftwaretesting.com',
  },
} as const;

export type EnvironmentName = keyof typeof ENVIRONMENTS;

function resolveEnvironment(): EnvironmentName {
  const name = process.env.TEST_ENV ?? 'normal';
  if (!(name in ENVIRONMENTS)) {
    const valid = Object.keys(ENVIRONMENTS).join(', ');
    throw new Error(`TEST_ENV inválido: "${name}". Use um destes: ${valid}.`);
  }
  return name as EnvironmentName;
}

export const environmentName = resolveEnvironment();
export const environment = ENVIRONMENTS[environmentName];

/**
 * Conta de teste própria (nunca a conta demo, que está bloqueada).
 * Vem do .env localmente e dos GitHub Secrets no CI.
 */
export const credentials = {
  email: process.env.USER_EMAIL ?? '',
  password: process.env.USER_PASSWORD ?? '',
};

export const hasCredentials = credentials.email !== '' && credentials.password !== '';
