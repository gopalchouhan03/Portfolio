'use client';

import React from 'react';
import { useVisitorCount } from '@/hooks/usePortfolioAPI';

export default function VisitorTracker() {
  // this hook handles TTL/lock and server token sending
  useVisitorCount();
  return null;
}
