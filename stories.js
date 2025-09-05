// Mock data for stories
const storiesData = [
  {
    id: 1,
    username: 'your_story',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    hasNewStory: false,
    isYours: true
  },
  {
    id: 2,
    username: 'travel_sarah',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    hasNewStory: true,
    isYours: false
  },
  {
    id: 3,
    username: 'chef_marco',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    hasNewStory: true,
    isYours: false
  },
  {
    id: 4,
    username: 'photographer',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face',
    hasNewStory: true,
    isYours: false
  },
  {
    id: 5,
    username: 'artist_anna',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    hasNewStory: true,
    isYours: false
  },
  {
    id: 6,
    username: 'music_mike',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    hasNewStory: true,
    isYours: false
  }
];

export async function getStoriesData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return storiesData;
}

export async function addStory(storyData) {
  // Add new story logic would go here
  console.log('Adding story:', storyData);
}

export async function viewStory(storyId) {
  // Mark story as viewed
  const story = storiesData.find(s => s.id === storyId);
  if (story) {
    story.viewed = true;
  }
}