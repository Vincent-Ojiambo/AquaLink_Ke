import { useEffect } from 'react';

export function TestSafety() {
  useEffect(() => {
    console.log('TestSafety component mounted');
    return () => console.log('TestSafety component unmounted');
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Safety Test Page</h1>
      <p>If you can see this, the basic routing is working.</p>
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <h2 className="font-semibold text-blue-800">Test Results</h2>
        <ul className="mt-2 space-y-2">
          <li>✅ Component rendered successfully</li>
          <li>✅ Basic styling is working</li>
          <li>✅ React is properly initialized</li>
        </ul>
      </div>
    </div>
  );
}
