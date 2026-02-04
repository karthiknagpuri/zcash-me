'use client';

import { Suspense } from 'react';
import ZcasherOnboarding from '../../src/components/ZcasherOnboardingCRM';

function OnboardingContent() {
  return <ZcasherOnboarding />;
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#FDF6F0] flex items-center justify-center">Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
