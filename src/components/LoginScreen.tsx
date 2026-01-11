import { useState, useEffect } from "react";
import { Lock, User, Shield, ChevronRight, Loader2, ArrowLeft } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

interface UserAccount {
  id: string;
  username: string;
  displayName: string;
  role: string;
  clearance: number;
  hasPassword: boolean;
  isAdmin: boolean;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());

  // Load accounts from localStorage
  useEffect(() => {
    const loadedAccounts: UserAccount[] = [];
    
    // Load admin account
    const adminData = localStorage.getItem("urbanshade_admin");
    if (adminData) {
      const admin = JSON.parse(adminData);
      loadedAccounts.push({
        id: "admin",
        username: admin.username,
        displayName: admin.displayName || admin.username,
        role: "System Administrator",
        clearance: 5,
        hasPassword: !!admin.password,
        isAdmin: true,
      });
    }
    
    // Load additional accounts
    const additionalAccounts = localStorage.getItem("urbanshade_accounts");
    if (additionalAccounts) {
      const parsed = JSON.parse(additionalAccounts);
      parsed.forEach((acc: any, index: number) => {
        loadedAccounts.push({
          id: acc.id || `user-${index}`,
          username: acc.username,
          displayName: acc.displayName || acc.username,
          role: acc.role || "Operator",
          clearance: acc.clearance || 3,
          hasPassword: !!acc.password,
          isAdmin: false,
        });
      });
    }
    
    setAccounts(loadedAccounts);
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectAccount = (account: UserAccount) => {
    setSelectedAccount(account);
    setPassword("");
    setError("");
  };

  const handleBack = () => {
    setSelectedAccount(null);
    setPassword("");
    setError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!selectedAccount) return;

    if (selectedAccount.hasPassword && !password) {
      setError("Password required");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (selectedAccount.isAdmin) {
        const adminData = localStorage.getItem("urbanshade_admin");
        if (adminData) {
          const admin = JSON.parse(adminData);
          if (!selectedAccount.hasPassword || password === admin.password) {
            onLogin();
            return;
          }
        }
      } else {
        const additionalAccounts = localStorage.getItem("urbanshade_accounts");
        if (additionalAccounts) {
          const parsed = JSON.parse(additionalAccounts);
          const account = parsed.find((a: any) => 
            a.username === selectedAccount.username || a.id === selectedAccount.id
          );
          if (account && (!selectedAccount.hasPassword || password === account.password)) {
            onLogin();
            return;
          }
        }
      }

      setError("Incorrect password");
      setLoading(false);
    }, 800);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="h-screen w-full flex flex-col bg-slate-900 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Main content - centered */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        {!selectedAccount ? (
          // User selection panel
          <div className="w-full max-w-lg mx-4">
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-800/50 backdrop-blur-sm p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400 font-mono tracking-wider text-sm">SELECT USER</span>
              </div>
              
              {/* User tiles */}
              <div className="space-y-3">
                {accounts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No accounts configured</p>
                  </div>
                ) : (
                  accounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => handleSelectAccount(account)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700 hover:border-cyan-500/30 transition-colors text-left group"
                    >
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                        {account.isAdmin ? (
                          <Shield className="w-7 h-7 text-cyan-400" />
                        ) : (
                          <User className="w-7 h-7 text-cyan-400" />
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-lg font-semibold text-foreground">
                          {account.displayName}
                          {account.isAdmin && <span className="text-muted-foreground ml-1">(Admin)</span>}
                        </div>
                        <div className="text-sm text-muted-foreground">{account.role}</div>
                        <div className="text-sm text-cyan-400 font-mono">Clearance Level {account.clearance}</div>
                      </div>
                      
                      {/* Chevron */}
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-cyan-400 flex-shrink-0" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          // Password entry panel
          <div className="w-full max-w-md mx-4">
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-800/50 backdrop-blur-sm p-6">
              {/* Back button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan-400 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to users
              </button>
              
              {/* Selected user info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-600/50">
                <div className="w-16 h-16 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center">
                  {selectedAccount.isAdmin ? (
                    <Shield className="w-8 h-8 text-cyan-400" />
                  ) : (
                    <User className="w-8 h-8 text-cyan-400" />
                  )}
                </div>
                <div>
                  <div className="text-xl font-semibold text-foreground">{selectedAccount.displayName}</div>
                  <div className="text-sm text-muted-foreground">{selectedAccount.role}</div>
                  <div className="text-sm text-cyan-400 font-mono">Clearance Level {selectedAccount.clearance}</div>
                </div>
              </div>
              
              {/* Password form or direct login */}
              {selectedAccount.hasPassword ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        autoFocus
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 text-foreground placeholder:text-muted-foreground/50 focus:border-cyan-500/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-red-400 text-center py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    No password required for this account
                  </p>
                  
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Time display - bottom right */}
      <div className="absolute bottom-8 right-8 text-right z-10">
        <div className="text-5xl font-light text-foreground/80 tracking-tight">
          {formatTime(time)}
        </div>
        <div className="text-lg text-muted-foreground mt-1">
          {formatDate(time)}
        </div>
      </div>

      {/* System info - bottom left */}
      <div className="absolute bottom-8 left-8 text-left z-10">
        <div className="text-sm font-medium text-foreground/80">UrbanShade OS</div>
        <div className="text-xs text-muted-foreground">v3.1 Deep Ocean</div>
      </div>
    </div>
  );
};
