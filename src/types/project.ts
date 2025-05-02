export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived' | 'deleted';
  members?: ProjectMember[];
  settings?: ProjectSettings;
  metadata?: Record<string, any>;
}

export interface ProjectMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

export interface ProjectSettings {
  notifications?: {
    email?: boolean;
    inApp?: boolean;
  };
  privacy?: 'public' | 'private' | 'restricted';
  features?: {
    fileSharing?: boolean;
    comments?: boolean;
    tasks?: boolean;
  };
}
