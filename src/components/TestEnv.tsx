import { useEffect } from 'react';

export default function TestEnv() {
  useEffect(() => {
    console.log('Environment Variables:', {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      NODE_ENV: import.meta.env.MODE,
    });
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '5px' }}>
      <h3>Environment Variables Test</h3>
      <pre>
        {JSON.stringify({
          VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not Set',
          VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
          NODE_ENV: import.meta.env.MODE,
        }, null, 2)}
      </pre>
    </div>
  );
}
