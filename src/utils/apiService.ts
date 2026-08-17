import { AthleteProfile, SocialPost, SocialComment, FollowerNotification } from '../types';

class ApiService {
  private getHeaders(userId?: string): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (userId) {
      headers['x-user-id'] = userId;
    }
    return headers;
  }

  // 1. Auth: Signup
  async signup(data: {
    name: string;
    email: string;
    password?: string;
    username?: string;
    role?: 'player' | 'admin';
    position?: string;
    jerseyNumber?: number;
    club?: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    sportSpecialty?: string;
  }): Promise<{ success: boolean; user?: AthleteProfile; error?: string }> {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error during signup' };
    }
  }

  // 2. Auth: Login
  async login(email: string, password?: string): Promise<{ success: boolean; user?: AthleteProfile; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error during login' };
    }
  }

  // 3. Current User Profile
  async getMe(userId: string): Promise<{ user?: AthleteProfile; error?: string }> {
    try {
      const res = await fetch(`/api/me?userId=${encodeURIComponent(userId)}`, {
        headers: this.getHeaders(userId),
      });
      return await res.json();
    } catch (e: any) {
      return { error: e.message };
    }
  }

  // 4. Get all users
  async getUsers(viewerId?: string): Promise<{ users: AthleteProfile[] }> {
    try {
      const res = await fetch(`/api/users${viewerId ? `?viewerId=${encodeURIComponent(viewerId)}` : ''}`, {
        headers: this.getHeaders(viewerId),
      });
      const data = await res.json();
      return data.users ? data : { users: [] };
    } catch (e) {
      return { users: [] };
    }
  }

  // 5. Get User by ID
  async getUser(id: string, viewerId?: string): Promise<{ user?: AthleteProfile; error?: string }> {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(id)}${viewerId ? `?viewerId=${encodeURIComponent(viewerId)}` : ''}`, {
        headers: this.getHeaders(viewerId),
      });
      return await res.json();
    } catch (e: any) {
      return { error: e.message };
    }
  }

  // 6. Follow / Unfollow
  async toggleFollow(
    targetId: string,
    followerId: string
  ): Promise<{
    success: boolean;
    isFollowing: boolean;
    follower?: AthleteProfile;
    target?: AthleteProfile;
    notification?: FollowerNotification;
    error?: string;
  }> {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(targetId)}/follow`, {
        method: 'POST',
        headers: this.getHeaders(followerId),
        body: JSON.stringify({ followerId }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, isFollowing: false, error: e.message };
    }
  }

  // 7. Update Profile
  async updateProfile(
    userId: string,
    updates: Partial<AthleteProfile>
  ): Promise<{ success: boolean; user?: AthleteProfile; error?: string }> {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: this.getHeaders(userId),
        body: JSON.stringify({ userId, ...updates }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  // 8. Get Posts
  async getPosts(viewerId?: string): Promise<{ posts: SocialPost[] }> {
    try {
      const res = await fetch(`/api/posts${viewerId ? `?viewerId=${encodeURIComponent(viewerId)}` : ''}`, {
        headers: this.getHeaders(viewerId),
      });
      const data = await res.json();
      return data.posts ? data : { posts: [] };
    } catch (e) {
      return { posts: [] };
    }
  }

  // 9. Create Post
  async createPost(postData: any): Promise<{ post: SocialPost; author: AthleteProfile }> {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: this.getHeaders(postData.authorId),
      body: JSON.stringify(postData),
    });
    return await res.json();
  }

  // 10. Delete Post
  async deletePost(postId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    const res = await fetch(`/api/posts/${encodeURIComponent(postId)}`, {
      method: 'DELETE',
      headers: this.getHeaders(userId),
      body: JSON.stringify({ userId }),
    });
    return await res.json();
  }

  // 11. Toggle Like
  async toggleLike(
    postId: string,
    userId: string
  ): Promise<{ success: boolean; isLiked: boolean; post: SocialPost }> {
    const res = await fetch(`/api/posts/${encodeURIComponent(postId)}/like`, {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: JSON.stringify({ userId }),
    });
    return await res.json();
  }

  // 12. Add Comment
  async addComment(
    postId: string,
    authorId: string,
    text: string
  ): Promise<{ success: boolean; comment: SocialComment; post: SocialPost }> {
    const res = await fetch(`/api/posts/${encodeURIComponent(postId)}/comments`, {
      method: 'POST',
      headers: this.getHeaders(authorId),
      body: JSON.stringify({ authorId, text }),
    });
    return await res.json();
  }

  // 13. Get Notifications
  async getNotifications(userId: string): Promise<{ notifications: FollowerNotification[] }> {
    try {
      const res = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`, {
        headers: this.getHeaders(userId),
      });
      const data = await res.json();
      return data.notifications ? data : { notifications: [] };
    } catch (e) {
      return { notifications: [] };
    }
  }

  // 14. Mark Notification Read
  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/notifications/${encodeURIComponent(id)}/read`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return await res.json();
  }

  // 15. Complete State
  async getState(viewerId?: string): Promise<any> {
    try {
      const res = await fetch(`/api/state${viewerId ? `?viewerId=${encodeURIComponent(viewerId)}` : ''}`, {
        headers: this.getHeaders(viewerId),
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  // 16. AI Chatbot (REST fallback & direct query)
  async sendChatMessage(payload: {
    message: string;
    userId?: string;
    mode?: 'tactics' | 'biomechanics' | 'conditioning' | 'nutrition';
    history?: Array<{ sender: 'user' | 'apex'; text: string }>;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: this.getHeaders(payload.userId),
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error communicating with AI' };
    }
  }
  // 17. Sessions: Get recorded performance sessions
  async getSessions(athleteId?: string): Promise<{ sessions: any[] }> {
    try {
      const res = await fetch(`/api/sessions${athleteId ? `?athleteId=${encodeURIComponent(athleteId)}` : ''}`, {
        headers: this.getHeaders(athleteId),
      });
      const data = await res.json();
      return data.sessions ? data : { sessions: [] };
    } catch (e) {
      return { sessions: [] };
    }
  }

  // 18. Sessions: Log a new session
  async logSession(sessionData: any): Promise<{ success: boolean; session?: any; athlete?: any; error?: string }> {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: this.getHeaders(sessionData.athleteId),
        body: JSON.stringify(sessionData),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error logging session' };
    }
  }
}

export const apiService = new ApiService();
