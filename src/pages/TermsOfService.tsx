import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Scale, Heart, ToggleLeft, ToggleRight, Shield, Globe, Users, AlertTriangle, Gavel, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
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
                <Scale className="w-5 h-5 text-amber-400" />
                <h1 className="text-xl font-bold text-white">Terms of Service</h1>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => setIsSimpleMode(!isSimpleMode)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-500/50 transition-all"
            >
              {isSimpleMode ? (
                <Heart className="w-4 h-4 text-pink-400" />
              ) : (
                <Scale className="w-4 h-4 text-amber-400" />
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
            : "bg-amber-500/10 border-amber-500/30"
        }`}>
          <p className={`text-sm ${isSimpleMode ? "text-pink-300" : "text-amber-300"}`}>
            {isSimpleMode 
              ? "🎉 You're reading the human-friendly version! We've cut the legal jargon so you actually understand what's up. No tricks, just the real deal."
              : "📜 You're reading the full legal version. This is the binding document that applies under EU law."
            }
          </p>
        </div>

        <p className="text-slate-400 mb-8">Last updated: January 1, 2026 • Effective in the European Union</p>

        {isSimpleMode ? (
          <SimpleTerms />
        ) : (
          <LegalTerms />
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <span>•</span>
            <Link to="/" className="hover:text-white transition-colors">Back to UrbanShade OS</Link>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Questions? Contact us through the in-app messaging system or our GitHub repository.
          </p>
        </div>
      </main>
    </div>
  );
};

const SimpleTerms = () => (
  <div className="space-y-6">
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">👋</span> Hey there! What even is this?
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>UrbanShade OS is a <strong>browser-based operating system simulator</strong>. Think of it like a video game that looks like a computer OS. It's a fun project we built for entertainment and learning.</p>
        <p>It's <strong>completely free</strong>. We're not selling you anything. No premium tiers. No hidden fees. Promise.</p>
        <p className="text-cyan-400">We're based in the EU (Latvia), so we follow EU laws. That's actually great for you because EU has some of the strongest user protection laws in the world! 🇪🇺</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">✅</span> What you CAN do (go wild!)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300">
        <ul className="list-disc list-inside space-y-2">
          <li>Use the simulator for fun, learning, or just to show off to your friends</li>
          <li>Create an account to sync your settings across devices (totally optional)</li>
          <li>Sign in with Google for convenience (we'll still let you pick a cool username)</li>
          <li>Explore every feature we've built - there's no premium content</li>
          <li>Report bugs and suggest features - we actually read these!</li>
          <li>Share it with anyone you like</li>
          <li>Use it for educational purposes, presentations, whatever</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🚫</span> What you CAN'T do (please don't)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300">
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Don't abuse the system</strong> — spam, attacks, or exploits will get you banned. Simple as that.</li>
          <li><strong>Don't harass other users</strong> — be nice! We're all here to have fun.</li>
          <li><strong>Don't pretend to be us</strong> — impersonating UrbanShade or our team is not cool.</li>
          <li><strong>Don't break things on purpose</strong> — we put effort into this, please respect it.</li>
          <li><strong>Don't use it for illegal stuff</strong> — obviously. We'll report you if legally required.</li>
          <li><strong>Don't spam messages</strong> — we have rate limits (15 messages per 5 minutes) for a reason.</li>
          <li><strong>Don't share harmful content</strong> — keep things appropriate.</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">⚠️</span> What happens if you break the rules?
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>We've got a moderation system, and we're fair about it. Here's how it works:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>First offense:</strong> You'll get a friendly warning. Everyone makes mistakes!</li>
          <li><strong>Repeated issues:</strong> Temporary ban - take a break, cool off, come back later.</li>
          <li><strong>Serious stuff:</strong> Permanent ban. No appeals if you really messed up.</li>
          <li><strong>Illegal activity:</strong> We report to authorities as required by EU law.</li>
        </ul>
        <p className="text-amber-400 mt-4">Oh, and our NAVI AI security system watches for suspicious behavior. Try to access restricted areas repeatedly? You'll get locked out. It's actually kinda fun to trigger (but don't tell anyone we said that).</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">👤</span> Your account & Google sign-in
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>You can create an account two ways:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Email + Password:</strong> Classic way. Pick your own username.</li>
          <li><strong>Google Sign-In:</strong> Quick and easy! We'll still ask you to pick a username because we don't want your email showing up everywhere for privacy reasons.</li>
        </ul>
        <p className="text-cyan-400 mt-3">Your username is what other users see. We keep your email private. That's just smart security practice.</p>
        <p>You're responsible for keeping your account safe. Pick a good password (or use Google's security).</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">📊</span> Your data (check Privacy Policy for the full story)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>Quick version (read our <Link to="/privacy" className="text-amber-400 hover:underline">Privacy Policy</Link> for details):</p>
        <ul className="list-disc list-inside space-y-2">
          <li>We only collect what we need to make things work</li>
          <li>We <strong>never sell</strong> your data. Ever. To anyone.</li>
          <li>You can delete your account and data anytime</li>
          <li>We follow GDPR (the EU's strict data protection law)</li>
          <li>Your data is stored in secure servers</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🇪🇺</span> Your rights under EU law (GDPR)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>Because we're in the EU, you've got some really strong rights:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Right to know:</strong> We tell you exactly what we collect and why</li>
          <li><strong>Right to access:</strong> Ask us what data we have about you</li>
          <li><strong>Right to delete:</strong> Ask us to delete everything about you</li>
          <li><strong>Right to portability:</strong> Get your data in a format you can take elsewhere</li>
          <li><strong>Right to object:</strong> Say no to certain types of data processing</li>
          <li><strong>Right to rectification:</strong> Fix any incorrect info about you</li>
        </ul>
        <p className="text-cyan-400 mt-3">These rights are guaranteed by law. We take them seriously.</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🔧</span> We might change things
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>These terms might get updated sometimes. When that happens:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>We'll update the "last updated" date at the top</li>
          <li>For big changes, we'll try to give you 30 days notice</li>
          <li>If you keep using the site after changes, you're agreeing to them</li>
          <li>Major changes will be announced in-app so you don't miss them</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">💡</span> The "no warranty" thing (we're just being honest)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>This is a hobby project made with love. That means:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Stuff might break sometimes - we'll fix it when we can</li>
          <li>We can't promise 100% uptime (we're not Amazon)</li>
          <li>We're not responsible if something goes wrong on your end</li>
          <li>Don't store anything important here - it's a simulator, not cloud storage</li>
        </ul>
        <p className="text-amber-400 mt-3">But hey, we genuinely care about this project and we do our best to keep it running smoothly!</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">⚖️</span> If there's a dispute
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>Hopefully we never need this, but if there's a problem:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Let's try to work it out first - just message us!</li>
          <li>EU law applies (specifically Latvian law)</li>
          <li>You can use the EU Online Dispute Resolution platform</li>
          <li>Courts in Latvia have jurisdiction if it comes to that</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-green-500/10 border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <span className="text-2xl">🤝</span> TL;DR (The actual summary)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-green-300 text-lg space-y-3">
        <p><strong>Be cool, don't break stuff, have fun.</strong></p>
        <p>We respect your privacy, we follow EU law, and we're not here to trick you. If you have questions, just ask. We're pretty chill about it.</p>
        <p className="text-green-400/70 text-sm mt-4">That's it. That's the deal. Thanks for using UrbanShade OS! 💚</p>
      </CardContent>
    </Card>
  </div>
);

const LegalTerms = () => (
  <div className="space-y-8 text-slate-300">
    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-amber-400" />
        1. Acceptance of Terms
      </h2>
      <p className="mb-3">
        By accessing or using UrbanShade OS ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
        If you do not agree to these Terms, you may not access or use the Service.
      </p>
      <p className="mb-3">
        These Terms constitute a legally binding agreement between you and UrbanShade OS ("we," "us," or "our") 
        regarding your use of the Service. This agreement is governed by the laws of the Republic of Latvia and 
        applicable European Union regulations, including but not limited to Regulation (EU) 2016/679 (General Data 
        Protection Regulation - GDPR).
      </p>
      <p>
        You must be at least 13 years of age to use this Service. If you are between 13 and 16 years of age, 
        you may only use the Service with parental or guardian consent as required under GDPR Article 8.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-amber-400" />
        2. Description of Service
      </h2>
      <p className="mb-3">
        UrbanShade OS is a browser-based operating system simulator provided for entertainment and educational purposes. 
        The Service includes, but is not limited to:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li>A simulated desktop environment running entirely in the user's web browser</li>
        <li>Virtual applications and utilities that mimic real operating system functionality</li>
        <li>Optional user account functionality for settings synchronization across devices</li>
        <li>OAuth authentication via Google for simplified account creation</li>
        <li>Community features including secure messaging between registered users</li>
        <li>Cloud storage of user preferences and settings via Supabase infrastructure</li>
      </ul>
      <p>
        The Service is provided free of charge. We do not offer premium tiers, paid features, or in-app purchases.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-amber-400" />
        3. User Accounts and Authentication
      </h2>
      <p className="mb-3">
        3.1. <strong>Account Creation:</strong> You may create an account using email and password, or via Google OAuth 
        authentication. Regardless of authentication method, you will be required to choose a unique username that will 
        be displayed publicly within the Service. Your email address will remain private and will not be exposed to 
        other users.
      </p>
      <p className="mb-3">
        3.2. <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account 
        credentials and for all activities that occur under your account. You agree to immediately notify us of any 
        unauthorized use of your account.
      </p>
      <p className="mb-3">
        3.3. <strong>Accurate Information:</strong> You agree to provide accurate, current, and complete information 
        during the registration process and to update such information to keep it accurate, current, and complete.
      </p>
      <p className="mb-3">
        3.4. <strong>Account Termination:</strong> We reserve the right to suspend or terminate your account if any 
        information provided proves to be inaccurate, not current, or incomplete, or if you violate these Terms.
      </p>
      <p>
        3.5. <strong>Right to Delete:</strong> Under GDPR Article 17, you have the right to request deletion of your 
        account and all associated personal data at any time through the Account Management settings.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        4. Acceptable Use Policy
      </h2>
      <p className="mb-3">You agree not to use the Service to:</p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li>Violate any applicable local, state, national, or international law or regulation, including EU regulations</li>
        <li>Transmit any material that is abusive, harassing, tortious, defamatory, vulgar, pornographic, obscene, libelous, invasive of another's privacy, or otherwise objectionable</li>
        <li>Impersonate any person or entity, including UrbanShade OS staff, or falsely state or otherwise misrepresent your affiliation with a person or entity</li>
        <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
        <li>Attempt to gain unauthorized access to any portion of the Service or any other systems or networks connected to the Service</li>
        <li>Use any robot, spider, scraper, or other automated means to access the Service without our express written permission</li>
        <li>Introduce any viruses, trojan horses, worms, logic bombs, or other malicious or technologically harmful material</li>
        <li>Collect or harvest any personally identifiable information from other users</li>
        <li>Send spam, unsolicited messages, or exceed rate limits (15 messages per 5 minutes, maximum 3 pending unread messages)</li>
        <li>Engage in any activity that could damage, disable, overburden, or impair the Service</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-amber-400" />
        5. Security Systems and Automated Enforcement
      </h2>
      <p className="mb-3">
        5.1. The Service incorporates automated security systems, including but not limited to the NAVI AI 
        security protocol, which monitors for unauthorized access attempts and policy violations.
      </p>
      <p className="mb-3">
        5.2. Repeated attempts to access restricted areas or functionality may result in temporary or permanent 
        lockout from the Service at the discretion of our security systems. This automated enforcement is 
        proportionate to the detected behavior.
      </p>
      <p className="mb-3">
        5.3. Rate limiting is implemented on messaging features to prevent spam and abuse. Users who exceed 
        rate limits (15 messages per 5 minutes) will be temporarily blocked from sending additional messages 
        for a period of one hour.
      </p>
      <p>
        5.4. Security measures are implemented to protect the integrity of the Service and its users. 
        Circumventing or attempting to circumvent these measures constitutes a violation of these Terms.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Gavel className="w-5 h-5 text-amber-400" />
        6. Moderation and Enforcement
      </h2>
      <p className="mb-3">
        6.1. We reserve the right to monitor, review, and moderate user activity and content within the Service 
        in accordance with applicable EU regulations regarding content moderation.
      </p>
      <p className="mb-3">
        6.2. Violations of these Terms may result in:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
        <li>Issuance of warnings with explanation of the violation</li>
        <li>Temporary suspension of access (with duration communicated to user)</li>
        <li>Permanent termination of access for serious or repeated violations</li>
        <li>Reporting to appropriate law enforcement authorities where legally required, particularly for criminal activity</li>
      </ul>
      <p className="mb-3">
        6.3. We will provide users with clear explanations of any enforcement actions taken against their accounts, 
        as required by EU transparency regulations.
      </p>
      <p>
        6.4. We may, at our sole discretion, refuse service to anyone for any legitimate reason at any time, 
        provided such refusal does not constitute unlawful discrimination under EU law.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">7. User Rights Under GDPR</h2>
      <p className="mb-3">
        As a data controller established in the European Union (Latvia), we are committed to protecting your rights 
        under the General Data Protection Regulation (GDPR). You have the following rights:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li><strong>Right of Access (Article 15):</strong> You may request confirmation of whether we process your personal data and access to that data</li>
        <li><strong>Right to Rectification (Article 16):</strong> You may request correction of inaccurate personal data</li>
        <li><strong>Right to Erasure (Article 17):</strong> You may request deletion of your personal data under certain circumstances</li>
        <li><strong>Right to Restriction of Processing (Article 18):</strong> You may request restriction of processing under certain circumstances</li>
        <li><strong>Right to Data Portability (Article 20):</strong> You may request your data in a structured, commonly used, machine-readable format</li>
        <li><strong>Right to Object (Article 21):</strong> You may object to processing of your personal data under certain circumstances</li>
        <li><strong>Right to Withdraw Consent (Article 7):</strong> Where processing is based on consent, you may withdraw consent at any time</li>
      </ul>
      <p className="mb-3">
        To exercise these rights, please use the Account Management features within the Service or contact us 
        through the in-app messaging system.
      </p>
      <p>
        You also have the right to lodge a complaint with a supervisory authority, particularly in the EU Member State 
        of your habitual residence, place of work, or place of the alleged infringement. The supervisory authority in 
        Latvia is the Data State Inspectorate (Datu valsts inspekcija).
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">8. Legal Basis for Processing</h2>
      <p className="mb-3">
        We process personal data under the following legal bases as defined in GDPR Article 6:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li><strong>Contract (Article 6(1)(b)):</strong> Processing necessary for the performance of these Terms of Service</li>
        <li><strong>Consent (Article 6(1)(a)):</strong> Where you have given explicit consent for specific processing activities</li>
        <li><strong>Legitimate Interests (Article 6(1)(f)):</strong> For security, fraud prevention, and service improvement, balanced against your rights</li>
        <li><strong>Legal Obligation (Article 6(1)(c)):</strong> Where processing is required to comply with EU or Member State law</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">9. Intellectual Property</h2>
      <p className="mb-3">
        9.1. The Service and its original content, features, and functionality are and will remain the 
        exclusive property of UrbanShade OS and its licensors, protected by international copyright, 
        trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
      </p>
      <p className="mb-3">
        9.2. The Service is open source. The source code is available under the terms specified in our 
        GitHub repository. This does not grant you rights to our trademarks, service marks, or trade dress.
      </p>
      <p>
        9.3. User-generated content remains the property of the respective users, subject to a non-exclusive 
        license granted to us to display such content within the Service.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">10. Disclaimer of Warranties</h2>
      <p className="mb-3">
        THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, 
        EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
        FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
      </p>
      <p className="mb-3">
        We do not warrant that (a) the Service will function uninterrupted, secure, or available at any 
        particular time or location; (b) any errors or defects will be corrected; (c) the Service is free 
        of viruses or other harmful components; or (d) the results of using the Service will meet your requirements.
      </p>
      <p>
        This disclaimer does not affect your statutory rights under EU consumer protection law, which cannot 
        be limited or excluded by contract.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">11. Limitation of Liability</h2>
      <p className="mb-3">
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL URBANSHADE OS, ITS DIRECTORS, 
        EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
        CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, 
        OR OTHER INTANGIBLE LOSSES.
      </p>
      <p>
        Nothing in these Terms shall limit or exclude our liability for (a) death or personal injury caused by 
        our negligence; (b) fraud or fraudulent misrepresentation; (c) any liability that cannot be limited or 
        excluded under applicable EU law, including mandatory consumer protection provisions.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">12. Changes to Terms</h2>
      <p className="mb-3">
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
        For material changes, we will provide at least 30 days' notice prior to any new terms taking effect, 
        in accordance with EU transparency requirements.
      </p>
      <p className="mb-3">
        Notice will be provided through: (a) updating the "Last updated" date; (b) in-app notifications for 
        material changes; (c) email notification to registered users for significant changes affecting user rights.
      </p>
      <p>
        By continuing to access or use the Service after those revisions become effective, you agree to be bound 
        by the revised terms. If you do not agree to the new terms, you must stop using the Service.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">13. Governing Law and Dispute Resolution</h2>
      <p className="mb-3">
        13.1. <strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the 
        laws of the Republic of Latvia and applicable European Union law, without regard to conflict of law provisions.
      </p>
      <p className="mb-3">
        13.2. <strong>Jurisdiction:</strong> Any disputes arising from these Terms shall be subject to the exclusive 
        jurisdiction of the courts of the Republic of Latvia, without prejudice to your rights under EU law to bring 
        proceedings in the courts of your Member State of residence.
      </p>
      <p className="mb-3">
        13.3. <strong>Online Dispute Resolution:</strong> The European Commission provides an Online Dispute Resolution 
        (ODR) platform for consumers at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">https://ec.europa.eu/consumers/odr</a>. 
        We encourage attempting to resolve disputes amicably before initiating formal proceedings.
      </p>
      <p>
        13.4. <strong>Consumer Rights:</strong> These Terms do not affect your statutory rights as a consumer under EU 
        law, which may provide additional protections that cannot be waived or limited by contract.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">14. Severability</h2>
      <p>
        If any provision of these Terms is held to be invalid or unenforceable by a court of competent jurisdiction, 
        that provision shall be modified to the minimum extent necessary to make it valid and enforceable, or if 
        modification is not possible, deleted, and the remaining provisions shall continue in full force and effect.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">15. Entire Agreement</h2>
      <p>
        These Terms, together with our Privacy Policy, constitute the entire agreement between you and UrbanShade OS 
        regarding your use of the Service and supersede all prior agreements and understandings, whether written or 
        oral, regarding the subject matter hereof.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">16. Contact Information</h2>
      <p className="mb-3">
        If you have any questions about these Terms, please contact us through:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>The in-app messaging system (for registered users)</li>
        <li>Our GitHub repository at <a href="https://github.com/aswdBatch/urbanshade-7e993958" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">github.com/aswdBatch/urbanshade-7e993958</a></li>
        <li>The documentation portal at <Link to="/docs" className="text-amber-400 hover:underline">/docs</Link></li>
      </ul>
      <p className="mt-4 text-slate-400">
        For data protection inquiries specifically, please reference "GDPR Request" in your communication to ensure 
        prompt handling in accordance with regulatory timeframes (30 days).
      </p>
    </section>
  </div>
);

export default TermsOfService;