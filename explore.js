export function initializeExplore() {
  loadExploreGrid();
  initCategoryFilters();
  initSearch();
  
  console.log('Explore page initialized');
}

function initCategoryFilters() {
  const categoryButtons = document.querySelectorAll('[data-id^="category-"]');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active state from all buttons
      categoryButtons.forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700');
      });
      
      // Add active state to clicked button
      button.classList.remove('bg-gray-100', 'text-gray-700');
      button.classList.add('bg-blue-600', 'text-white');
      
      // Get category from data-id
      const category = button.getAttribute('data-id').replace('category-', '');
      filterPostsByCategory(category);
    });
  });
}

function initSearch() {
  const searchInput = document.querySelector('[data-id="explore-search"]');
  let searchTimeout;
  
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = e.target.value.trim();
      searchPosts(query);
    }, 300);
  });
}

async function loadExploreGrid() {
  const grid = document.querySelector('[data-id="explore-grid"]');
  const loading = document.querySelector('[data-id="grid-loading"]');
  
  if (!grid) return;
  
  try {
    const posts = await getExplorePosts();
    loading?.remove();
    
    posts.forEach(post => {
      const postElement = createGridPostElement(post);
      grid.appendChild(postElement);
    });
    
  } catch (error) {
    console.error('Failed to load explore posts:', error);
    grid.innerHTML = '<div class="col-span-3 text-center py-12 text-gray-500">Failed to load posts</div>';
  }
}

function createGridPostElement(post) {
  const element = document.createElement('div');
  element.setAttribute('data-id', `explore-post-${post.id}`);
  element.setAttribute('data-runtime', 'true');
  element.className = 'aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group relative';
  
  element.innerHTML = `
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
  `;
  
  element.addEventListener('click', () => {
    // Would open post detail modal
    console.log('Opening post:', post.id);
  });
  
  return element;
}

async function getExplorePosts() {
  // Mock explore posts data
  const posts = [
    {
      id: 101,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
      likes: 342,
      comments: 23,
      category: 'photography'
    },
    {
      id: 102,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop',
      likes: 89,
      comments: 12,
      category: 'food'
    },
    {
      id: 103,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      likes: 156,
      comments: 8,
      category: 'fitness'
    },
    {
      id: 104,
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop',
      likes: 234,
      comments: 34,
      category: 'travel'
    },
    {
      id: 105,
      image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=300&h=300&fit=crop',
      likes: 445,
      comments: 67,
      category: 'food'
    },
    {
      id: 106,
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=300&h=300&fit=crop',
      likes: 123,
      comments: 19,
      category: 'photography'
    },
    {
      id: 107,
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=300&fit=crop',
      likes: 567,
      comments: 89,
      category: 'travel'
    },
    {
      id: 108,
      image: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=300&h=300&fit=crop',
      likes: 78,
      comments: 5,
      category: 'fitness'
    },
    {
      id: 109,
      image: 'https://images.unsplash.com/photo-1497436072909-f5e4be1707e5?w=300&h=300&fit=crop',
      likes: 234,
      comments: 45,
      category: 'photography'
    }
  ];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return posts;
}

function filterPostsByCategory(category) {
  const posts = document.querySelectorAll('[data-id^="explore-post-"]');
  
  posts.forEach(post => {
    if (category === 'all') {
      post.style.display = 'block';
    } else {
      // In a real app, you'd filter based on post data
      // For demo, we'll show/hide randomly
      const shouldShow = Math.random() > 0.3;
      post.style.display = shouldShow ? 'block' : 'none';
    }
  });
}

function searchPosts(query) {
  if (!query) {
    // Show all posts
    const posts = document.querySelectorAll('[data-id^="explore-post-"]');
    posts.forEach(post => post.style.display = 'block');
    return;
  }
  
  // In a real app, you'd search through post data
  // For demo, we'll filter randomly
  const posts = document.querySelectorAll('[data-id^="explore-post-"]');
  posts.forEach(post => {
    const shouldShow = Math.random() > 0.5;
    post.style.display = shouldShow ? 'block' : 'none';
  });
}