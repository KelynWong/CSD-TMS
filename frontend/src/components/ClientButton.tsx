'use client';

import { Button } from "@/components/ui/button";

export default function ClientButton() {
  return (
    <Button variant="outline" onClick={() => console.log('Button clicked')}>
      heelo
    </Button>
  );
}