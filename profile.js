export function initializeProfile() {
  loadUserPosts();
  initTabNavigation();
  initEditProfile();
  
  console.log('Profile page initialized');
}

function initTabNavigation() {
  const tabs = ['posts-tab', 'reels-tab', 'tagged-tab'];
  
  tabs.forEach(tabId => {
    const tab = document.querySelector(`[data-id="${tabId}"]`);
    tab?.addEventListener('click', () => {
      // Remove active state from all tabs
      tabs.forEach(id => {
        const tabElement = document.querySelector(`[data-id="${id}"]`);
        tabElement?.classList.remove('border-blue-600', 'text-blue-600');
        tabElement?.classList.add('border-transparent', 'text-gray-400');
      });
      
      // Add active state to clicked tab
      tab.classList.remove('border-transparent', 'text-gray-400');
      tab.classList.add('border-blue-600', 'text-blue-600');
      
      // Load content based on tab
      const tabName = tabId.replace('-tab', '');
      loadTabContent(tabName);
    });
  });
}

function initEditProfile() {
  const editBtn = document.querySelector('[data-id="edit-profile-btn"]');
  const modal = document.querySelector('[data-id="edit-profile-modal"]');
  const closeBtn = document.querySelector('[data-id="close-edit-modal"]');
  const cancelBtn = document.querySelector('[data-id="cancel-edit"]');
  const form = document.querySelector('[data-id="edit-profile-form"]');
  
  // Open modal
  editBtn?.addEventListener('click', () => {
    modal?.classList.remove('hidden');
  });
  
  // Close modal
  [closeBtn, cancelBtn].forEach(btn => {
    btn?.addEventListener('click', () => {
      modal?.classList.add('hidden');
    });
  });
  
  // Close on backdrop click
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
  
  // Handle form submit
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProfileChanges();
    modal?.classList.add('hidden');
  });
}

function saveProfileChanges() {
  const name = document.querySelector('[data-id="edit-name"]')?.value;
  const username = document.querySelector('[data-id="edit-username"]')?.value;
  const bio = document.querySelector('[data-id="edit-bio"]')?.value;
  const website = document.querySelector('[data-id="edit-website"]')?.value;
  
  // Update profile display
  if (name || username) {
    const usernameElement = document.querySelector('[data-id="profile-username"]');
    if (usernameElement) usernameElement.textContent = username || name;
  }
  
  if (bio) {
    const bioElement = document.querySelector('[data-id="profile-bio"]');
    if (bioElement) {
      bioElement.innerHTML = `
        <h2 class="font-semibold mb-1">${name}</h2>
        <p class="mb-2">${bio}</p>
        ${website ? `<p class="text-blue-600">${website}</p>` : ''}
      `;
    }
  }
  
  console.log('Profile updated:', { name, username, bio, website });
}

async function loadUserPosts() {
  const grid = document.querySelector('[data-id="posts-grid"]');
  const emptyState = document.querySelector('[data-id="empty-state"]');
  
  if (!grid) return;
  
  try {
    const posts = await getUserPosts();
    
    if (posts.length === 0) {
      emptyState?.classList.remove('hidden');
      return;
    }
    
    grid.innerHTML = posts.map(post => `
      <div data-id="profile-post-${post.id}" data-runtime="true" class="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group relative">
        <img src="${post.image}" alt="Post" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200">
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center">
          <div class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-4">
            <div class="flex items-center space-x-1">
              <i data-lucide="heart" class="w-5 h-5 fill-current"></i>
              <span class="font-semibold">${post.likes}</span>
            </div>
            <div class="flex items-center space-x-1">
              <i data-lucide="message-circle" class="w-5 h-5 fill-current"></i>
              <span class="font-semibold">${post.comments}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    
    // Re-initialize icons for new content
    lucide.createIcons();
    
  } catch (error) {
    console.error('Failed to load user posts:', error);
    emptyState?.classList.remove('hidden');
  }
}

function loadTabContent(tabName) {
  const grid = document.querySelector('[data-id="posts-grid"]');
  const emptyState = document.querySelector('[data-id="empty-state"]');
  
  if (!grid) return;
  
  switch (tabName) {
    case 'posts':
      loadUserPosts();
      break;
    case 'reels':
      grid.innerHTML = '<div class="col-span-3 text-center py-12 text-gray-500">No reels yet</div>';
      emptyState?.classList.add('hidden');
      break;
    case 'tagged':
      grid.innerHTML = '<div class="col-span-3 text-center py-12 text-gray-500">No tagged posts yet</div>';
      emptyState?.classList.add('hidden');
      break;
  }
}

async function getUserPosts() {
  // Mock user posts data
  const posts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
      likes: 342,
      comments: 23
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop',
      likes: 89,
      comments: 12
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      likes: 156,
      comments: 8
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop',
      likes: 234,
      comments: 34
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=300&h=300&fit=crop',
      likes: 445,
      comments: 67
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=300&h=300&fit=crop',
      likes: 123,
      comments: 19
    }
  ];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return posts;
}