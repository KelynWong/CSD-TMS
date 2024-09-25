'use client';

import React, { ReactNode } from 'react';
import { Button, ButtonProps } from "@/components/ui/button";

interface ClientButtonProps extends ButtonProps {
  children: ReactNode;
}

export default function ClientButton({ children, ...props }: ClientButtonProps) {
  return (
    <Button {...props}>
      {children}
    </Button>
  );
}