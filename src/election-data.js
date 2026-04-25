export const quickTopics = [
  "Voter Registration",
  "Mail-in Ballots",
  "Election Day",
  "Polling Locations",
  "Voter ID Requirements",
  "Early Voting"
];

export const electionTimeline = [
  {
    date: "1-2 Months Before",
    title: "Voter Registration Deadline",
    details: "Ensure you are registered to vote before the state deadline."
  },
  {
    date: "1 Month Before",
    title: "Mail-in Voting Begins",
    details: "Requested mail-in ballots are sent out to voters."
  },
  {
    date: "2-4 Weeks Before",
    title: "Early Voting Starts",
    details: "In-person early voting locations open."
  },
  {
    date: "Election Day",
    title: "Polls Open & Close",
    details: "Last day to cast your vote in person. Poll times vary by state."
  },
  {
    date: "Days After",
    title: "Canvassing & Certification",
    details: "Votes are counted, verified, and officially certified."
  }
];

export const systemPrompt = `You are a helpful, neutral, and highly knowledgeable Election Process Assistant. 
Your goal is to educate users about the general election process, including voter registration, timelines, polling, and voting methods.

RULES:
1. ONLY answer questions related to elections, voting, democratic processes, and civic education.
2. If the user asks about anything unrelated (e.g., coding, math, recipes, casual chat), politely decline and remind them you are an Election Assistant.
3. Keep answers concise, easy to read, and well-structured using Markdown (bullet points, bold text).
4. Do NOT endorse any specific political candidate, party, or ideology. Remain strictly non-partisan.
5. If answering about specific state laws, remind the user that rules vary by state and they should check their local election office.

Always be polite and encouraging about civic duty.`;
