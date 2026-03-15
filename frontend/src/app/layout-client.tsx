'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LoadingProvider, useLoading } from '@/context/LoadingContext';
import PortfolioAssistant from '@/components/PortfolioAssistant';
import CustomCursor from '@/components/CustomCursor';
import VisitorTracker from '@/components/VisitorTracker';
import LoadingScreen from '@/components/LoadingScreen';
import { initGA, logPageView } from '@/analytics';

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { isFirstLoad } = useLoading();

  return (
    <>
      <LoadingScreen />
      <VisitorTracker />
      <CustomCursor />
      {!isFirstLoad && children}
      <PortfolioAssistant />
    </>
  );
}

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    logPageView();
  }, [pathname]);

  return (
    <LoadingProvider>
      <InnerLayout>{children}</InnerLayout>
    </LoadingProvider>
  );
}
