'use client';

import { LoadingProvider, useLoading } from '@/context/LoadingContext';
import PortfolioAssistant from '@/components/PortfolioAssistant';
import CustomCursor from '@/components/CustomCursor';
import LoadingScreen from '@/components/LoadingScreen';

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { isFirstLoad } = useLoading();

  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      {!isFirstLoad && children}
      <PortfolioAssistant />
    </>
  );
}

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <InnerLayout>{children}</InnerLayout>
    </LoadingProvider>
  );
}
