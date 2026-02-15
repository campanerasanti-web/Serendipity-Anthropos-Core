/**
 * Sentry Diagnostics - Verifica la conectividad y configuración
 */

export const testSentryConnection = async () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  console.log('🔍 Sentry Diagnostics:');
  console.log('DSN:', dsn ? `${dsn.substring(0, 40)}...` : '❌ NO CONFIGURADO');
  console.log('Environment:', import.meta.env.MODE);
  console.log('DEV Mode:', import.meta.env.DEV);

  if (!dsn) {
    console.error('❌ VITE_SENTRY_DSN no está configurado');
    return false;
  }

  try {
    // Intenta conectar directamente al endpoint de Sentry
    const response = await fetch(`${dsn.split('@')[1].split('/')[0]}/api/0/envelope/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-sentry-envelope' },
      mode: 'no-cors',
      body: JSON.stringify({ test: true })
    });

    console.log('✅ Sentry endpoint reachable');
    return true;
  } catch (error) {
    console.error('❌ Cannot reach Sentry:', error);
    return false;
  }
};

// Auto-test en desarrollo
if (import.meta.env.DEV) {
  setTimeout(() => {
    testSentryConnection();
  }, 1000);
}
