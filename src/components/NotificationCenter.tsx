import { useState } from "react";
import { 
  Bell, Check, Trash2, X, AlertTriangle, Info, CheckCircle, XCircle,
  Filter, Clock, ChevronDown, ChevronRight, BellOff, Moon, Settings
} from "lucide-react";
import { useNotifications, SystemNotification, NotificationType, GroupedNotifications } from "@/hooks/useNotifications";
import { useDoNotDisturb } from "@/hooks/useDoNotDisturb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationCenter = ({ open, onClose }: NotificationCenterProps) => {
  const { 
    filteredNotifications,
    groupedByTime, 
    unreadCount, 
    filters,
    setFilters,
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    dismissNotification,
    clearAll,
    executeAction
  } = useNotifications();
  
  const { 
    isDndEnabled, 
    isManualDnd, 
    isScheduledDnd, 
    toggleDnd, 
    getTimeUntilEnd 
  } = useDoNotDisturb();

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["Just now", "Earlier today"]));

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const getIcon = (type: NotificationType) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "success": return <CheckCircle className={`${iconClass} text-emerald-400`} />;
      case "warning": return <AlertTriangle className={`${iconClass} text-amber-400`} />;
      case "error": return <XCircle className={`${iconClass} text-red-400`} />;
      default: return <Info className={`${iconClass} text-blue-400`} />;
    }
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const renderNotification = (notification: SystemNotification) => (
    <div
      key={notification.id}
      onClick={() => markAsRead(notification.id)}
      className={`p-4 rounded-xl transition-all cursor-pointer group ${
        notification.read 
          ? "bg-muted/30 hover:bg-muted/50" 
          : "bg-primary/5 hover:bg-primary/10 border border-primary/20"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className={`text-sm font-semibold truncate ${!notification.read && "text-foreground"}`}>
              {notification.title}
            </h3>
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                notification.persistent ? dismissNotification(notification.id) : deleteNotification(notification.id); 
              }}
              className="p-1 hover:bg-muted rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">
                {formatTime(notification.time)}
              </span>
              {notification.app && (
                <span className="text-[10px] text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-full">
                  {notification.app}
                </span>
              )}
            </div>
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-2">
                {notification.actions.map((action, i) => (
                  <Button
                    key={i}
                    variant={action.primary ? "default" : "ghost"}
                    size="sm"
                    className="h-7 text-xs px-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      executeAction(notification.id, action.action);
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGroupedNotifications = (groups: GroupedNotifications) => {
    const nonEmptyGroups = Object.entries(groups).filter(([_, notifs]) => notifs.length > 0);
    
    if (nonEmptyGroups.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-16">
          <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
            <Bell className="w-10 h-10 opacity-30" />
          </div>
          <p className="text-sm font-medium">No notifications</p>
          <p className="text-xs text-muted-foreground/70 mt-1">You're all caught up!</p>
          {filters.unreadOnly && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setFilters({ ...filters, unreadOnly: false })}
              className="mt-3"
            >
              Show all notifications
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="p-3 space-y-3">
        {nonEmptyGroups.map(([group, notifs]) => (
          <div key={group}>
            <button
              onClick={() => toggleGroup(group)}
              className="flex items-center gap-2 w-full px-2 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/30"
            >
              {expandedGroups.has(group) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="uppercase tracking-wider">{group}</span>
              <span className="ml-auto text-[10px] bg-muted/50 px-2 py-0.5 rounded-full">
                {notifs.length}
              </span>
            </button>
            {expandedGroups.has(group) && (
              <div className="space-y-2 mt-2">
                {notifs.map(renderNotification)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!open) return null;

  return (
    <div className="fixed right-4 bottom-[60px] w-[420px] h-[560px] rounded-2xl bg-background/95 backdrop-blur-2xl border border-border/50 z-[9999] shadow-2xl overflow-hidden animate-scale-in flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 p-4 flex items-center justify-between bg-muted/20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-base">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {/* Filter Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Filter className="w-4 h-4" />
                {(filters.type || filters.app || filters.unreadOnly) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.unreadOnly}
                onCheckedChange={(checked) => setFilters({ ...filters, unreadOnly: checked })}
              >
                Unread only
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Type</DropdownMenuLabel>
              {(["info", "success", "warning", "error"] as NotificationType[]).map(type => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={filters.type === type}
                  onCheckedChange={(checked) => setFilters({ ...filters, type: checked ? type : undefined })}
                >
                  <span className="capitalize">{type}</span>
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilters({ timeRange: "all", unreadOnly: false })}>
                Clear all filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {filteredNotifications.length > 0 && (
            <>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={markAllAsRead} title="Mark all read">
                <Check className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={clearAll} title="Clear all">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* DND Banner */}
      {isDndEnabled && (
        <div className="border-b border-border/50 px-4 py-3 bg-primary/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-primary" />
            <div>
              <span className="text-sm font-medium">Do Not Disturb</span>
              {isScheduledDnd && !isManualDnd && (
                <span className="ml-2 text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">Scheduled</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{getTimeUntilEnd()}</span>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={toggleDnd}>
              {isManualDnd ? "Turn off" : "Override"}
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-1">
        {renderGroupedNotifications(groupedByTime)}
      </ScrollArea>

      {/* Footer */}
      {!isDndEnabled && (
        <div className="border-t border-border/50 p-3 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-muted-foreground h-10"
            onClick={toggleDnd}
          >
            <BellOff className="w-4 h-4" />
            Enable Do Not Disturb
          </Button>
        </div>
      )}
    </div>
  );
};