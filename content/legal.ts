import { legal, site } from "@/lib/site";

/* The two legal documents, as data rather than markup, so an apostrophe is an
   apostrophe and a lawyer can read the file top to bottom without JSX in the
   way. Drafted against the terms of comparable services (Notion, Cursor) and
   in the operator's favour where a choice existed: as-is disclaimer, liability
   cap, indemnity, individual arbitration. Two paragraphs are set in capitals
   because the law of several jurisdictions asks that those two be conspicuous.

   None of this is legal advice, and it says so nowhere in the documents
   because a policy that hedges about itself protects no one. Have a lawyer
   read both before they carry real users. */

export type LegalItem = { lead?: string; text: string };
export type LegalBlock = { lead?: string; p: string } | { list: LegalItem[] };
export type LegalSection = { title: string; blocks: LegalBlock[] };
export type LegalDoc = {
  slug: string;
  stamp: string;
  title: string;
  description: string;
  lede: string;
  effective: string;
  sections: LegalSection[];
};

export const terms: LegalDoc = {
  slug: "terms",
  stamp: "Legal — Terms",
  title: "Terms of service",
  description: `The agreement that governs use of ${site.name} — the app and this site.`,
  lede: "The agreement between you and Nootles. The short of it: your documents are yours, the AI's suggestions are yours to check before you rely on them, and the service is provided as is.",
  effective: legal.effective,
  sections: [
    {
      title: "Agreement to these terms",
      blocks: [
        {
          p: `These Terms of Service (the “Terms”) are a binding agreement between you and ${legal.entity} (“Nootles”, “we”, “us”). They govern your use of the Nootles websites, including www.nootles.com, and the Nootles application at app.nootles.com (together, the “Service”). By creating an account or using the Service, you agree to these Terms and acknowledge our Privacy Policy. If you do not agree, do not use the Service.`,
        },
        {
          p: "If you use the Service on behalf of a company or other organisation, you represent that you have authority to bind it, and “you” means that organisation as well as the person accepting.",
        },
      ],
    },
    {
      title: "The service",
      blocks: [
        {
          p: "Nootles is a planning surface: prose, diagrams, code, maths and tables in one document, with an AI that reads and edits that document subject to your approval. The Service is in beta — it is being built in the open, which means it will change quickly and will occasionally break. We may add, alter or remove features, or suspend or discontinue all or part of the Service, at any time. Where reasonably possible we will give notice of changes that materially reduce what a paid plan provides, and if we discontinue a paid feature you have paid for in advance, we will refund the unused portion.",
        },
      ],
    },
    {
      title: "Eligibility and accounts",
      blocks: [
        {
          p: "You must be at least 13 years old to use the Service, and old enough to lawfully agree to these Terms where you live; if you are under 18, you may use the Service only with the consent of a parent or guardian. Information you give us when registering must be accurate and kept current.",
        },
        {
          p: "Your account is yours: keep your credentials to yourself, and everything done through your account is your responsibility until you tell us it has been compromised. Tell us promptly at that address below if you suspect unauthorised use. We may refuse, suspend or reclaim accounts where we reasonably need to — for example, an account name that impersonates someone else.",
        },
      ],
    },
    {
      title: "Your documents",
      blocks: [
        {
          p: "Everything you write, draw, upload or otherwise put into the Service (your “Content”) is yours. We claim no ownership of it.",
        },
        {
          p: "So that the Service can work, you grant us a worldwide, non-exclusive, royalty-free licence to host, store, reproduce, transmit, display and adapt your Content — as needed to operate, provide, secure and improve the Service, and as you direct. While the Service is in beta, improving it includes using your Content and your interactions with the AI to train and fine-tune the models that power the Service; the Privacy Policy describes this in plain terms. This licence ends when you delete the Content or your account, except for copies held briefly in routine backups, copies we are required by law to keep, and improvements already trained into the models, which cannot be untrained.",
        },
        {
          p: "You are responsible for your Content: for having the rights to it, and for what it contains. We do not monitor Content, but we may remove or refuse Content that violates these Terms or the law, and we may access Content where necessary to provide the Service, to respond to your support request, to comply with law, or to protect the Service and its users.",
        },
        {
          p: "If you create a share link to a page, anyone who holds the link can read that page and the files on it, without an account. Sharing is yours to decide, and so is who you give the link to.",
        },
      ],
    },
    {
      title: "AI assistance",
      blocks: [
        {
          p: "The AI in Nootles proposes edits and holds them for your approval; nothing lands on the page without your yes. That design carries a legal meaning too: what you accept becomes your Content, and accepting it is your judgement, not ours.",
        },
        {
          p: "To the extent we hold any interest in output the AI generates for you, we assign it to you. Two honest caveats come with that. First, machine output may not be unique — a similar document and a similar instruction may produce similar output for someone else, and we cannot promise otherwise. Second, machine output can be wrong, incomplete or out of date while looking finished and confident. You must review output before relying on it. The Service is a place to think; it is not legal, medical, financial, engineering or other professional advice, and you should not treat its output as any of those.",
        },
        {
          p: "AI features are powered in part by third-party model providers, described in the Privacy Policy. While the Service is in beta, your use of the AI — the instruction you give, the document context sent with it, and what you accept or reject — is used to train and fine-tune the models that power the Service. We may set and change reasonable limits on AI usage — volume, rate, model availability — at any time.",
        },
      ],
    },
    {
      title: "Acceptable use",
      blocks: [
        { p: "Using the Service, you will not:" },
        {
          list: [
            { text: "break the law, or infringe anyone's intellectual property, privacy or other rights;" },
            { text: "upload malicious code, or use the Service to distribute it;" },
            { text: "probe, scan, overload, disrupt or interfere with the Service, or attempt to access it, other accounts, or our systems by any means other than the interfaces we provide;" },
            { text: "circumvent usage limits, access controls or billing;" },
            { text: "scrape the Service, or resell, sublicense or rent it, without our written agreement;" },
            { text: "use the Service or its output to build or train a competing product or a competing AI model;" },
            { text: "misrepresent the origin of anything you export from the Service, or use it to deceive or defraud." },
          ],
        },
        {
          p: "We may investigate suspected violations and may suspend or terminate accounts involved in them.",
        },
      ],
    },
    {
      title: "Plans and payment",
      blocks: [
        {
          p: "Parts of the Service may be free and parts may be paid, and where the line sits can change. If you buy a paid plan: fees are as stated when you buy, are billed in advance, and — except where these Terms or the law require otherwise — are non-refundable. Subscriptions renew automatically until you cancel, and cancellation takes effect at the end of the current billing period. We may change prices with reasonable advance notice, effective from your next billing period; if you do not agree to a new price, cancel before it takes effect.",
        },
        {
          p: "Payments are handled by a third-party payment processor; we do not store full card numbers. You are responsible for applicable taxes other than taxes on our income. We may suspend paid features for accounts with overdue fees after reasonable notice.",
        },
      ],
    },
    {
      title: "Our property",
      blocks: [
        {
          p: "The Service itself — the software, the design, the document model, the Nootles name and mark — belongs to us and our licensors, and is protected by intellectual-property law. We grant you a limited, non-exclusive, non-transferable, revocable licence to use the Service as these Terms allow, and no other rights. Nothing in these Terms transfers any of our intellectual property to you.",
        },
        {
          p: "If you send us feedback — ideas, suggestions, bug reports — you grant us the right to use it without restriction or obligation to you. Feedback is welcome precisely because we can act on it.",
        },
      ],
    },
    {
      title: "Third-party services",
      blocks: [
        {
          p: "The Service depends on and may link to services we do not control — hosting, model providers, payment processors, anything you choose to connect. We are not responsible for third-party services, and your use of them is governed by their own terms. That a link or integration exists is not an endorsement.",
        },
      ],
    },
    {
      title: "Termination",
      blocks: [
        {
          p: "You may stop using the Service and delete your account at any time. We may suspend or terminate your access immediately if you materially breach these Terms, if your use creates risk or possible legal exposure for us or for other users, or if required by law; we may otherwise terminate with thirty days' notice, refunding any prepaid fees for the period after termination.",
        },
        {
          p: "Export what you need before your account closes: after termination we may delete your Content following a reasonable period, and we are not obliged to keep it. Sections of these Terms that by their nature should survive termination — including ownership, disclaimers, limitation of liability, indemnification and dispute resolution — survive it.",
        },
      ],
    },
    {
      title: "Disclaimers",
      blocks: [
        {
          p: "THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE”, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED — INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT, AND ANY WARRANTY THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE OR SECURE, OR THAT OUTPUT GENERATED BY AI FEATURES WILL BE ACCURATE, COMPLETE OR RELIABLE. YOU USE THE SERVICE AT YOUR OWN RISK. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES, SO PARTS OF THIS SECTION MAY NOT APPLY TO YOU; IT APPLIES TO THE FULLEST EXTENT THE LAW PERMITS.",
        },
      ],
    },
    {
      title: "Limitation of liability",
      blocks: [
        {
          p: "TO THE FULLEST EXTENT PERMITTED BY LAW: (A) NOOTLES WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUES, DATA, GOODWILL OR BUSINESS OPPORTUNITY, HOWEVER CAUSED AND UNDER ANY THEORY OF LIABILITY, EVEN IF ADVISED OF THE POSSIBILITY; AND (B) OUR TOTAL LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICE IS LIMITED TO THE GREATER OF ONE HUNDRED CANADIAN DOLLARS (CAD $100) OR THE AMOUNTS YOU PAID US FOR THE SERVICE IN THE TWELVE MONTHS BEFORE THE CLAIM AROSE. THESE LIMITS ARE A FUNDAMENTAL BASIS OF THE BARGAIN BETWEEN US AND APPLY EVEN IF A REMEDY FAILS OF ITS ESSENTIAL PURPOSE. THEY DO NOT LIMIT LIABILITY THAT CANNOT LAWFULLY BE LIMITED.",
        },
      ],
    },
    {
      title: "Indemnification",
      blocks: [
        {
          p: "You will defend and indemnify Nootles, and hold us harmless, against claims, damages and reasonable costs (including legal fees) arising from your Content, from your use of the Service in violation of these Terms or the law, or from your violation of anyone else's rights. We may take over the defence of any matter subject to indemnification, in which case you will cooperate with us.",
        },
      ],
    },
    {
      title: "Governing law and disputes",
      blocks: [
        {
          p: `These Terms are governed by the laws of ${legal.governingLaw}, excluding its conflict-of-laws rules. If you live somewhere whose law gives you mandatory consumer protections, those protections remain yours.`,
        },
        {
          lead: "Talk first.",
          p: `Before either of us starts formal proceedings, we agree to try to resolve the dispute informally: send a written description of the dispute to ${legal.contact}, and we will do the same to your account email, and both of us will try in good faith to settle it within sixty days. Most disagreements should end here.`,
        },
        {
          lead: "Arbitration.",
          p: `If informal resolution fails, any dispute arising out of these Terms or the Service will be resolved by binding arbitration seated in ${legal.venue}, administered by the Vancouver International Arbitration Centre under its rules, rather than in court — except that either of us may bring an individual claim in a small-claims court or tribunal that has jurisdiction (in British Columbia, the Civil Resolution Tribunal or the Provincial Court), and either of us may go to court for injunctive relief against infringement or misuse of intellectual property. The arbitration will be conducted in English, and judgment on the award may be entered in any court with jurisdiction.`,
        },
        {
          lead: "No class actions.",
          p: "TO THE EXTENT THE LAW PERMITS, DISPUTES WILL BE RESOLVED ONLY ON AN INDIVIDUAL BASIS: NEITHER OF US MAY BRING A CLAIM AS A PLAINTIFF OR CLASS MEMBER IN A CLASS, CONSOLIDATED OR REPRESENTATIVE PROCEEDING, AND EACH OF US WAIVES ANY RIGHT TO A TRIAL BY JURY WHERE ONE WOULD OTHERWISE EXIST. This paragraph does not waive rights that cannot lawfully be waived. If it is found unenforceable as to a dispute, the arbitration provision does not apply to that dispute — but the rest of this section, and of these Terms, stands.",
        },
        {
          lead: "Opting out.",
          p: `You may opt out of arbitration entirely by emailing ${legal.contact} within thirty days of first accepting these Terms, stating your name, your account email, and that you opt out of arbitration. If you opt out, or where arbitration does not apply, disputes will be resolved in the courts of British Columbia sitting in ${legal.venue}, and both of us consent to their jurisdiction.`,
        },
      ],
    },
    {
      title: "Changes to these terms",
      blocks: [
        {
          p: "We may revise these Terms. For material changes we will give reasonable advance notice — by email, or in the Service itself — before the revised Terms take effect. Using the Service after that date means you accept the revision; if you do not, stop using the Service before the change takes effect and, if you have prepaid, we will refund the unused portion. The effective date at the top of this page is always the date of the version you are reading.",
        },
      ],
    },
    {
      title: "Everything else",
      blocks: [
        {
          p: "These Terms and the Privacy Policy are the entire agreement between us about the Service, and supersede any earlier ones. If part of these Terms is found unenforceable, the rest stands, and the unenforceable part is replaced by an enforceable one that comes closest to its intent. Our not enforcing a provision is not a waiver of it. You may not assign these Terms without our consent; we may assign them in connection with a merger, acquisition or sale of assets, and to an affiliate. There are no third-party beneficiaries. Neither of us is liable for delay or failure caused by events beyond reasonable control. You will comply with applicable export and sanctions law in using the Service.",
        },
      ],
    },
    {
      title: "Contact",
      blocks: [
        {
          p: `Questions about these Terms go to ${legal.contact}. Notices to you go to your account email, which you are responsible for keeping current.`,
        },
      ],
    },
  ],
};

