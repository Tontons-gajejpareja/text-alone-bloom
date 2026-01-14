import { useState, useEffect } from "react";
import { User, Crown, Shield, Star, UserPlus, MessageSquare, X, Loader2, Clock, Trophy, Users } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFriends } from "@/hooks/useFriends";
import { useOnlineAccount } from "@/hooks/useOnlineAccount";

interface ProfileCardProps {
  userId?: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  role?: string;
  isVip?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (userId: string, username: string) => void;
}

interface UserProfile {
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string | null;
  clearance: number | null;
  created_at: string;
  lifetime_kroner: number;
  spendable_kroner: number;
  total_chat_messages: number | null;
  equipped_title_id: string | null;
  equipped_badge_id: string | null;
}

interface UserStats {
  achievementCount: number;
  friendCount: number;
}

export const ProfileCard = ({
  userId,
  username,
  displayName,
  avatarUrl,
  role,
  isVip,
  isOpen,
  onClose,
  onSendMessage
}: ProfileCardProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({ achievementCount: 0, friendCount: 0 });
  const [loading, setLoading] = useState(false);
  const { sendFriendRequest, isFriend, friends } = useFriends();
  const { user } = useOnlineAccount();
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  
  const isCreator = username.toLowerCase() === 'aswd';
  const isAdmin = role === 'admin';
  const isCurrentUser = user?.id === userId;

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfile();
      fetchStats();
    }
  }, [isOpen, userId]);

  const fetchProfile = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (!error && data) {
        setProfile(data as unknown as UserProfile);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    if (!userId) return;
    try {
      // Fetch achievement count
      const { count: achievementCount } = await supabase
        .from("user_achievements")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      
      // Fetch friend count
      const { count: friendCount } = await supabase
        .from("friends")
        .select("*", { count: "exact", head: true })
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq("status", "accepted");
      
      setStats({
        achievementCount: achievementCount || 0,
        friendCount: friendCount || 0
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleAddFriend = async () => {
    if (!userId) return;
    const result = await sendFriendRequest(userId);
    if (result.success) {
      toast.success("Friend request sent!");
      setFriendRequestSent(true);
    } else {
      toast.error(result.error || "Failed to send friend request");
    }
  };

  const handleSendMessage = () => {
    if (userId && onSendMessage) {
      onSendMessage(userId, username);
      onClose();
    }
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleBadge = () => {
    if (isCreator) {
      return (
        <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30">
          <Crown className="w-3 h-3 mr-1" />
          Creator
        </Badge>
      );
    }
    if (isAdmin) {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    }
    if (isVip || profile?.role === 'vip') {
      return (
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
          <Star className="w-3 h-3 mr-1" />
          VIP
        </Badge>
      );
    }
    return null;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const isAlreadyFriend = userId ? isFriend(userId) : false;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-br from-background to-muted/20 border-border/50">
        {/* Header Banner */}
        <div className="h-20 bg-gradient-to-r from-primary/20 via-cyan-500/20 to-blue-500/20 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Profile Content */}
        <div className="px-6 pb-6 -mt-10">
          {/* Avatar */}
          <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
            {avatarUrl || profile?.avatar_url ? (
              <AvatarImage src={avatarUrl || profile?.avatar_url || undefined} />
            ) : null}
            <AvatarFallback className="text-lg bg-primary/20 text-primary">
              {isCreator ? <Crown className="w-8 h-8" /> : 
               isAdmin ? <Shield className="w-8 h-8" /> : 
               getInitials(displayName || username)}
            </AvatarFallback>
          </Avatar>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Name & Role */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold">
                    {profile?.display_name || displayName || username}
                  </h3>
                  {getRoleBadge()}
                </div>
                <p className="text-sm text-muted-foreground">@{profile?.username || username}</p>
              </div>
              
              {/* Bio */}
              {profile?.bio && (
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {profile.bio}
                </p>
              )}
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <Trophy className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                  <div className="text-lg font-bold">{stats.achievementCount}</div>
                  <div className="text-[10px] text-muted-foreground">Achievements</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <Users className="w-4 h-4 mx-auto text-blue-400 mb-1" />
                  <div className="text-lg font-bold">{stats.friendCount}</div>
                  <div className="text-[10px] text-muted-foreground">Friends</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <MessageSquare className="w-4 h-4 mx-auto text-green-400 mb-1" />
                  <div className="text-lg font-bold">{profile?.total_chat_messages || 0}</div>
                  <div className="text-[10px] text-muted-foreground">Messages</div>
                </div>
              </div>
              
              {/* Member Since */}
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Member since {profile?.created_at ? formatDate(profile.created_at) : 'Unknown'}</span>
              </div>
              
              {/* Actions */}
              {!isCurrentUser && userId && (
                <div className="flex gap-2 mt-4">
                  {!isAlreadyFriend && !friendRequestSent && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handleAddFriend}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Friend
                    </Button>
                  )}
                  {isAlreadyFriend && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Friends
                    </Button>
                  )}
                  {friendRequestSent && !isAlreadyFriend && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled
                    >
                      Request Sent
                    </Button>
                  )}
                  {onSendMessage && (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={handleSendMessage}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCard;
