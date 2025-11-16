import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Waves, Loader2, Check } from "lucide-react";

interface UrbanshadeInstallerProps {
  onComplete: () => void;
}

export const UrbanshadeInstaller = ({ onComplete }: UrbanshadeInstallerProps) => {
  const [step, setStep] = useState<"welcome" | "options" | "installing" | "complete">("welcome");
  const [installType, setInstallType] = useState("standard");
  const [options, setOptions] = useState({
    desktopShortcuts: true,
    startMenuEntry: true,
    fileAssociations: true,
    updates: true,
  });
  const [progress, setProgress] = useState(0);

  const startInstallation = () => {
    setStep("installing");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep("complete");
          localStorage.setItem("urbanshade_install_type", installType);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const handleComplete = () => {
    toast.success("Installation complete!");
    onComplete();
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#001f3f] via-[#003d5c] to-[#001f3f] text-white overflow-hidden relative">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#0078D7] to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
        <Waves className="absolute bottom-20 left-10 w-32 h-32 animate-float" style={{ animationDelay: '0s' }} />
        <Waves className="absolute bottom-32 right-20 w-24 h-24 animate-float" style={{ animationDelay: '1s' }} />
        <Waves className="absolute bottom-10 right-1/3 w-28 h-28 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-8">
        {step === "welcome" && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-[#0078D7]/20 flex items-center justify-center border-4 border-[#0078D7] animate-scale-in">
                <Waves className="w-20 h-20 text-[#0078D7]" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              URBANSHADE OS
            </h1>
            
            <p className="text-xl opacity-90 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Deep Sea Research Division
            </p>
            
            <p className="text-sm opacity-70 max-w-md mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
              Welcome to the Urbanshade Operating System installer. This wizard will guide you through the installation process.
            </p>

            <Button 
              size="lg" 
              className="mt-8 bg-[#0078D7] hover:bg-[#0063B1] text-white px-8 animate-fade-in"
              style={{ animationDelay: '0.8s' }}
              onClick={() => setStep("options")}
            >
              Begin Installation
            </Button>
          </div>
        )}

        {step === "options" && (
          <Card className="bg-black/40 border-[#0078D7] p-8 backdrop-blur-sm animate-scale-in">
            <h2 className="text-3xl font-bold mb-6">Installation Options</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-lg font-semibold mb-3 block">Installation Type</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="installType"
                      value="minimal"
                      checked={installType === "minimal"}
                      onChange={(e) => setInstallType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-semibold">Minimal</div>
                      <div className="text-sm opacity-70">Essential components only</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="installType"
                      value="standard"
                      checked={installType === "standard"}
                      onChange={(e) => setInstallType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-semibold">Standard (Recommended)</div>
                      <div className="text-sm opacity-70">Most commonly used features</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="installType"
                      value="complete"
                      checked={installType === "complete"}
                      onChange={(e) => setInstallType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-semibold">Complete</div>
                      <div className="text-sm opacity-70">All available applications and tools</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-lg font-semibold mb-3 block">Additional Options</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer transition-all">
                    <Checkbox
                      checked={options.desktopShortcuts}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, desktopShortcuts: !!checked })
                      }
                    />
                    <span>Create desktop shortcuts</span>
                  </label>
                  
                  <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer transition-all">
                    <Checkbox
                      checked={options.startMenuEntry}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, startMenuEntry: !!checked })
                      }
                    />
                    <span>Add to start menu</span>
                  </label>
                  
                  <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer transition-all">
                    <Checkbox
                      checked={options.fileAssociations}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, fileAssociations: !!checked })
                      }
                    />
                    <span>Register file associations</span>
                  </label>
                  
                  <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer transition-all">
                    <Checkbox
                      checked={options.updates}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, updates: !!checked })
                      }
                    />
                    <span>Enable automatic updates</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button 
                variant="outline" 
                onClick={() => setStep("welcome")}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={startInstallation}
                className="flex-1 bg-[#0078D7] hover:bg-[#0063B1]"
              >
                Install
              </Button>
            </div>
          </Card>
        )}

        {step === "installing" && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="flex justify-center mb-8">
              <Loader2 className="w-24 h-24 text-[#0078D7] animate-spin" />
            </div>
            
            <h2 className="text-3xl font-bold">Installing Urbanshade OS</h2>
            
            <p className="text-lg opacity-80">Please wait while we set up your system...</p>
            
            <div className="w-full max-w-md mx-auto space-y-3">
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#0078D7] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-2xl font-bold">{progress}%</p>
            </div>

            <div className="text-sm opacity-60 space-y-1">
              {progress < 30 && <p>Extracting files...</p>}
              {progress >= 30 && progress < 60 && <p>Installing components...</p>}
              {progress >= 60 && progress < 90 && <p>Configuring system...</p>}
              {progress >= 90 && <p>Finalizing installation...</p>}
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center border-4 border-green-500 animate-scale-in">
                <Check className="w-20 h-20 text-green-500" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-4">Installation Complete!</h2>
            
            <p className="text-lg opacity-80 max-w-md mx-auto">
              Urbanshade OS has been successfully installed on your system.
            </p>

            <div className="bg-white/5 rounded-lg p-6 max-w-md mx-auto text-left">
              <h3 className="font-semibold mb-3">Installation Summary</h3>
              <div className="space-y-2 text-sm opacity-80">
                <p>• Installation type: <span className="text-[#0078D7] font-semibold">{installType}</span></p>
                {options.desktopShortcuts && <p>• Desktop shortcuts created</p>}
                {options.startMenuEntry && <p>• Added to start menu</p>}
                {options.fileAssociations && <p>• File associations registered</p>}
                {options.updates && <p>• Automatic updates enabled</p>}
              </div>
            </div>

            <Button 
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-8"
              onClick={handleComplete}
            >
              Finish
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 text-center text-xs opacity-50">
        URBANSHADE OS v2.0.0 | © 2025 Urbanshade Corporation
      </div>
    </div>
  );
};
