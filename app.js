import { createPost, getPosts, likePost, addComment } from './utils/posts.js';
import { getStoriesData } from './utils/stories.js';

export function initializeApp() {
  // Initialize navigation
  initNavigation();
  
  // Load stories
  loadStories();
  
  // Load posts
  loadPosts();
  
  // Initialize modal
  initCreatePostModal();
  
  console.log('MyGram app initialized');
}

function initNavigation() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('[data-id="mobile-menu-btn"]');
  const mobileMenu = document.querySelector('[data-id="mobile-menu"]');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Create post button
  const createPostBtn = document.querySelector('[data-id="create-post-btn"]');
  const modal = document.querySelector('[data-id="create-post-modal"]');
  
  if (createPostBtn && modal) {
    createPostBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  }
}

function initCreatePostModal() {
  const modal = document.querySelector('[data-id="create-post-modal"]');
  const closeBtn = document.querySelector('[data-id="close-modal-btn"]');
  const cancelBtn = document.querySelector('[data-id="cancel-btn"]');
  const form = document.querySelector('[data-id="create-post-form"]');
  const imageUploadArea = document.querySelector('[data-id="image-upload-area"]');
  const imageInput = document.querySelector('[data-id="image-input"]');
  const imagePreview = document.querySelector('[data-id="image-preview"]');
  const previewImage = document.querySelector('[data-id="preview-image"]');
  
  // Close modal
  [closeBtn, cancelBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        modal.classList.add('hidden');
        resetForm();
      });
    }
  });
  
  // Close on backdrop click
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      resetForm();
    }
  });
  
  // Image upload
  imageUploadArea?.addEventListener('click', () => {
    imageInput?.click();
  });
  
  imageInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        imagePreview.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Form submit
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const caption = document.querySelector('[data-id="caption-input"]').value;
    
    // Simulate post creation
    await createPost({
      image: previewImage.src,
      caption: caption,
      timestamp: new Date().toISOString()
    });
    
    modal.classList.add('hidden');
    resetForm();
    loadPosts(); // Refresh posts
  });
  
  function resetForm() {
    form?.reset();
    imagePreview?.classList.add('hidden');
    previewImage.src = '';
  }
}

async function loadStories() {
  const container = document.querySelector('[data-id="stories-container"]');
  if (!container) return;
  
  const stories = await getStoriesData();
  container.innerHTML = stories.map(story => `
    <div data-id="story-${story.id}" class="flex-shrink-0 text-center cursor-pointer">
      <div class="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-purple-500 to-pink-500">
        <img src="${story.avatar}" alt="${story.username}" class="w-full h-full rounded-full border-2 border-white object-cover">
      </div>
      <p class="text-xs mt-1 truncate w-16">${story.username}</p>
    </div>
  `).join('');
}

async function loadPosts() {
  const container = document.querySelector('[data-id="posts-container"]');
  const loading = document.querySelector('[data-id="loading-placeholder"]');
  
  if (!container) return;
  
  try {
    const posts = await getPosts();
    loading?.remove();
    
    container.innerHTML = posts.map(post => createPostHTML(post)).join('');
    
    // Add event listeners to post interactions
    initPostInteractions();
    
  } catch (error) {
    console.error('Failed to load posts:', error);
    container.innerHTML = '<div class="text-center py-8 text-gray-500">Failed to load posts</div>';
  }
}

