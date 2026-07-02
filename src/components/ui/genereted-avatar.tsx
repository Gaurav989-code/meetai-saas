import { createAvatar } from "@dicebear/core";
// In v10, you must import the style functions directly from the collection
import { botttsNeutral, initials } from "@dicebear/collection";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant: "botttsNeutral" | "initials";
}

// Map variant names directly to their style modules
const avatarStyles = {
  botttsNeutral,
  initials,
};

export const GeneratedAvatar = ({
  seed,
  className,
  variant,
}: GeneratedAvatarProps) => {
  
  // createAvatar takes the style directly as the first argument in v10
  const avatarInstance = createAvatar(avatarStyles[variant], {
    seed,
  });

  // Generate the image payload string using the instance utility
  const avatarDataUri = avatarInstance.toDataUri();

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatarDataUri} alt="User Avatar" />
      <AvatarFallback>{seed.substring(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
