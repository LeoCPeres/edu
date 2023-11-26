export type PostType = {
  id: string;
  authorId: string;
  createdAt: any;
  content: {
    text: string;
  };
  likes: number;
  usersWhoLiked: [string];
};
