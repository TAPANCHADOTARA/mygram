// Mock data for posts
let postsData = [
  {
    id: 1,
    user: {
      username: 'johndoe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    caption: 'Beautiful sunset at the mountains! 🌅 #nature #photography',
    location: 'Rocky Mountains',
    likes: 342,
    liked: false,
    comments: [
      { username: 'jane_smith', text: 'Absolutely stunning! 😍' },
      { username: 'mike_photo', text: 'Great composition!' },
      { username: 'sarah_travels', text: 'Adding this to my bucket list!' }
    ],
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 2,
    user: {
      username: 'foodie_emma',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=600&fit=crop',
    caption: 'Homemade pizza night! 🍕 Recipe in my bio',
    location: 'Home Kitchen',
    likes: 89,
    liked: true,
    comments: [
      { username: 'chef_marco', text: 'Looks delicious!' },
      { username: 'pizza_lover', text: 'Recipe please! 🙏' }
    ],
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 3,
    user: {
      username: 'fitness_alex',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
    caption: 'Morning workout done! 💪 #fitness #motivation #gymlife',
    location: 'Local Gym',
    likes: 156,
    liked: false,
    comments: [
      { username: 'gym_buddy', text: 'Keep it up! 🔥' },
      { username: 'healthy_life', text: 'Inspiring!' }
    ],
    timestamp: new Date(Date.now() - 14400000).toISOString()
  }
];

export async function getPosts() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [...postsData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export async function createPost(postData) {
  const newPost = {
    id: postsData.length + 1,
    user: {
      username: 'you',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    image: postData.image,
    caption: postData.caption,
    location: postData.location || '',
    likes: 0,
    liked: false,
    comments: [],
    timestamp: postData.timestamp
  };
  
  postsData.unshift(newPost);
  return newPost;
}

export async function likePost(postId, isLiked) {
  const post = postsData.find(p => p.id == postId);
  if (post) {
    post.liked = isLiked;
    post.likes += isLiked ? 1 : -1;
    
    // Update UI
    const likesElement = document.querySelector(`[data-id="likes-${postId}"]`);
    if (likesElement) {
      likesElement.textContent = `${post.likes.toLocaleString()} likes`;
    }
  }
}

export async function addComment(postId, commentText) {
  const post = postsData.find(p => p.id == postId);
  if (post) {
    post.comments.push({
      username: 'you',
      text: commentText
    });
  }
}

export async function deletePost(postId) {
  postsData = postsData.filter(p => p.id != postId);
}