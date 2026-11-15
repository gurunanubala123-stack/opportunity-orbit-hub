// Single source of truth for every document card, guide page, tracker row and the AI helper's knowledge.
// Pure data only (no icons/JSX) so the server chat route can import it too.

export type Category = "Identity" | "Civic" | "Travel" | "Money" | "Health" | "Career";

export interface DocLink {
  label: string;
  url: string;
}

export interface AdultDocument {
  slug: string;
  serial: string;
  name: string;
  hindi: string;
  category: Category;
  essential: boolean;
  tagline: string;
  description: string;
  minAge: number;
  maxAge?: number;
  ageNote: string;
  fee: string;
  time: string;
  officialUrl: string;
  actionLabel: string;
  links: DocLink[];
  requiredDocs: string[];
  steps: string[];
  tip: string;
}

export const CATEGORIES: Category[] = ["Identity", "Civic", "Travel", "Money", "Health", "Career"];

export const DOCUMENTS: AdultDocument[] = [
  {
    slug: "birth-certificate",
    serial: "I",
    name: "Birth Certificate",
    hindi: "जन्म प्रमाण पत्र",
    category: "Identity",
    essential: true,
    tagline: "The root proof of your date of birth.",
    description:
      "Almost every other document asks for proof of date of birth. If your birth was never registered, you can apply for late (delayed) registration with the local registrar.",
    minAge: 0,
    ageNote: "Any age — late registration allowed",
    fee: "Free – nominal late fee",
    time: "7 – 30 days",
    officialUrl:
      "https://ap.meeseva.gov.in/DeptPortal/Application%20Forms%20New/Revenue-pdf/Late%20Registration%20of%20Birth.pdf",
    actionLabel: "Late registration form",
    links: [
      {
        label: "Late Registration of Birth form (PDF)",
        url: "https://ap.meeseva.gov.in/DeptPortal/Application%20Forms%20New/Revenue-pdf/Late%20Registration%20of%20Birth.pdf",
      },
      { label: "Civil Registration System (CRS) portal", url: "https://crsorgi.gov.in/" },
    ],
    requiredDocs: [
      "Hospital discharge slip or school record showing date of birth",
      "Parents' ID proof (Aadhaar / Voter ID)",
      "Affidavit for delayed registration (if over 1 year late)",
      "Address proof",
    ],
    steps: [
      "Download and fill the late registration form.",
      "Attach proof of birth and an affidavit if required.",
      "Submit at the municipal office / MeeSeva / registrar of births.",
      "Collect the certificate or download it from the CRS portal.",
    ],
    tip: "Get 2–3 certified copies — passport and school offices often keep one.",
  },
  {
    slug: "aadhaar",
    serial: "II",
    name: "Aadhaar Update",
    hindi: "आधार अपडेट",
    category: "Identity",
    essential: true,
    tagline: "Refresh your photo, biometrics, address and mobile.",
    description:
      "Your childhood Aadhaar needs a mandatory biometric update and often a fresh address or mobile number. Keeping Aadhaar current unlocks PAN, bank KYC, DigiLocker and most government services.",
    minAge: 0,
    ageNote: "Biometric update due at 5 and 15",
    fee: "≈ ₹75 demographic · ₹125 biometric",
    time: "Up to 30 days",
    officialUrl: "https://uidai.gov.in/en/my-aadhaar#updates-details",
    actionLabel: "Update Aadhaar",
    links: [
      { label: "UIDAI — Aadhaar update details", url: "https://uidai.gov.in/en/my-aadhaar#updates-details" },
      { label: "myAadhaar self-service portal", url: "https://myaadhaar.uidai.gov.in/" },
    ],
    requiredDocs: ["Current Aadhaar number", "Proof of identity", "Proof of address", "Registered mobile for OTP"],
    steps: [
      "Open the myAadhaar portal and log in with OTP.",
      "Choose Document / Address update (online) — or book a centre visit for biometrics.",
      "Upload proofs and pay the fee.",
      "Track using your URN and download the updated e-Aadhaar.",
    ],
    tip: "Biometric and mobile number changes need a visit to an Aadhaar centre.",
  },
  {
    slug: "pan-card",
    serial: "III",
    name: "PAN Card",
    hindi: "पैन कार्ड",
    category: "Money",
    essential: true,
    tagline: "Your tax identity for bank, salary and investments.",
    description:
      "A Permanent Account Number is needed to open most bank accounts, receive a salary, file taxes, invest in mutual funds or buy anything high-value.",
    minAge: 0,
    ageNote: "Any age — minors via guardian",
    fee: "≈ ₹107 (physical card) · e-PAN free",
    time: "Instant e-PAN · 15 days card",
    officialUrl: "https://onlineservices.proteantech.in/paam/endUserRegisterContact.html",
    actionLabel: "Apply for PAN",
    links: [
      { label: "Protean (NSDL) PAN application", url: "https://onlineservices.proteantech.in/paam/endUserRegisterContact.html" },
      { label: "Instant e-PAN via Income Tax portal", url: "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/instant-e-pan" },
      { label: "UTIITSL PAN services", url: "https://www.pan.utiitsl.com/" },
    ],
    requiredDocs: ["Aadhaar (linked to mobile)", "Passport-size photo & signature (for card)", "Date-of-birth proof"],
    steps: [
      "Fill Form 49A on the Protean portal (or get instant e-PAN with Aadhaar).",
      "Verify with Aadhaar e-KYC OTP.",
      "Pay the fee online.",
      "Download e-PAN; the physical card arrives by post.",
    ],
    tip: "Instant e-PAN is free and takes about 10 minutes if your Aadhaar has a linked mobile.",
  },
  {
    slug: "voter-id",
    serial: "IV",
    name: "Voter ID",
    hindi: "मतदाता पहचान पत्र",
    category: "Civic",
    essential: true,
    tagline: "Your voice in every election — Form 6 online.",
    description:
      "Turning 18 means you can vote. Register on the Voters' Service Portal with Form 6 to get your Electors Photo Identity Card (EPIC). You can pre-register from 17.",
    minAge: 18,
    ageNote: "18+ (pre-register from 17)",
    fee: "Free",
    time: "≈ 30 days",
    officialUrl: "https://voters.eci.gov.in/",
    actionLabel: "Register to vote",
    links: [
      { label: "Voters' Service Portal (Form 6)", url: "https://voters.eci.gov.in/" },
      { label: "Search your name in electoral roll", url: "https://electoralsearch.eci.gov.in/" },
    ],
    requiredDocs: ["Passport-size photo", "Age proof (birth certificate / 10th marksheet / Aadhaar)", "Address proof"],
    steps: [
      "Sign up on voters.eci.gov.in with your mobile.",
      "Fill Form 6 — New voter registration.",
      "Upload photo, age and address proof.",
      "A booth officer verifies; download your e-EPIC once approved.",
    ],
    tip: "Track your application with the reference ID and download the e-EPIC to DigiLocker.",
  },
  {
    slug: "driving-licence",
    serial: "V",
    name: "Driving Licence",
    hindi: "ड्राइविंग लाइसेंस",
    category: "Travel",
    essential: true,
    tagline: "Learner's licence first, then the driving test.",
    description:
      "Apply for a Learner's Licence on Sarathi Parivahan, pass the online road-sign test, practise for 30 days, then book the driving test for your permanent licence.",
    minAge: 18,
    ageNote: "18+ for geared vehicles (16 for ≤50cc gearless)",
    fee: "≈ ₹150 – ₹1,000 (varies by state)",
    time: "30+ days (learner's → permanent)",
    officialUrl: "https://sarathi.parivahan.gov.in/sarathiservice/stateSelectBean.do",
    actionLabel: "Apply on Sarathi",
    links: [
      { label: "Sarathi — select your state", url: "https://sarathi.parivahan.gov.in/sarathiservice/stateSelectBean.do" },
      { label: "Parivahan Sewa home", url: "https://parivahan.gov.in/" },
    ],
    requiredDocs: ["Aadhaar", "Age proof", "Address proof", "Passport photo & signature", "Medical certificate (Form 1A, if needed)"],
    steps: [
      "Select your state on Sarathi and apply for Learner's Licence.",
      "Take the online/at-RTO road-sign test.",
      "After 30 days, book a driving test slot.",
      "Pass the test — the smart-card DL is posted to you.",
    ],
    tip: "Many states let you take the learner's test from home with Aadhaar authentication.",
  },
  {
    slug: "passport",
    serial: "VI",
    name: "Passport",
    hindi: "पासपोर्ट",
    category: "Travel",
    essential: true,
    tagline: "Your gateway to study, work and travel abroad.",
    description:
      "Register on Passport Seva, fill the application, pay online and visit a Passport Seva Kendra for biometrics. Police verification follows before the passport is dispatched.",
    minAge: 0,
    ageNote: "Any age — adult passport valid 10 years",
    fee: "₹1,500 normal · ₹3,500 Tatkaal (36 pages)",
    time: "7 – 30 days",
    officialUrl:
      "https://services1.passportindia.gov.in/forms/registration?_gl=1%2A14t63ku%2A_ga%2ANjYzMDk0MzU3LjE3OTQ3NTY2NTA.%2A_ga_B4255W3J9F%2AczE3OTQ3NTY2NTAkbzEkZzEkdDE3OTQ3NTY2NjkkajQxJGwwJGgw%2A_ga_JTJJBP5DNH%2AczE3OTQ3NTY2NTAkbzEkZzEkdDE3OTQ3NTY2NjkkajQxJGwwJGgw",
    actionLabel: "Register on Passport Seva",
    links: [
      {
        label: "Passport Seva — new user registration",
        url: "https://services1.passportindia.gov.in/forms/registration?_gl=1%2A14t63ku%2A_ga%2ANjYzMDk0MzU3LjE3OTQ3NTY2NTA.%2A_ga_B4255W3J9F%2AczE3OTQ3NTY2NTAkbzEkZzEkdDE3OTQ3NTY2NjkkajQxJGwwJGgw%2A_ga_JTJJBP5DNH%2AczE3OTQ3NTY2NTAkbzEkZzEkdDE3OTQ3NTY2NjkkajQxJGwwJGgw",
      },
      { label: "Passport Seva home", url: "https://www.passportindia.gov.in/" },
    ],
    requiredDocs: ["Aadhaar", "Birth certificate or 10th marksheet (date of birth)", "Address proof", "Non-ECR proof (10th pass marksheet)"],
    steps: [
      "Register on Passport Seva and log in.",
      "Fill the 'Fresh Passport' application.",
      "Pay & book an appointment at a Passport Seva Kendra.",
      "Visit with originals, complete police verification, receive passport by post.",
    ],
    tip: "Carry originals plus self-attested photocopies — the PSK verifies both.",
  },
  {
    slug: "digilocker",
    serial: "VII",
    name: "DigiLocker",
    hindi: "डिजिलॉकर",
    category: "Identity",
    essential: false,
    tagline: "All your documents, legally valid, in your phone.",
    description:
      "DigiLocker stores verified digital copies of Aadhaar, PAN, DL, marksheets and more. Documents issued here are legally equal to originals.",
    minAge: 0,
    ageNote: "Any age with Aadhaar",
    fee: "Free",
    time: "5 minutes",
    officialUrl: "https://www.digilocker.gov.in/",
    actionLabel: "Open DigiLocker",
    links: [{ label: "DigiLocker", url: "https://www.digilocker.gov.in/" }],
    requiredDocs: ["Aadhaar-linked mobile number"],
    steps: ["Sign up with mobile number.", "Link Aadhaar via OTP.", "Pull issued documents (DL, marksheets, PAN)."],
    tip: "Set it up first — many later steps can pull documents straight from DigiLocker.",
  },
  {
    slug: "bank-account",
    serial: "VIII",
    name: "Bank Account (Jan Dhan)",
    hindi: "जन धन खाता",
    category: "Money",
    essential: false,
    tagline: "Zero-balance savings account with RuPay card.",
    description:
      "Pradhan Mantri Jan Dhan Yojana gives a zero-balance savings account with a RuPay debit card and accident insurance — perfect for your first independent account.",
    minAge: 10,
    ageNote: "10+ (18+ to operate independently)",
    fee: "Free · zero balance",
    time: "Same day",
    officialUrl: "https://pmjdy.gov.in/",
    actionLabel: "Explore Jan Dhan",
    links: [{ label: "PM Jan Dhan Yojana", url: "https://pmjdy.gov.in/" }],
    requiredDocs: ["Aadhaar", "PAN (or Form 60)", "Photo"],
    steps: ["Visit any bank branch or BC point.", "Fill the PMJDY account form.", "Complete Aadhaar e-KYC and collect your RuPay card."],
    tip: "Link your mobile and Aadhaar to the account to receive scholarships directly (DBT).",
  },
  {
    slug: "abha",
    serial: "IX",
    name: "ABHA Health ID",
    hindi: "आभा हेल्थ आईडी",
    category: "Health",
    essential: false,
    tagline: "A 14-digit health ID for all your medical records.",
    description:
      "Ayushman Bharat Health Account (ABHA) links your prescriptions, lab reports and hospital records digitally across India.",
    minAge: 0,
    ageNote: "Any age",
    fee: "Free",
    time: "5 minutes",
    officialUrl: "https://abha.abdm.gov.in/",
    actionLabel: "Create ABHA",
    links: [{ label: "ABHA portal", url: "https://abha.abdm.gov.in/" }],
    requiredDocs: ["Aadhaar or Driving Licence", "Mobile number"],
    steps: ["Open the ABHA portal.", "Verify with Aadhaar OTP.", "Choose your ABHA address and download the card."],
    tip: "Use the ABHA address at hospitals to skip paperwork.",
  },
  {
    slug: "organ-donor",
    serial: "X",
    name: "Organ Donor Pledge",
    hindi: "अंगदान प्रतिज्ञा",
    category: "Health",
    essential: false,
    tagline: "One pledge can save up to eight lives.",
    description:
      "At 18 you can legally pledge to donate organs. Register with NOTTO and receive a donor card — and tell your family.",
    minAge: 18,
    ageNote: "18+",
    fee: "Free",
    time: "2 minutes",
    officialUrl: "https://notto.abdm.gov.in/",
    actionLabel: "Take the pledge",
    links: [{ label: "NOTTO — National Organ & Tissue Transplant Organisation", url: "https://notto.abdm.gov.in/" }],
    requiredDocs: ["Aadhaar"],
    steps: ["Open the NOTTO pledge page.", "Verify with Aadhaar.", "Download your donor card."],
    tip: "Share your decision with family — their consent matters at the time of donation.",
  },
  {
    slug: "scholarship",
    serial: "XI",
    name: "National Scholarship",
    hindi: "राष्ट्रीय छात्रवृत्ति",
    category: "Career",
    essential: false,
    tagline: "One portal for central & state scholarships.",
    description:
      "The National Scholarship Portal lists pre-matric, post-matric and merit scholarships. Money goes straight to your Aadhaar-linked bank account.",
    minAge: 0,
    ageNote: "Students — by scheme",
    fee: "Free",
    time: "Seasonal windows",
    officialUrl: "https://scholarships.gov.in/",
    actionLabel: "Find scholarships",
    links: [{ label: "National Scholarship Portal", url: "https://scholarships.gov.in/" }],
    requiredDocs: ["Aadhaar", "Bank account", "Income & caste certificate (if applicable)", "Marksheets"],
    steps: ["Register with One-Time Registration (OTR).", "Pick eligible schemes.", "Upload documents and submit before the deadline."],
    tip: "Windows usually open July–October — set a reminder.",
  },
  {
    slug: "skill-india",
    serial: "XII",
    name: "Skill India Digital",
    hindi: "स्किल इंडिया",
    category: "Career",
    essential: false,
    tagline: "Free courses, certificates and apprenticeships.",
    description:
      "Skill India Digital Hub offers free and government-certified courses, apprenticeships and a digital skill wallet.",
    minAge: 14,
    ageNote: "14+",
    fee: "Mostly free",
    time: "Self-paced",
    officialUrl: "https://www.skillindiadigital.gov.in/",
    actionLabel: "Start learning",
    links: [{ label: "Skill India Digital Hub", url: "https://www.skillindiadigital.gov.in/" }],
    requiredDocs: ["Mobile number", "Aadhaar (for certificates)"],
    steps: ["Sign up with mobile.", "Browse courses or apprenticeships.", "Earn certificates into your skill wallet."],
    tip: "Certificates sync to DigiLocker — great for your first CV.",
  },
  {
    slug: "career-service",
    serial: "XIII",
    name: "National Career Service",
    hindi: "राष्ट्रीय करियर सेवा",
    category: "Career",
    essential: false,
    tagline: "Government job portal, counselling & job fairs.",
    description:
      "The NCS portal connects job seekers with verified employers, career counsellors and job fairs across India.",
    minAge: 14,
    ageNote: "14+",
    fee: "Free",
    time: "10 minutes",
    officialUrl: "https://www.ncs.gov.in/",
    actionLabel: "Find jobs",
    links: [{ label: "National Career Service", url: "https://www.ncs.gov.in/" }],
    requiredDocs: ["Mobile / email", "Education details"],
    steps: ["Register as a job seeker.", "Complete your profile.", "Apply to jobs and job fairs."],
    tip: "Book a free career-counselling session from your dashboard.",
  },
  {
    slug: "epfo-uan",
    serial: "XIV",
    name: "EPFO / UAN",
    hindi: "ईपीएफओ यूएएन",
    category: "Money",
    essential: false,
    tagline: "Your provident-fund number for your first job.",
    description:
      "When you join a company your employer creates a Universal Account Number (UAN). Activate it to track PF savings that follow you across jobs.",
    minAge: 18,
    ageNote: "At your first salaried job",
    fee: "Free",
    time: "10 minutes",
    officialUrl: "https://unifiedportal-mem.epfindia.gov.in/memberinterface/",
    actionLabel: "Activate UAN",
    links: [{ label: "EPFO member portal", url: "https://unifiedportal-mem.epfindia.gov.in/memberinterface/" }],
    requiredDocs: ["UAN from employer", "Aadhaar", "PAN", "Bank account"],
    steps: ["Get UAN from your employer.", "Activate on the member portal with OTP.", "Link Aadhaar, PAN and bank (KYC)."],
    tip: "Never withdraw PF when switching jobs — transfer it and let it grow.",
  },
  {
    slug: "income-tax",
    serial: "XV",
    name: "Income Tax e-Filing",
    hindi: "आयकर ई-फाइलिंग",
    category: "Money",
    essential: false,
    tagline: "File your ITR and claim refunds online.",
    description:
      "Register on the e-filing portal with your PAN to file returns, claim TDS refunds from internships or freelancing, and download Form 26AS.",
    minAge: 0,
    ageNote: "Anyone with PAN",
    fee: "Free",
    time: "30 minutes",
    officialUrl: "https://www.incometax.gov.in/iec/foportal/",
    actionLabel: "Open e-Filing",
    links: [{ label: "Income Tax e-Filing portal", url: "https://www.incometax.gov.in/iec/foportal/" }],
    requiredDocs: ["PAN (linked with Aadhaar)", "Bank account", "Form 16 / TDS details"],
    steps: ["Register with PAN.", "Pick the right ITR form.", "File and e-verify with Aadhaar OTP."],
    tip: "Even with low income, filing an ITR builds a financial record for loans and visas.",
  },
];

export const JOURNEY: string[] = [
  "birth-certificate",
  "aadhaar",
  "digilocker",
  "pan-card",
  "bank-account",
  "voter-id",
  "driving-licence",
  "passport",
];

export function getDocument(slug: string): AdultDocument | undefined {
  return DOCUMENTS.find((d) => d.slug === slug);
}

/** Compact text version of the catalogue, used as grounding for the AI helper. */
export function documentsAsKnowledge(): string {
  return DOCUMENTS.map(
    (d) =>
      `## ${d.name} (${d.hindi}) — ${d.category}\n${d.description}\nAge: ${d.ageNote}. Fee: ${d.fee}. Time: ${d.time}.\nOfficial link: ${d.officialUrl}\nOther links: ${d.links.map((l) => `${l.label} <${l.url}>`).join("; ")}\nDocuments needed: ${d.requiredDocs.join("; ")}\nSteps: ${d.steps.map((s, i) => `${i + 1}. ${s}`).join(" ")}\nTip: ${d.tip}\nGuide page on this site: /documents/${d.slug}`,
  ).join("\n\n");
}
