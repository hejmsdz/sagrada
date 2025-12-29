import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";

export function BackButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  const router = useRouter();
  const handleClick = () => {
    onClick();
    router.history.back();
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleClick}>
      {children}
    </Button>
  );
}
