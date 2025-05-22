import { Sparkles } from 'lucide-react';

export function GratitudeFlowHeader() {
  return (
    <header className="py-8 text-center">
      <div className="inline-flex items-center">
        <Sparkles className="w-10 h-10 mr-3 text-accent" />
        <h1 className="text-4xl font-semibold tracking-tight text-primary">
          GratitudeFlow
        </h1>
      </div>
      <p className="mt-2 text-lg text-muted-foreground">
        Tune into the frequency of receiving. Share your day, find your flow.
      </p>
    </header>
  );
}
