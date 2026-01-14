import { useState } from "react";
import { User, Crown, Shield, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ProfileCard from "./ProfileCard";

interface UserAvatarProps {
  userId?: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  role?: string;
  isVip?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  clickable?: boolean;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  className?: string;
  onSendMessage?: (userId: string, username: string) => void;
}

const sizeClasses = {
  xs: "h-5 w-5",
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10"
};

const textSizeClasses = {
  xs: "text-[8px]",
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm"
};

const iconSizeClasses = {
  xs: "w-2.5 h-2.5",
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5"
};

export const UserAvatar = ({
  userId,
  username,
  displayName,
  avatarUrl,
  role,
  isVip,
  size = "md",
  clickable = true,
  showOnlineStatus = false,
  isOnline = false,
  className,
  onSendMessage
}: UserAvatarProps) => {
  const [showProfile, setShowProfile] = useState(false);
  
  const isCreator = username.toLowerCase() === 'aswd';
  const isAdmin = role === 'admin';

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarContent = () => {
    if (isCreator) {
      return <Crown className={iconSizeClasses[size]} />;
    }
    if (isAdmin) {
      return <Shield className={iconSizeClasses[size]} />;
    }
    return getInitials(displayName || username);
  };

  const getAvatarStyle = () => {
    if (isCreator) {
      return "bg-gradient-to-br from-amber-500/30 to-yellow-500/30 text-amber-400";
    }
    if (isAdmin) {
      return "bg-red-500/20 text-red-400";
    }
    if (isVip) {
      return "bg-purple-500/20 text-purple-400";
    }
    return "bg-primary/20 text-primary";
  };

  const handleClick = () => {
    if (clickable) {
      setShowProfile(true);
    }
  };

  return (
    <>
      <div className={cn("relative inline-block", className)}>
        <Avatar 
          className={cn(
            sizeClasses[size],
            clickable && "cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all",
          )}
          onClick={handleClick}
        >
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} />
          ) : null}
          <AvatarFallback className={cn(textSizeClasses[size], getAvatarStyle())}>
            {getAvatarContent()}
          </AvatarFallback>
        </Avatar>
        
        {/* Online status indicator */}
        {showOnlineStatus && (
          <span 
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-2 border-background",
              size === "xs" ? "w-1.5 h-1.5" : size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5",
              isOnline ? "bg-green-500" : "bg-muted-foreground"
            )}
          />
        )}
      </div>
      
      {clickable && (
        <ProfileCard
          userId={userId}
          username={username}
          displayName={displayName}
          avatarUrl={avatarUrl}
          role={role}
          isVip={isVip}
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          onSendMessage={onSendMessage}
        />
      )}
    </>
  );
};

export default UserAvatar;
