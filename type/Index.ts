export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  bio: string;
  skills: string[];
  causes: string[];
  role: "USER" | "ADMIN" | "ORG";
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  eventsCreated: Event[];
  eventsJoined: UserEvent[];
  teams: TeamMember[];
  contributions: Contribution[];
  post: Post[];
  comments: Comment[];
  teamsCreated: Team[];
  leaderboard: Leaderboard[];
  certificates: Certificate[];
}

// Event Model
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  category: string;
  endDateTime: string;
  requiredMembers: number;
  createdById?: string;
  createdByTeamId?: string
  visibility: "PUBLIC" | "PRIVATE";
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
  createdByTeam?: Team; 
  participants: UserEvent[];
  contributions: Contribution[];
}

// User Event Model
export interface UserEvent {
  id: string;
  userId: string;
  eventId: string;
  status: "JOINED" | "COMPLETED" | "CANCELLED";
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  event: Event;
}

// Post Model
export interface Post {
  id: string;
  title: string;
  description?: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "CLOSED";
  createdById?: string;
  createdByTeamId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
  createdByTeam?: Team;
  responses: Comment[];
}

// Comment Model
export interface Comment {
  id: string;
  userId: string;
  postId: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
  post: Post;
  user: User;
}

// Team Model
export interface Team {
  id: string;
  name: string;
  description?: string;
  type: "PUBLIC" | "PRIVATE";
  createdById: string;
  events: Event[]
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  members: TeamMember[];
}

// Team Member Model
export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  joinedAt: string;
  user: User;
  team: Team;
}

// Contribution Model
export interface Contribution {
  id: string;
  userId: string;
  eventId?: string;
  hours?: number;
  points?: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  event?: Event;
  validations: Verification[];
}

// Verification Model
export interface Verification {
  id: string;
  contributionId: string;
  verifierId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  contribution: Contribution;
}

// Leaderboard Model
export interface Leaderboard {
  id: string;
  userId: string;
  rank: number;
  points: number;
  hours: number;
  createdAt: string;
  updatedAt: string;
  user: User;
}

// Certificate Model
export interface Certificate {
  id: string;
  userId: string;
  level: "BRONZE" | "SILVER" | "GOLD";
  issuedAt: string;
  user: User;
}
