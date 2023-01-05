export type User = {
  id: number;
  name: string;
  username: string;
  description: string;
  profile_image_url: string;
};

export type TweetType = {
  id: number;
  text: string;
  created_at: Date;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  profile_image_url: string;
  username: string;
  name: string;
  authorId: number;
  mentions: {
    username: string;
    id: number;
    start: number;
    end: number;
  }[];
  entities: {
    urls: {
      url: string;
      start: number;
      end: number;
      expanded_url: string;
      display_url: string;
    }[];

    mentions: {
      username: string;
      id: number;
      start: number;
      end: number;
    }[];

    media: {
      start: number;
      end: number;
      type: string;
      url: string;
      preview_image_url: string;
    }[];
  };
};

export type List = {
  id: number;
  name: string;
  description: string;
  member_count: number;
  follower_count: number;
  owner: User;
  private: false;
};

export type Lists = {
  ownedLists: {
    id: number;
    name: string;
    private: Boolean;
  }[];
  followedLists: {
    id: number;
    name: string;
    description: string;
    member_count: number;
    follower_count: number;
    owner: User;
    private: false;
  }[];
};
