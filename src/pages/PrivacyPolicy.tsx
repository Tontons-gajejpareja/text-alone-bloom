import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Heart, ToggleLeft, ToggleRight, Database, Lock, Globe, Eye, Users, FileText, Scale } from "lucide-react";
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
              ? "🎉 You're reading the human-friendly version! No confusing legal speak - just honest info about what we do with your data."
              : "📜 You're reading the full legal version. This is GDPR-compliant and binding under EU law."
            }
          </p>
        </div>

        <p className="text-slate-400 mb-8">Last updated: January 1, 2026 • GDPR Compliant • Effective in the European Union</p>

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
          <p className="text-xs text-slate-500 mt-4">
            For GDPR-related requests, please include "GDPR Request" in your subject line. We'll respond within 30 days as required by law.
          </p>
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
          <span className="text-2xl">🔍</span> What we collect (and what we don't!)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-4">
        <div>
          <h4 className="font-semibold text-white mb-2">If you use the app WITHOUT an account:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Your settings are saved in your browser only (localStorage)</li>
            <li>We literally have zero idea who you are 🤷</li>
            <li>Clear your browser data = everything's gone</li>
            <li>That's it. We're not spying on anonymous users.</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">If you create an account:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Email address</strong> — needed for login (kept private, never shown to others)</li>
            <li><strong>Username you pick</strong> — this is what other users see</li>
            <li><strong>Password</strong> — stored as a hash (we can't see your actual password)</li>
            <li><strong>Settings & preferences</strong> — so we can sync them across your devices</li>
            <li><strong>Messages you send</strong> — duh, we need to store them to deliver them</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">If you sign in with Google:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>We get your email and basic profile info from Google</li>
            <li>We <strong>don't</strong> get your Google password (Google handles that)</li>
            <li>You still pick your own username for privacy</li>
            <li>Your Google email stays private, just like regular accounts</li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">💾</span> Where your data lives
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p><strong>Local mode (no account):</strong> Everything stays in your browser. We never see it.</p>
        <p><strong>Cloud mode (with account):</strong> We use Supabase, which stores data in secure data centers. They're based in the EU and follow GDPR rules.</p>
        <p className="text-cyan-400">Translation: Your data is stored securely and we follow strict EU privacy laws.</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🎯</span> Why we collect this stuff
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300">
        <ul className="list-disc list-inside space-y-2">
          <li><strong>To make things work</strong> — saving your themes, desktop layout, etc.</li>
          <li><strong>To sync across devices</strong> — if you want to use your settings on another computer</li>
          <li><strong>To deliver messages</strong> — kinda need to store messages to deliver them!</li>
          <li><strong>To keep things secure</strong> — detecting abuse and protecting everyone</li>
          <li><strong>To fix bugs</strong> — error logs help us improve the app</li>
        </ul>
        <p className="mt-4 text-amber-400">We DON'T collect data for ads or to sell. Ever. Pinky promise.</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🚫</span> What we absolutely DON'T do
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300">
        <ul className="list-disc list-inside space-y-2">
          <li><strong>We don't sell your data.</strong> Not to advertisers. Not to data brokers. Not to anyone.</li>
          <li><strong>We don't show ads.</strong> This isn't an ad platform.</li>
          <li><strong>We don't track you across the web.</strong> No creepy tracking cookies following you around.</li>
          <li><strong>We don't share with third parties</strong> unless the law literally makes us (like a court order).</li>
          <li><strong>We don't read your messages.</strong> They're between you and the recipient.</li>
          <li><strong>We don't use your data for AI training.</strong> Your stuff stays your stuff.</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🔐</span> How we keep things safe
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>We take security seriously:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Passwords are hashed</strong> — we literally can't see them</li>
          <li><strong>Everything uses HTTPS</strong> — encrypted in transit</li>
          <li><strong>Supabase handles the heavy lifting</strong> — they're security experts</li>
          <li><strong>Row-level security</strong> — you can only access YOUR data</li>
          <li><strong>NAVI AI</strong> — watches for suspicious activity and locks out bad actors</li>
        </ul>
        <p className="text-amber-400 mt-3">But let's be real — no system is 100% bulletproof. Use a strong, unique password!</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🇪🇺</span> Your rights under GDPR (this is the good stuff!)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>Because we're in the EU (Latvia), you've got some awesome legal rights:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Right to know:</strong> Ask us what data we have about you — we'll tell you within 30 days</li>
          <li><strong>Right to access:</strong> Get a copy of all your data in a usable format</li>
          <li><strong>Right to delete:</strong> Ask us to delete everything — we have to do it (with some exceptions)</li>
          <li><strong>Right to correct:</strong> Found something wrong? We'll fix it</li>
          <li><strong>Right to take your data elsewhere:</strong> We'll give you your data so you can take it to another service</li>
          <li><strong>Right to object:</strong> Don't want us processing something? Tell us</li>
          <li><strong>Right to complain:</strong> Not happy with how we handled things? You can report us to the authorities</li>
        </ul>
        <p className="text-cyan-400 mt-3">These aren't just nice-to-haves. They're legally guaranteed by EU law!</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🍪</span> Cookies (the boring kind)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>We use cookies for:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Keeping you logged in</strong> — so you don't have to sign in every time</li>
          <li><strong>Remembering preferences</strong> — theme, layout, that sort of thing</li>
        </ul>
        <p className="mt-3">That's it. No tracking cookies. No third-party ad cookies. No creepy stuff.</p>
        <p className="text-cyan-400">You can disable cookies in your browser, but you'll need to log in each time.</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">👶</span> Kids and privacy
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>Under GDPR, we have special rules for young users:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Under 13:</strong> You shouldn't use this service. Sorry!</li>
          <li><strong>13-16:</strong> You need a parent or guardian's permission</li>
          <li><strong>16+:</strong> You can consent for yourself</li>
        </ul>
        <p className="text-amber-400 mt-3">If we find out someone's under 13, we'll delete their account. Nothing personal — it's the law.</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">⏰</span> How long we keep your stuff
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Account data:</strong> As long as you have an account</li>
          <li><strong>Messages:</strong> Until you or the recipient deletes them</li>
          <li><strong>After you delete your account:</strong> We wipe everything within 30 days</li>
          <li><strong>Exception:</strong> We might keep some anonymized data for legal reasons</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">📍</span> Where your data goes
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>Our servers are in the EU. We try to keep everything within EU borders.</p>
        <p>Some of our tools (like Supabase) might transfer data to the US, but they use proper safeguards (like Standard Contractual Clauses) that EU law requires.</p>
        <p className="text-cyan-400">Bottom line: Your data is protected wherever it goes.</p>
      </CardContent>
    </Card>

    <Card className="bg-green-500/10 border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <span className="text-2xl">🤝</span> TL;DR (The honest summary)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-green-300 text-lg space-y-3">
        <p><strong>We collect only what we need. We don't sell it. We protect it.</strong></p>
        <p>You've got strong rights under EU law to control your data. Use them if you want!</p>
        <p>Delete your account anytime and we'll wipe your data. No tricks, no hidden retention.</p>
        <p className="text-green-400/70 text-sm mt-4">Privacy isn't just a policy for us — it's how we built the whole thing. 💚</p>
      </CardContent>
    </Card>
  </div>
);

const LegalPrivacy = () => (
  <div className="space-y-8 text-slate-300">
    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-cyan-400" />
        1. Introduction and Data Controller
      </h2>
      <p className="mb-3">
        UrbanShade OS ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
        explains how we collect, use, disclose, and safeguard your information when you use our browser-based 
        operating system simulator ("the Service").
      </p>
      <p className="mb-3">
        <strong>Data Controller:</strong> UrbanShade OS, operating from the Republic of Latvia, European Union, 
        acts as the data controller for personal data processed through the Service under Regulation (EU) 2016/679 
        (General Data Protection Regulation - GDPR).
      </p>
      <p>
        By using the Service, you consent to the data practices described in this policy. If you do not agree 
        with the terms of this Privacy Policy, please do not access or use the Service.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Database className="w-5 h-5 text-cyan-400" />
        2. Information We Collect
      </h2>
      
      <h3 className="text-lg font-semibold text-white mt-4 mb-2">2.1 Information You Provide Directly</h3>
      <p className="mb-3">When you create an account, we collect:</p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li><strong>Email address:</strong> Required for authentication and account recovery</li>
        <li><strong>Username:</strong> A unique identifier you choose, displayed to other users</li>
        <li><strong>Password:</strong> Stored exclusively in cryptographically hashed form using industry-standard algorithms</li>
        <li><strong>Display name:</strong> Optional profile name visible to other users</li>
        <li><strong>Profile information:</strong> Any additional information you voluntarily provide</li>
        <li><strong>User preferences and settings:</strong> Desktop configuration, theme choices, installed applications</li>
        <li><strong>Messages:</strong> Content of messages you send to other users within the Service</li>
      </ul>

      <h3 className="text-lg font-semibold text-white mt-4 mb-2">2.2 Information from OAuth Providers</h3>
      <p className="mb-3">When you authenticate via Google OAuth, we receive:</p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li>Email address associated with your Google account</li>
        <li>Basic profile information (name, profile picture URL)</li>
        <li>OAuth tokens for authentication purposes</li>
      </ul>
      <p className="mb-4">
        We do not receive or store your Google password. Authentication is handled entirely by Google's secure OAuth 2.0 system.
      </p>

      <h3 className="text-lg font-semibold text-white mt-4 mb-2">2.3 Automatically Collected Information</h3>
      <p className="mb-3">When you use the Service, we may automatically collect:</p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li>Device information (browser type, operating system, screen resolution)</li>
        <li>IP address (for security and rate limiting purposes)</li>
        <li>Usage data (features accessed, session duration, error logs)</li>
        <li>Timestamps of account activities</li>
      </ul>

      <h3 className="text-lg font-semibold text-white mt-4 mb-2">2.4 Local Storage</h3>
      <p>
        For users without accounts, we store preferences and settings locally in your browser using 
        localStorage and similar technologies. This data remains on your device and is never transmitted 
        to our servers. Clearing your browser data will permanently delete this information.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Scale className="w-5 h-5 text-cyan-400" />
        3. Legal Basis for Processing (GDPR Article 6)
      </h2>
      <p className="mb-3">We process your personal data under the following legal bases:</p>
      <ul className="list-disc list-inside space-y-3 ml-4">
        <li>
          <strong>Performance of Contract (Article 6(1)(b)):</strong> Processing necessary to provide the Service 
          as described in our Terms of Service, including account management, settings synchronization, and message delivery.
        </li>
        <li>
          <strong>Consent (Article 6(1)(a)):</strong> Where you have given explicit, informed, and freely-given 
          consent for specific processing activities. You may withdraw consent at any time without affecting 
          the lawfulness of processing based on consent before withdrawal.
        </li>
        <li>
          <strong>Legitimate Interests (Article 6(1)(f)):</strong> For security monitoring, fraud prevention, 
          service improvement, and bug fixing, where our interests do not override your fundamental rights 
          and freedoms. We conduct balancing tests to ensure proportionality.
        </li>
        <li>
          <strong>Legal Obligation (Article 6(1)(c)):</strong> Where processing is required to comply with 
          EU or Member State law, such as responding to lawful legal process or regulatory requirements.
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Eye className="w-5 h-5 text-cyan-400" />
        4. How We Use Your Information
      </h2>
      <p className="mb-3">We use the information we collect for the following purposes:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li><strong>Service Provision:</strong> To provide, operate, and maintain the Service</li>
        <li><strong>Personalization:</strong> To personalize your experience and sync preferences across devices</li>
        <li><strong>Communication:</strong> To facilitate messaging between users and send service-related notifications</li>
        <li><strong>Security:</strong> To detect, prevent, and address technical issues, security threats, and abuse</li>
        <li><strong>Improvement:</strong> To analyze usage patterns and improve Service functionality</li>
        <li><strong>Legal Compliance:</strong> To comply with applicable laws and legal obligations</li>
        <li><strong>Enforcement:</strong> To enforce our Terms of Service and protect our legal rights</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Lock className="w-5 h-5 text-cyan-400" />
        5. Data Storage and Security
      </h2>
      <p className="mb-3">
        5.1. Account data is stored using Supabase, a third-party infrastructure provider, with servers 
        located in data centers that comply with EU data protection standards.
      </p>
      <p className="mb-3">
        5.2. We implement appropriate technical and organizational measures to protect your personal 
        information, including:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li>Encryption of data in transit using TLS 1.3</li>
        <li>Password hashing using bcrypt with appropriate work factors</li>
        <li>Row-level security (RLS) ensuring users can only access their own data</li>
        <li>Regular security assessments and updates</li>
        <li>Access controls and authentication mechanisms for administrative functions</li>
        <li>Automated security monitoring (NAVI AI security system) for suspicious activity</li>
        <li>Rate limiting to prevent abuse (15 messages per 5 minutes, 1-hour lockout for exceeding limits)</li>
      </ul>
      <p>
        5.3. While we implement industry-standard security measures, no method of transmission over the 
        Internet or electronic storage is completely secure. We cannot guarantee absolute security, but 
        we commit to promptly addressing any security incidents in accordance with GDPR Article 33.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-cyan-400" />
        6. Data Sharing and Disclosure
      </h2>
      <p className="mb-3">
        We do not sell, trade, rent, or otherwise monetize your personal information. We may share your 
        information only in the following limited circumstances:
      </p>
      <ul className="list-disc list-inside space-y-3 ml-4">
        <li>
          <strong>Service Providers (Data Processors):</strong> With carefully selected third-party vendors 
          who assist in operating our Service (specifically Supabase for database hosting, and Google for OAuth 
          authentication). These processors act only on our instructions and are bound by contractual obligations 
          including Data Processing Agreements compliant with GDPR Article 28.
        </li>
        <li>
          <strong>Legal Requirements:</strong> When required by law, subpoena, court order, or other legal 
          process applicable under EU or Member State law. We will notify you of such requests where legally 
          permitted and practically possible.
        </li>
        <li>
          <strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property, or 
          that of our users or the public, as required or permitted by law.
        </li>
        <li>
          <strong>Business Transfers:</strong> In connection with a merger, acquisition, reorganization, 
          or sale of assets, your information may be transferred. We will provide notice and choices consistent 
          with GDPR requirements.
        </li>
        <li>
          <strong>With Your Consent:</strong> With your explicit, informed consent for any other purpose 
          disclosed at the time of collection.
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-cyan-400" />
        7. International Data Transfers
      </h2>
      <p className="mb-3">
        Our primary data processing occurs within the European Union. However, some of our service providers 
        may process data in countries outside the EU/EEA.
      </p>
      <p className="mb-3">
        For any transfers of personal data to countries without an EU adequacy decision, we ensure appropriate 
        safeguards are in place, including:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
        <li>Additional technical and organizational measures where necessary based on transfer impact assessments</li>
        <li>Binding Corporate Rules where applicable</li>
      </ul>
      <p className="mt-3">
        You have the right to request a copy of the safeguards we have put in place for international transfers.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">8. Cookies and Tracking Technologies</h2>
      <p className="mb-3">We use cookies and similar technologies for the following purposes:</p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li>
          <strong>Strictly Necessary Cookies:</strong> Required for the Service to function, including 
          authentication tokens and session management. These cannot be disabled.
        </li>
        <li>
          <strong>Preference Cookies:</strong> Remember your settings and preferences for a better experience. 
          These are stored locally and not transmitted to our servers.
        </li>
      </ul>
      <p className="mb-3">
        We do not use third-party tracking cookies, advertising cookies, or analytics cookies that track 
        you across websites. We do not participate in cross-site tracking.
      </p>
      <p>
        You can control cookie preferences through your browser settings. Disabling strictly necessary 
        cookies may prevent the Service from functioning correctly, particularly features requiring authentication.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">9. Your Rights Under GDPR</h2>
      <p className="mb-3">
        As a data subject under the General Data Protection Regulation, you have the following rights:
      </p>
      <ul className="list-disc list-inside space-y-3 ml-4">
        <li>
          <strong>Right of Access (Article 15):</strong> You may request confirmation of whether we process 
          your personal data and, if so, access to that data along with information about how it is processed.
        </li>
        <li>
          <strong>Right to Rectification (Article 16):</strong> You may request correction of inaccurate 
          personal data or completion of incomplete data.
        </li>
        <li>
          <strong>Right to Erasure (Article 17):</strong> You may request deletion of your personal data 
          under certain circumstances, including when the data is no longer necessary for the purposes for 
          which it was collected.
        </li>
        <li>
          <strong>Right to Restriction of Processing (Article 18):</strong> You may request restriction 
          of processing under certain circumstances, such as when you contest the accuracy of the data.
        </li>
        <li>
          <strong>Right to Data Portability (Article 20):</strong> You may request your data in a structured, 
          commonly used, machine-readable format and have the right to transmit that data to another controller.
        </li>
        <li>
          <strong>Right to Object (Article 21):</strong> You may object to processing of your personal data 
          based on legitimate interests. We will cease processing unless we demonstrate compelling legitimate 
          grounds that override your interests, rights, and freedoms.
        </li>
        <li>
          <strong>Right to Withdraw Consent (Article 7(3)):</strong> Where processing is based on consent, 
          you may withdraw consent at any time. Withdrawal does not affect the lawfulness of processing 
          based on consent before its withdrawal.
        </li>
        <li>
          <strong>Right to Lodge a Complaint:</strong> You have the right to lodge a complaint with a 
          supervisory authority. The supervisory authority in Latvia is the Data State Inspectorate 
          (Datu valsts inspekcija - <a href="https://www.dvi.gov.lv" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">www.dvi.gov.lv</a>).
        </li>
      </ul>
      <p className="mt-4">
        To exercise these rights, please use the Account Management features within the Service or contact 
        us through the in-app messaging system. Include "GDPR Request" in your communication for prioritized 
        handling. We will respond within 30 days as required by law, or inform you if an extension is necessary.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">10. Data Retention</h2>
      <p className="mb-3">
        We retain your personal information in accordance with the following principles:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li>
          <strong>Account Data:</strong> Retained for as long as your account is active or as needed to 
          provide you with the Service.
        </li>
        <li>
          <strong>Messages:</strong> Retained until deleted by you or the recipient, or upon account deletion.
        </li>
        <li>
          <strong>Usage Data:</strong> Retained for up to 12 months for security and improvement purposes, 
          then anonymized or deleted.
        </li>
        <li>
          <strong>Post-Account Deletion:</strong> Upon account deletion, we will delete or anonymize your 
          personal information within 30 days, except where retention is required by law or for legitimate 
          business purposes (such as maintaining security logs for fraud prevention).
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">11. Children's Privacy</h2>
      <p className="mb-3">
        In compliance with GDPR Article 8 and related regulations:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li>The Service is not intended for individuals under the age of 13. We do not knowingly collect 
        personal information from children under 13.</li>
        <li>For users between 13 and 16 years of age, parental or guardian consent is required for the 
        processing of personal data. By creating an account, such users represent that they have obtained 
        necessary parental consent.</li>
        <li>If we become aware that we have collected personal information from a child under 13 without 
        parental consent, we will take steps to delete that information promptly.</li>
      </ul>
      <p>
        If you believe we have inadvertently collected information from a child under 13, please contact us 
        immediately so we can take appropriate action.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">12. Automated Decision-Making</h2>
      <p className="mb-3">
        The Service employs automated systems for the following purposes:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li>
          <strong>Security Monitoring (NAVI AI):</strong> Automated detection of unauthorized access attempts 
          and policy violations, which may result in temporary lockout. This processing is based on our 
          legitimate interest in protecting the Service and its users.
        </li>
        <li>
          <strong>Rate Limiting:</strong> Automated enforcement of messaging limits to prevent spam. 
          This is necessary for the performance of our contract with you.
        </li>
      </ul>
      <p>
        These automated decisions do not produce legal effects or similarly significantly affect you. 
        If you believe an automated decision was made in error, you may contact us for human review.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">13. Changes to This Privacy Policy</h2>
      <p className="mb-3">
        We may update this Privacy Policy from time to time to reflect changes in our practices, technology, 
        legal requirements, or other factors.
      </p>
      <p className="mb-3">
        For material changes, we will provide at least 30 days' notice through:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li>Updating the "Last updated" date at the top of this policy</li>
        <li>In-app notifications for registered users</li>
        <li>Email notification for significant changes affecting user rights</li>
      </ul>
      <p>
        Continued use of the Service after the effective date of revised policy constitutes acceptance 
        of the changes. If you do not agree with the revised policy, you must discontinue use of the Service.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">14. Contact Information</h2>
      <p className="mb-3">
        If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us through:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>The in-app messaging system (for registered users)</li>
        <li>Our GitHub repository at <a href="https://github.com/aswdBatch/urbanshade-7e993958" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">github.com/aswdBatch/urbanshade-7e993958</a></li>
        <li>The documentation portal at <Link to="/docs" className="text-cyan-400 hover:underline">/docs</Link></li>
      </ul>
      <p className="mt-4 text-slate-400">
        For data protection inquiries specifically, please reference "GDPR Request" in your communication 
        to ensure prompt handling within the 30-day regulatory timeframe.
      </p>
      <p className="mt-3 text-slate-400">
        <strong>Supervisory Authority:</strong> You have the right to lodge a complaint with the Data State 
        Inspectorate of Latvia (Datu valsts inspekcija) or the supervisory authority in your EU Member State 
        of residence.
      </p>
    </section>
  </div>
);

export default PrivacyPolicy;