import React from 'react';
import * as Sentry from '@sentry/react';

/**
 * SentryErrorTester Component
 * 
 * Test component to validate Sentry error tracking
 * Use this component to trigger errors in Sentry dashboard
 * 
 * Features:
 * - Break the app (throws error)
 * - Send test message to Sentry
 * - Capture user context
 * - Test error boundary recovery
 */

function SentryErrorTester() {
  const handleThrowError = () => {
    // This will trigger Sentry error tracking
    throw new Error('🔥 Test error from SentryErrorTester - This is intentional!');
  };

  const handleSentryMessage = () => {
    // Log a message to Sentry
    Sentry.captureMessage('✅ Test message from frontend - Check Sentry dashboard', 'info');
    alert('Message sent to Sentry!');
  };

  const handleCaptureException = () => {
    try {
      // Simulate an error
      const obj = null;
      (obj as any).property.method();
    } catch (error) {
      Sentry.captureException(error);
      alert('Exception captured and sent to Sentry!');
    }
  };

  const handleSetUserContext = () => {
    // Set user context for better tracking
    Sentry.setUser({
      id: '123',
      email: 'test@serendipity.dev',
      username: 'santiago-test',
    });
    Sentry.captureMessage('🎯 User context set in Sentry', 'info');
    alert('User context set! Next errors will include this context.');
  };

  return (
    <div className="p-6 bg-gradient-to-r from-red-900 to-orange-900 rounded-lg border-2 border-red-500 shadow-lg max-w-md">
      <h2 className="text-xl font-bold text-white mb-4">🧪 Sentry Error Tester</h2>
      <p className="text-red-100 text-sm mb-6">
        Use these buttons to test Sentry error tracking. Check your Sentry dashboard for events.
      </p>

      <div className="flex flex-col gap-3">
        {/* Break the world button */}
        <button
          onClick={handleThrowError}
          className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-md"
        >
          🔥 Break the World
        </button>

        {/* Send message button */}
        <button
          onClick={handleSentryMessage}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md"
        >
          📨 Send Test Message
        </button>

        {/* Capture exception button */}
        <button
          onClick={handleCaptureException}
          className="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-md"
        >
          ⚠️ Capture Exception
        </button>

        {/* Set user context button */}
        <button
          onClick={handleSetUserContext}
          className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-md"
        >
          👤 Set User Context
        </button>
      </div>

      <div className="mt-6 p-3 bg-black/30 rounded text-white text-xs">
        <p>
          <strong>Tips:</strong>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Click buttons to trigger Sentry events</li>
            <li>Check: https://sentry.io/organizations/serendipity-bros/</li>
            <li>Look for project: "serendipity-anthropos-core"</li>
            <li>All events should appear in real-time</li>
          </ul>
        </p>
      </div>
    </div>
  );
}

export default SentryErrorTester;
