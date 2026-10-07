import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20 flex items-center justify-center py-20">
      <div className="text-center px-4">
        <h1 className="text-8xl font-black text-secondary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-secondary mb-4">Page not found</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild size="lg">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
