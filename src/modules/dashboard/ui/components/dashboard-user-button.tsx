import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { GeneratedAvatar } from "@/components/ui/genereted-avatar";

import { ChevronDown, CreditCardIcon, LogOutIcon } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardUserButton = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  if (isPending || !data?.user) {
    return null;
  }

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/sign-in") },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center justify-start rounded-lg border border-border/10 
      p-3 w-full bg-white/5 hover:bg-white/10 overflow-hidden "
      >
        {data.user.image ? (
          <Avatar>
            <AvatarImage src={data.user.image} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.id}
            variant="initials"
            className="size-8 mr-3"
          />
        )}

        <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
          <p className="text-sm truncate w-full">{data.user.name}</p>
          <p className="text-xs truncate w-full">{data.user.email}</p>
        </div>
        <ChevronDown className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="truncate font-medium">{data.user.name}</span>
            <span className="text-sm font-medium text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center cursor-pointer justify-between">
          Billing
          <CreditCardIcon className="size-4 " />
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center cursor-pointer justify-between"
        >
          Logout
          <LogOutIcon className="size-4 " />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardUserButton;
