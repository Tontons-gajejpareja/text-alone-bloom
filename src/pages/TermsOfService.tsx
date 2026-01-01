import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Scale, Heart, ToggleLeft, ToggleRight } from "lucide-react";
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
              ? "🎉 You're reading the human-friendly version. We've cut the legal jargon so you actually know what you're agreeing to."
              : "📜 You're reading the full legal version. This is the binding document."
            }
          </p>
        </div>

        <p className="text-slate-400 mb-8">Last updated: January 1, 2026</p>

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
          <span className="text-2xl">👋</span> What is this?
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>UrbanShade OS is a <strong>browser-based operating system simulator</strong>. It's a fun project, not a real OS.</p>
        <p>It's free to use. We're not selling anything.</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">✅</span> What you CAN do
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300">
        <ul className="list-disc list-inside space-y-2">
          <li>Use the simulator for fun, learning, or showing off</li>
          <li>Create an account to sync your settings across devices</li>
          <li>Explore all the features we've built</li>
          <li>Report bugs and suggest features</li>
          <li>Share it with friends</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🚫</span> What you CAN'T do
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300">
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Don't abuse the system</strong> - spam, attacks, exploits = ban</li>
          <li><strong>Don't harass other users</strong> - be cool to each other</li>
          <li><strong>Don't pretend to be us</strong> - no impersonation</li>
          <li><strong>Don't break things on purpose</strong> - we'll know</li>
          <li><strong>Don't use it for illegal stuff</strong> - obviously</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">⚠️</span> If you break the rules
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>We have a moderation system. If you abuse the platform:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Warning</strong> - First offense, we'll let you know</li>
          <li><strong>Temporary ban</strong> - Repeated issues, take a break</li>
          <li><strong>Permanent ban</strong> - Serious violations, goodbye forever</li>
        </ul>
        <p className="text-amber-400">The NAVI AI security system will lock you out if you keep trying to access restricted areas.</p>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">📊</span> Your data
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>Check our <Link to="/privacy" className="text-amber-400 hover:underline">Privacy Policy</Link> for the full details, but in short:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>We store your settings if you make an account</li>
          <li>We don't sell your data</li>
          <li>You can delete your account anytime</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">🔧</span> We can change things
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>We might update these terms. When we do:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>We'll update the "last updated" date</li>
          <li>Major changes = we'll try to let you know</li>
          <li>Keep using the site = you accept the new terms</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">💡</span> The "no warranty" thing
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-3">
        <p>This is a hobby project. Stuff might break. We provide it "as is":</p>
        <ul className="list-disc list-inside space-y-2">
          <li>No guarantees it'll work perfectly</li>
          <li>No promises about uptime</li>
          <li>We're not liable if something goes wrong</li>
        </ul>
        <p>But we do our best to keep things running smoothly!</p>
      </CardContent>
    </Card>

    <Card className="bg-green-500/10 border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <span className="text-2xl">🤝</span> TL;DR
        </CardTitle>
      </CardHeader>
      <CardContent className="text-green-300 text-lg">
        <p>Be cool, don't break stuff, have fun. That's pretty much it.</p>
      </CardContent>
    </Card>
  </div>
);