export const privacy: LegalDoc = {
  slug: "privacy",
  stamp: "Legal — Privacy",
  title: "Privacy policy",
  description: `What ${site.name} collects, why, and what happens to it.`,
  lede: "What Nootles collects, why, and what happens to it. The short of it: this website collects nothing. The app is in beta, and beta means candour — sessions are recorded, AI interactions are kept and used to train the models, and this policy says exactly what goes where. Nothing is sold, and nothing is shown to advertisers.",
  effective: legal.effective,
  sections: [
    {
      title: "Who we are and what this covers",
      blocks: [
        {
          p: `${legal.entity} (“Nootles”, “we”, “us”) operates www.nootles.com (the “Site”) and the application at app.nootles.com (the “App”). This policy covers both, and it is written to be read: if anything in it is unclear, ask us at ${legal.privacyContact}.`,
        },
      ],
    },
    {
      title: "This website",
      blocks: [
        {
          p: "The Site — the pages you are reading now — is static. It sets no cookies, runs no analytics, shows no advertising, and serves its fonts from our own servers, so reading it tells no third party you were here. When your browser requests a page, our hosting provider keeps standard server logs (your IP address, browser type and the page requested) to deliver the pages and defend against abuse; these are kept briefly and we add nothing to them.",
        },
      ],
    },
    {
      title: "What the app collects",
      blocks: [
        {
          p: "The App is in beta, and a beta collects more than a finished product will — both to run, and to learn what to fix. In full:",
        },
        {
          list: [
            {
              lead: "Account information.",
              text: "You sign in with a Google account, handled by Clerk, our sign-in provider. We receive your name, email address and profile photo — never a password, because there isn't one. Onboarding asks what you do and what you'll use Nootles for, and the answers are kept with your profile.",
            },
            {
              lead: "Your documents.",
              text: "The content you create — prose, diagrams, code, tables, files you upload — together with its full edit history and your conversations with the AI, stored so you can come back to them.",
            },
            {
              lead: "Session recordings and usage data.",
              text: "During the beta we record how the App is used: the actions you take, and session replays that reconstruct your screen inside the App — including document text as you type it. Recording is on for every session. Analytics run on PostHog; errors are reported to Sentry along with your account identity and recent console output, so what broke arrives with enough context to fix.",
            },
            {
              lead: "AI interaction records.",
              text: "The instruction you give the AI, the document context sent with it, and what it proposed and you accepted or rejected — kept to evaluate the AI and to train and fine-tune the models that power the Service.",
            },
            {
              lead: "Feedback.",
              text: "Feedback sent from inside the App carries more than the message: a screenshot of your current screen, recent console output, a summary of recent activity, a link to the session replay, and your email address — so a report arrives with enough context to act on.",
            },
            {
              lead: "Connected services.",
              text: "If you connect a GitHub repository, we store your access token, encrypted, and summaries of the repository's content, which the AI may read.",
            },
            {
              lead: "Payment details.",
              text: "If we ever charge and you buy a paid plan, payment will be handled by a third-party payment processor; we will never store full card numbers.",
            },
          ],
        },
      ],
    },
    {
      title: "How we use it",
      blocks: [
        {
          p: "We use this information to provide and operate the Service; to store and sync your documents; to power the AI; to train and fine-tune the models that power the Service, for as long as the beta lasts; to watch how the App is used so we can fix and improve it; to secure it and prevent abuse; to answer you; and to comply with law. We do not use your information for advertising, and we do not sell it — and never have.",
        },
      ],
    },
    {
      title: "AI assistance",
      blocks: [
        {
          p: "When the AI reads or edits your document, the relevant content and your instruction are sent to third-party model providers to generate the response: inline completions go to Mistral, and chat, reformatting and diagram work goes through OpenRouter to models from providers such as Google, OpenAI and Anthropic. When the AI searches the web on your behalf, the search queries leave too. These providers process the content to provide the service and handle it under their own terms.",
        },
        {
          p: "And plainly, because it is the price of the beta: we keep records of your AI interactions — instruction, document context, what was proposed, what you accepted — and use them to train and fine-tune the models that power Nootles. If something must stay out of a model's training data, the beta is not yet the place to write it.",
        },
      ],
    },
    {
      title: "Sharing and links",
      blocks: [
        {
          p: "Pages can be shared by link, and a share link works without an account: anyone who has it can read the page, and the files on it, whose addresses are themselves durable links. Visitors to a shared page appear to its collaborators with a display name. Treat a share link like the key it is, because that is what it is.",
        },
      ],
    },
    {
      title: "When we share",
      blocks: [
        { p: "We share personal information only:" },
        {
          list: [
            {
              lead: "With service providers",
              text: "— Vercel (hosting), Convex (database and file storage), Clerk (sign-in), PostHog (analytics and session replay), Sentry (error reporting), the AI model providers named above, and the content-delivery networks that serve parts of the App — who may use the information only to provide their service to us;",
            },
            {
              lead: "To comply with law,",
              text: "when a legal process genuinely requires it, in which case we will tell you unless we are prohibited from doing so;",
            },
            {
              lead: "To protect rights and safety,",
              text: "ours, yours or others', including to investigate fraud or abuse;",
            },
            {
              lead: "In a business transfer,",
              text: "if Nootles is acquired or merges, in which case this policy continues to apply to your information until you are told otherwise;",
            },
            {
              lead: "At your direction,",
              text: "when you use a feature that shares something and choose to share it.",
            },
          ],
        },
        {
          p: "We do not sell personal information and do not share it for cross-context behavioural advertising.",
        },
      ],
    },
    {
      title: "Cookies",
      blocks: [
        {
          p: "The App uses cookies and local storage to keep you signed in, to remember your preferences, and — during the beta — for the analytics and session recording described above. They are set for us and for the providers named in this policy, not for advertisers; there are no advertising cookies. Because sign-in is made of cookies, blocking them means the App cannot work.",
        },
      ],
    },
    {
      title: "Retention",
      blocks: [
        {
          p: `Account information is kept while your account exists. Documents and their edit history are kept so you can come back to them — and during the beta, deleting a page or project removes it from your workspace but does not immediately erase every copy from our systems: edit history, uploaded files and AI interaction records can persist until we erase them. To have your account and everything under it erased, write to ${legal.privacyContact} and we will do it. Records the law requires us to keep, we keep for as long as it requires.`,
        },
      ],
    },
    {
      title: "Security",
      blocks: [
        {
          p: "You sign in with Google, so there is no Nootles password to steal. Connections are encrypted in transit, tokens for connected services are stored encrypted, and access to user data inside Nootles is restricted to operating the Service. No system is perfectly secure and we will not pretend ours is the exception; what we promise is that if a breach affects you, we will tell you as the law requires, and plainly.",
        },
      ],
    },
    {
      title: "Your rights",
      blocks: [
        {
          p: `You can ask for a copy of your information, ask us to correct it, and ask us to erase it — write to ${legal.privacyContact}. Canadian privacy law (PIPEDA and its provincial counterparts) gives you rights of access and correction; the GDPR, if you are in the EEA or UK, adds rights to portability, to object to or restrict certain processing, and to complain to your data-protection authority; California's CCPA does similar work, including the right not to be discriminated against for exercising it. We will verify a request before acting on it, and we answer within the time the law sets.`,
        },
      ],
    },
    {
      title: "Where data lives",
      blocks: [
        {
          p: "Nootles is a British Columbia company, but the Service runs on providers in the United States and elsewhere, so your information is processed outside Canada and is subject to the law of the places it is processed in. Where the law requires safeguards for moving data across borders — such as the EU standard contractual clauses — we use them.",
        },
      ],
    },
    {
      title: "Children",
      blocks: [
        {
          p: `The Service is not directed to children under 13 and we do not knowingly collect their information. If you believe a child under 13 has an account, tell us at ${legal.privacyContact} and we will delete it.`,
        },
      ],
    },
    {
      title: "Changes to this policy",
      blocks: [
        {
          p: "We may update this policy as the Service changes. Material changes will be announced — on the Site, in the App, or by email — before they take effect, and the effective date at the top is always the date of the version you are reading.",
        },
      ],
    },
    {
      title: "Contact",
      blocks: [
        {
          p: `Privacy questions and requests go to ${legal.privacyContact}.`,
        },
      ],
    },
  ],
};
