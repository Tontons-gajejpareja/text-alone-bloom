import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Heart, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  const [isSimpleMode, setIsSimpleMode] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2 text-slate-300 hover:text-white">
                  <ArrowLeft className="w-4 h-4" />
                  Back to OS
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-700" />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => setIsSimpleMode(!isSimpleMode)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all"
            >
              {isSimpleMode ? (
                <Heart className="w-4 h-4 text-pink-400" />
              ) : (
                <Shield className="w-4 h-4 text-cyan-400" />
              )}
              <span className="text-sm text-slate-300">
                {isSimpleMode ? "Human-Friendly" : "Full Legal"}
              </span>
              {isSimpleMode ? (
                <ToggleRight className="w-5 h-5 text-pink-400" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Mode Indicator */}
        <div className={`mb-8 p-4 rounded-lg border ${
          isSimpleMode 
            ? "bg-pink-500/10 border-pink-500/30" 
            : "bg-cyan-500/10 border-cyan-500/30"
        }`}>
          <p className={`text-sm ${isSimpleMode ? "text-pink-300" : "text-cyan-300"}`}>
            {isSimpleMode 
              ? "🎉 You're reading the human-friendly version. Plain English, no legal speak."
              : "📜 You're reading the full legal version. This is the binding document."
            }
          </p>
        </div>

        <p className="text-slate-400 mb-8">Last updated: January 1, 2026</p>

        {isSimpleMode ? (
          <SimplePrivacy />
        ) : (
          <LegalPrivacy />
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <span>•</span>
            <Link to="/" className="hover:text-white transition-colors">Back to UrbanShade OS</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

const SimplePrivacy = () => (
  <div className="space-y-6">
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🔍</span> What we collect
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-4">
        <div>
          <h4 className="font-semibold text-white mb-2">If you DON'T make an account:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Your settings are saved locally in your browser</li>
            <li>We collect basic analytics (page visits, not personal info)</li>
            <li>That's it. We literally don't know who you are.</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">If you DO make an account:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Email address (for login)</li>
            <li>Username you choose</li>
            <li>Your settings & preferences (to sync across devices)</li>
            <li>Any content you create within the OS</li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">💾</span> Where we store it
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p><strong>Local mode:</strong> Everything stays in your browser. Clear your cache = it's gone.</p>
        <p><strong>Cloud mode:</strong> We use Supabase (a secure database service) to store your account data.</p>
        <p>Your data is stored on servers with industry-standard security.</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🎯</span> Why we collect it
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300">
        <ul className="list-disc list-inside space-y-2">
          <li><strong>To make the OS work</strong> - saving your settings, themes, etc.</li>
          <li><strong>To sync across devices</strong> - if you have an account</li>
          <li><strong>To improve the product</strong> - analytics help us fix bugs</li>
          <li><strong>To keep it secure</strong> - moderation and abuse prevention</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🚫</span> What we DON'T do
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300">
        <ul className="list-disc list-inside space-y-2">
          <li><strong>We don't sell your data.</strong> Ever. To anyone.</li>
          <li><strong>We don't show you ads.</strong> This isn't an ad platform.</li>
          <li><strong>We don't track you across the web.</strong> We only know what happens in our app.</li>
          <li><strong>We don't share your info</strong> unless legally required (like a court order).</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🔐</span> Security stuff
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>We take security seriously:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Passwords are hashed (we can't see them)</li>
          <li>Data is encrypted in transit (HTTPS)</li>
          <li>We use Supabase's security features</li>
          <li>NAVI AI monitors for suspicious activity</li>
        </ul>
        <p className="text-amber-400">But no system is 100% secure. Use a strong password!</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🎮</span> Your rights
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300">
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Access:</strong> You can see all your data in your account settings</li>
          <li><strong>Export:</strong> You can export your data</li>
          <li><strong>Delete:</strong> You can delete your account and all associated data</li>
          <li><strong>Correct:</strong> You can update your information anytime</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🍪</span> Cookies
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>We use cookies for:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Essential stuff:</strong> Keeping you logged in</li>
          <li><strong>Preferences:</strong> Remembering your settings</li>
          <li><strong>Analytics:</strong> Basic usage stats (anonymized)</li>
        </ul>
        <p>No third-party tracking cookies. No creepy ad cookies.</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">👶</span> Kids
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300">
        <p>This service isn't designed for kids under 13. If you're under 13, please don't create an account. If we find out a user is under 13, we'll delete their account.</p>
      </CardContent>
    </Card>

    <Card className="bg-green-500/10 border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <span className="text-2xl">🤝</span> TL;DR
        </CardTitle>
      </CardHeader>
      <CardContent className="text-green-300 text-lg space-y-2">
        <p>We collect only what we need. We don't sell it. We protect it.</p>
        <p>You can delete everything whenever you want. That's the deal.</p>
      </CardContent>
    </Card>
  </div>
);

const LegalPrivacy = () => (
  <div className="space-y-8 text-slate-300">
    <section>
      <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
      <p className="mb-3">
        UrbanShade OS ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
        explains how we collect, use, disclose, and safeguard your information when you use our browser-based 
        operating system simulator ("the Service").
      </p>
      <p>
        Please read this Privacy Policy carefully. By using the Service, you consent to the data practices 
        described in this policy. If you do not agree with the terms of this Privacy Policy, please do not 
        access or use the Service.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">2. Information We Collect</h2>
      
      <h3 className="text-lg font-semibold text-white mt-4 mb-2">2.1 Information You Provide</h3>
      <p className="mb-3">When you create an account, we collect:</p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li>Email address</li>
        <li>Username</li>
        <li>Password (stored in hashed form)</li>
        <li>Profile information you choose to provide</li>
        <li>User preferences and settings</li>
        <li>Content you create within the Service</li>
      </ul>

      <h3 className="text-lg font-semibold text-white mt-4 mb-2">2.2 Automatically Collected Information</h3>
      <p className="mb-3">When you use the Service, we automatically collect:</p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li>Device information (browser type, operating system)</li>
        <li>IP address</li>
        <li>Usage data (pages visited, features used, session duration)</li>
        <li>Error logs and diagnostic information</li>
      </ul>

      <h3 className="text-lg font-semibold text-white mt-4 mb-2">2.3 Local Storage</h3>
      <p>
        For users without accounts, we store preferences and settings locally in your browser using 
        localStorage and similar technologies. This data remains on your device and is not transmitted to our servers.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">3. How We Use Your Information</h2>
      <p className="mb-3">We use the information we collect to:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Provide, operate, and maintain the Service</li>
        <li>Improve, personalize, and expand the Service</li>
        <li>Understand and analyze how you use the Service</li>
        <li>Develop new products, services, features, and functionality</li>
        <li>Communicate with you regarding your account or the Service</li>
        <li>Process transactions and manage your account</li>
        <li>Prevent fraud, detect security incidents, and protect against malicious or illegal activity</li>
        <li>Enforce our Terms of Service and other policies</li>
        <li>Comply with legal obligations</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">4. Data Storage and Security</h2>
      <p className="mb-3">
        4.1. Account data is stored using Supabase, a secure database service, with servers located in 
        compliant data centers with industry-standard security measures.
      </p>
      <p className="mb-3">
        4.2. We implement appropriate technical and organizational measures to protect your personal 
        information, including:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li>Encryption of data in transit using TLS/SSL</li>
        <li>Password hashing using industry-standard algorithms</li>
        <li>Regular security assessments and updates</li>
        <li>Access controls and authentication mechanisms</li>
        <li>Automated security monitoring (NAVI AI security system)</li>
      </ul>
      <p>
        4.3. While we strive to use commercially acceptable means to protect your personal information, 
        no method of transmission over the Internet or electronic storage is 100% secure. We cannot 
        guarantee absolute security.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">5. Data Sharing and Disclosure</h2>
      <p className="mb-3">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li><strong>Service Providers:</strong> With third-party vendors who assist in operating our Service (e.g., hosting, analytics), subject to confidentiality obligations</li>
        <li><strong>Legal Requirements:</strong> When required by law, subpoena, or other legal process</li>
        <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property, or that of our users or others</li>
        <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
        <li><strong>Consent:</strong> With your explicit consent for any other purpose</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">6. Cookies and Tracking Technologies</h2>
      <p className="mb-3">We use cookies and similar tracking technologies to:</p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li><strong>Essential Cookies:</strong> Required for the Service to function (authentication, session management)</li>
        <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
        <li><strong>Analytics Cookies:</strong> Collect anonymized usage statistics to improve the Service</li>
      </ul>
      <p>
        You can control cookie preferences through your browser settings. Disabling certain cookies may 
        affect the functionality of the Service.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">7. Your Rights and Choices</h2>
      <p className="mb-3">You have the right to:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
        <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
        <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
        <li><strong>Export:</strong> Request a portable copy of your data</li>
        <li><strong>Objection:</strong> Object to certain processing of your information</li>
        <li><strong>Withdrawal:</strong> Withdraw consent at any time where processing is based on consent</li>
      </ul>
      <p className="mt-4">
        To exercise these rights, access your account settings or contact us through the appropriate channels.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">8. Data Retention</h2>
      <p className="mb-3">
        We retain your personal information for as long as your account is active or as needed to provide 
        you with the Service. We may retain certain information as required by law or for legitimate 
        business purposes.
      </p>
      <p>
        Upon account deletion, we will delete or anonymize your personal information within 30 days, 
        except where retention is required by law.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">9. Children's Privacy</h2>
      <p>
        The Service is not intended for individuals under the age of 13. We do not knowingly collect 
        personal information from children under 13. If we become aware that we have collected personal 
        information from a child under 13, we will take steps to delete that information promptly.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">10. International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other than your country of 
        residence. These countries may have different data protection laws. By using the Service, you 
        consent to the transfer of your information to these countries.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">11. Changes to This Privacy Policy</h2>
      <p className="mb-3">
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
        the new Privacy Policy on this page and updating the "Last updated" date.
      </p>
      <p>
        You are advised to review this Privacy Policy periodically for any changes. Changes are effective 
        when posted on this page.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">12. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us through the appropriate 
        channels provided within the Service or visit our documentation at <Link to="/docs" className="text-cyan-400 hover:underline">/docs</Link>.
      </p>
    </section>
  </div>
);

export default PrivacyPolicy;