const LegalTerms = () => (
  <div className="space-y-8 text-slate-300">
    <section>
      <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
      <p className="mb-3">
        By accessing or using UrbanShade OS ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
        If you do not agree to these Terms, you may not access or use the Service.
      </p>
      <p>
        These Terms constitute a legally binding agreement between you and UrbanShade OS ("we," "us," or "our") 
        regarding your use of the Service.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">2. Description of Service</h2>
      <p className="mb-3">
        UrbanShade OS is a browser-based operating system simulator provided for entertainment and educational purposes. 
        The Service includes, but is not limited to:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>A simulated desktop environment</li>
        <li>Virtual applications and utilities</li>
        <li>Optional user account functionality for settings synchronization</li>
        <li>Community features including messaging and collaboration tools</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">3. User Accounts</h2>
      <p className="mb-3">
        3.1. You may create an account to access additional features of the Service. You are responsible for 
        maintaining the confidentiality of your account credentials and for all activities that occur under your account.
      </p>
      <p className="mb-3">
        3.2. You agree to provide accurate, current, and complete information during the registration process 
        and to update such information to keep it accurate, current, and complete.
      </p>
      <p>
        3.3. We reserve the right to suspend or terminate your account if any information provided proves to be 
        inaccurate, not current, or incomplete, or if you violate these Terms.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">4. Acceptable Use Policy</h2>
      <p className="mb-3">You agree not to use the Service to:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Violate any applicable local, state, national, or international law or regulation</li>
        <li>Transmit any material that is abusive, harassing, tortious, defamatory, vulgar, pornographic, obscene, or otherwise objectionable</li>
        <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity</li>
        <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
        <li>Attempt to gain unauthorized access to any portion of the Service or any other systems or networks connected to the Service</li>
        <li>Use any robot, spider, scraper, or other automated means to access the Service</li>
        <li>Introduce any viruses, trojan horses, worms, logic bombs, or other malicious or technologically harmful material</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">5. Security Systems</h2>
      <p className="mb-3">
        5.1. The Service incorporates automated security systems, including but not limited to the NAVI AI 
        security protocol, which monitors for unauthorized access attempts and policy violations.
      </p>
      <p className="mb-3">
        5.2. Repeated attempts to access restricted areas or functionality may result in temporary or permanent 
        lockout from the Service at the discretion of our security systems.
      </p>
      <p>
        5.3. Security measures are implemented to protect the integrity of the Service and its users. 
        Circumventing or attempting to circumvent these measures constitutes a violation of these Terms.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">6. Moderation and Enforcement</h2>
      <p className="mb-3">
        6.1. We reserve the right to monitor, review, and moderate user activity and content within the Service.
      </p>
      <p className="mb-3">
        6.2. Violations of these Terms may result in:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
        <li>Issuance of warnings</li>
        <li>Temporary suspension of access</li>
        <li>Permanent termination of access</li>
        <li>Reporting to appropriate authorities where legally required</li>
      </ul>
      <p>
        6.3. We may, at our sole discretion, refuse service to anyone for any reason at any time.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">7. Intellectual Property</h2>
      <p className="mb-3">
        7.1. The Service and its original content, features, and functionality are and will remain the 
        exclusive property of UrbanShade OS and its licensors.
      </p>
      <p>
        7.2. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress 
        may not be used in connection with any product or service without prior written consent.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">8. Disclaimer of Warranties</h2>
      <p className="mb-3">
        THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, 
        EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
        FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
      </p>
      <p>
        We do not warrant that (a) the Service will function uninterrupted, secure, or available at any 
        particular time or location; (b) any errors or defects will be corrected; (c) the Service is free 
        of viruses or other harmful components; or (d) the results of using the Service will meet your requirements.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">9. Limitation of Liability</h2>
      <p>
        IN NO EVENT SHALL URBANSHADE OS, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES 
        BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT 
        LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (a) YOUR 
        ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (b) ANY CONDUCT OR CONTENT OF ANY THIRD 
        PARTY ON THE SERVICE; (c) ANY CONTENT OBTAINED FROM THE SERVICE; AND (d) UNAUTHORIZED ACCESS, USE, OR 
        ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), 
        OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">10. Changes to Terms</h2>
      <p className="mb-3">
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
        If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
      </p>
      <p>
        What constitutes a material change will be determined at our sole discretion. By continuing to access 
        or use the Service after those revisions become effective, you agree to be bound by the revised terms.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">11. Governing Law</h2>
      <p>
        These Terms shall be governed and construed in accordance with applicable laws, without regard to 
        conflict of law provisions. Our failure to enforce any right or provision of these Terms will not 
        be considered a waiver of those rights.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-white mb-4">12. Contact Information</h2>
      <p>
        If you have any questions about these Terms, please contact us through the appropriate channels 
        provided within the Service or visit our documentation at <Link to="/docs" className="text-amber-400 hover:underline">/docs</Link>.
      </p>
    </section>
  </div>
);

export default TermsOfService;