function createPostHTML(post) {
  return `
    <article data-id="post-${post.id}" data-runtime="true" class="bg-white border border-gray-200 rounded-lg">
      <!-- Post Header -->
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center space-x-3">
          <img src="${post.user.avatar}" alt="${post.user.username}" class="w-10 h-10 rounded-full object-cover">
          <div>
            <h3 class="font-semibold text-sm">${post.user.username}</h3>
            <p class="text-xs text-gray-500">${post.location || ''}</p>
          </div>
        </div>
        <button data-id="post-options-${post.id}" class="text-gray-400 hover:text-gray-600">
          <i data-lucide="more-horizontal" class="w-5 h-5"></i>
        </button>
      </div>
      
      <!-- Post Image -->
      <div class="aspect-square">
        <img src="${post.image}" alt="Post image" class="w-full h-full object-cover">
      </div>
      
      <!-- Post Actions -->
      <div class="p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-4">
            <button data-id="like-btn-${post.id}" class="text-gray-700 hover:text-red-500 ${post.liked ? 'text-red-500' : ''}">
              <i data-lucide="heart" class="w-6 h-6 ${post.liked ? 'fill-current' : ''}"></i>
            </button>
            <button data-id="comment-btn-${post.id}" class="text-gray-700 hover:text-blue-500">
              <i data-lucide="message-circle" class="w-6 h-6"></i>
            </button>
            <button data-id="share-btn-${post.id}" class="text-gray-700 hover:text-blue-500">
              <i data-lucide="send" class="w-6 h-6"></i>
            </button>
          </div>
          <button data-id="save-btn-${post.id}" class="text-gray-700 hover:text-blue-500">
            <i data-lucide="bookmark" class="w-6 h-6"></i>
          </button>
        </div>
        
        <!-- Likes -->
        <p data-id="likes-${post.id}" class="font-semibold text-sm mb-2">${post.likes.toLocaleString()} likes</p>
        
        <!-- Caption -->
        <div class="text-sm">
          <span class="font-semibold">${post.user.username}</span>
          <span class="ml-1">${post.caption}</span>
        </div>
        
        <!-- Comments -->
        <div data-id="comments-${post.id}" class="mt-2">
          ${post.comments.length > 2 ? `
            <button class="text-gray-500 text-sm">View all ${post.comments.length} comments</button>
          ` : ''}
          ${post.comments.slice(-2).map(comment => `
            <div class="text-sm">
              <span class="font-semibold">${comment.username}</span>
              <span class="ml-1">${comment.text}</span>
            </div>
          `).join('')}
        </div>
        
        <!-- Timestamp -->
        <p class="text-xs text-gray-500 mt-2 uppercase">${formatTimeAgo(post.timestamp)}</p>
        
        <!-- Add Comment -->
        <div class="flex items-center mt-3 pt-3 border-t border-gray-100">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            data-id="comment-input-${post.id}"
            class="flex-1 text-sm border-0 focus:ring-0 focus:outline-none"
          >
          <button data-id="post-comment-${post.id}" class="text-blue-500 font-semibold text-sm ml-2">Post</button>
        </div>
      </div>
    </article>
  `;
}

function initPostInteractions() {
  // Like buttons
  document.querySelectorAll('[data-id^="like-btn-"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const postId = e.currentTarget.getAttribute('data-id').split('-')[2];
      const heartIcon = btn.querySelector('[data-lucide="heart"]');
      const likesElement = document.querySelector(`[data-id="likes-${postId}"]`);
      
      // Toggle like state
      const isLiked = heartIcon.classList.contains('fill-current');
      
      if (isLiked) {
        heartIcon.classList.remove('fill-current');
        btn.classList.remove('text-red-500');
        btn.classList.add('text-gray-700');
      } else {
        heartIcon.classList.add('fill-current');
        btn.classList.remove('text-gray-700');
        btn.classList.add('text-red-500');
      }
      
      await likePost(postId, !isLiked);
    });
  });
  
  // Comment posting
  document.querySelectorAll('[data-id^="post-comment-"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const postId = e.currentTarget.getAttribute('data-id').split('-')[2];
      const input = document.querySelector(`[data-id="comment-input-${postId}"]`);
      const comment = input.value.trim();
      
      if (comment) {
        await addComment(postId, comment);
        input.value = '';
        // Would typically refresh comments here
      }
    });
  });
}

function formatTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now - time) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return time.toLocaleDateString();
}