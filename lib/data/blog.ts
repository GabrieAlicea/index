export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  publishedAt: string;
  readMinutes: number;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-mobile-mechanics-are-the-future-of-auto-repair",
    title: "Why Mobile Mechanics Are the Future of Auto Repair",
    excerpt:
      "Shops carry overhead that gets passed straight to your bill. Here's why most common repairs don't need a shop at all.",
    category: "Industry",
    publishedAt: "2026-05-12",
    readMinutes: 5,
    content: [
      "A traditional repair shop is, functionally, a piece of expensive real estate: bays, lifts, a waiting room, and a service advisor whose job is partly to sell you on additional work. All of that overhead is priced into your invoice, whether or not the job in front of your mechanic actually needed it.",
      "Most of the repairs people bring to a shop — oil changes, brake jobs, battery and alternator swaps, diagnostics, even electronics installs — don't require a lift or a bay. They require a skilled mechanic, the right parts, and the right tools, all of which travel just as easily as you do.",
      "That's the premise behind mobile mechanic marketplaces like Revvy: strip out the real estate cost, dispatch based on proximity instead of foot traffic, and pass the savings back to the customer while paying the mechanic a larger share of every job.",
    ],
  },
  {
    slug: "how-revvy-vets-every-mechanic",
    title: "How Revvy Vets Every Mechanic on the Platform",
    excerpt:
      "Trust is the hardest problem in any marketplace. Here's exactly what happens before a mechanic can accept their first job.",
    category: "Trust & Safety",
    publishedAt: "2026-05-28",
    readMinutes: 4,
    content: [
      "Letting a stranger work on your car — in your driveway, with your keys — only works if you can trust who's showing up. Every mechanic who applies to Revvy submits a valid driver's license, proof of liability insurance, and any relevant certifications before they can go online.",
      "Our operations team manually reviews every submission. Mechanics are approved, rejected, or asked for more information — there's no way to skip the queue. Once approved, every completed job feeds into a public rating, so trust compounds over time instead of resetting with every booking.",
    ],
  },
  {
    slug: "what-to-expect-at-your-first-mobile-repair",
    title: "What to Expect at Your First Mobile Repair",
    excerpt:
      "Never had a mechanic come to you before? Here's a walkthrough of what actually happens, start to finish.",
    category: "Customer Guide",
    publishedAt: "2026-06-09",
    readMinutes: 4,
    content: [
      "You book a service, get an instant estimate, and choose ASAP or a scheduled time. Once a mechanic accepts your job, you can track their location in real time, the same way you'd track a rideshare.",
      "When they arrive, they'll confirm the job with you before starting, document the vehicle's condition, and get to work. Most standard services — an oil change, a battery swap, a brake job — wrap up in under an hour. You'll get before-and-after photos, and payment is only captured once the job is marked complete.",
    ],
  },
];

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
