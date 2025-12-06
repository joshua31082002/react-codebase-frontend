import React, { type PropsWithChildren } from 'react';

interface ConditionalRenderProps {
  condition?: unknown;
  fallback?: React.ReactNode;
}

const ConditionalRender = ({
  children,
  condition,
  fallback,
}: PropsWithChildren<ConditionalRenderProps>) => {
  return <>{condition ? children : fallback}</>;
};

export default ConditionalRender;
