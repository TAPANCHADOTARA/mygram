export function initializeMessages() {
  loadConversations();
  initMessageInput();
  initSearch();
  
  console.log('Messages page initialized');
}

function initMessageInput() {
  const messageInput = document.querySelector('[data-id="message-input"]');
  const sendBtn = document.querySelector('[data-id="send-btn"]');
  
  // Send message on Enter key
  messageInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Send message on button click
  sendBtn?.addEventListener('click', sendMessage);
  
  function sendMessage() {
    const message = messageInput?.value.trim();
    if (!message) return;
    
    addMessageToChat(message, true);
    messageInput.value = '';
    
    // Simulate response after delay
    setTimeout(() => {
      const responses = [
        "Thanks for the message!",
        "That sounds great!",
        "I'll get back to you soon",
        "😊",
        "Awesome!"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessageToChat(randomResponse, false);
    }, 1000 + Math.random() * 2000);
  }
}

function initSearch() {
  const searchInput = document.querySelector('[data-id="message-search"]');
  let searchTimeout;
  
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = e.target.value.trim();
      filterConversations(query);
    }, 300);
  });
}

async function loadConversations() {
  const container = document.querySelector('[data-id="conversations-list"]');
  if (!container) return;
  
  try {
    const conversations = await getConversations();
    
    container.innerHTML = conversations.map(conv => `
      <div data-id="conversation-${conv.id}" data-runtime="true" class="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
        <div class="relative">
          <img src="${conv.avatar}" alt="${conv.name}" class="w-12 h-12 rounded-full object-cover">
          ${conv.online ? '<div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>' : ''}
        </div>
        <div class="ml-3 flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-sm truncate">${conv.name}</h3>
            <span class="text-xs text-gray-500">${formatTime(conv.lastMessageTime)}</span>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 truncate">${conv.lastMessage}</p>
            ${conv.unread > 0 ? `<span class="ml-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">${conv.unread}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
    
    // Add click listeners to conversations
    conversations.forEach(conv => {
      const element = document.querySelector(`[data-id="conversation-${conv.id}"]`);
      element?.addEventListener('click', () => openChat(conv));
    });
    
  } catch (error) {
    console.error('Failed to load conversations:', error);
    container.innerHTML = '<div class="p-4 text-center text-gray-500">Failed to load conversations</div>';
  }
}

function openChat(conversation) {
  const welcomeState = document.querySelector('[data-id="welcome-state"]');
  const activeChat = document.querySelector('[data-id="active-chat"]');
  const chatArea = document.querySelector('[data-id="chat-area"]');
  
  // Hide welcome state and show chat
  welcomeState?.classList.add('hidden');
  activeChat?.classList.remove('hidden');
  chatArea?.classList.remove('hidden');
  
  // Update chat header
  const chatAvatar = document.querySelector('[data-id="chat-avatar"]');
  const chatName = document.querySelector('[data-id="chat-name"]');
  
  if (chatAvatar) chatAvatar.src = conversation.avatar;
  if (chatName) chatName.textContent = conversation.name;
  
  // Load messages for this conversation
  loadChatMessages(conversation.id);
  
  // Mark conversation as read
  markAsRead(conversation.id);
}

async function loadChatMessages(conversationId) {
  const container = document.querySelector('[data-id="messages-container"]');
  if (!container) return;
  
  try {
    const messages = await getChatMessages(conversationId);
    
    container.innerHTML = messages.map(message => createMessageHTML(message)).join('');
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
    
  } catch (error) {
    console.error('Failed to load messages:', error);
  }
}

function createMessageHTML(message) {
  const isOwn = message.isOwn;
  
  return `
    <div data-id="message-${message.id}" data-runtime="true" class="flex ${isOwn ? 'justify-end' : 'justify-start'}">
      <div class="max-w-xs lg:max-w-md">
        ${message.type === 'image' ? `
          <img src="${message.content}" alt="Shared image" class="rounded-lg max-w-full">
        ` : `
          <div class="px-4 py-2 rounded-lg ${
            isOwn 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-900'
          }">
            ${message.content}
          </div>
        `}
        <p class="text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}">${formatTime(message.timestamp)}</p>
      </div>
    </div>
  `;
}

function addMessageToChat(messageContent, isOwn) {
  const container = document.querySelector('[data-id="messages-container"]');
  if (!container) return;
  
  const message = {
    id: Date.now(),
    content: messageContent,
    isOwn: isOwn,
    timestamp: new Date().toISOString(),
    type: 'text'
  };
  
  const messageHTML = createMessageHTML(message);
  container.insertAdjacentHTML('beforeend', messageHTML);
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function filterConversations(query) {
  const conversations = document.querySelectorAll('[data-id^="conversation-"]');
  
  conversations.forEach(conv => {
    const name = conv.querySelector('h3')?.textContent.toLowerCase() || '';
    const message = conv.querySelector('p')?.textContent.toLowerCase() || '';
    
    const matches = name.includes(query.toLowerCase()) || message.includes(query.toLowerCase());
    conv.style.display = matches ? 'flex' : 'none';
  });
}

function markAsRead(conversationId) {
  const conversation = document.querySelector(`[data-id="conversation-${conversationId}"]`);
  const unreadBadge = conversation?.querySelector('.bg-blue-600');
  
  if (unreadBadge) {
    unreadBadge.remove();
  }
}

async function getConversations() {
  // Mock conversations data
  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Hey! How are you doing?',
      lastMessageTime: new Date(Date.now() - 300000).toISOString(),
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Great photo! 📸',
      lastMessageTime: new Date(Date.now() - 1800000).toISOString(),
      unread: 0,
      online: true
    },
    {
      id: 3,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Thanks for sharing!',
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      unread: 1,
      online: false
    },
    {
      id: 4,
      name: 'Travel Group',
      avatar: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100&h=100&fit=crop',
      lastMessage: 'Alex: When is the next trip?',
      lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
      unread: 5,
      online: false
    }
  ];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return conversations;
}

async function getChatMessages(conversationId) {
  // Mock messages data
  const messages = [
    {
      id: 1,
      content: 'Hey there! How\'s your day going?',
      isOwn: false,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'text'
    },
    {
      id: 2,
      content: 'It\'s going great! Just posted some new photos',
      isOwn: true,
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      type: 'text'
    },
    {
      id: 3,
      content: 'Nice! I saw them. The sunset shot is amazing! 🌅',
      isOwn: false,
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      type: 'text'
    },
    {
      id: 4,
      content: 'Thank you! It was taken at the perfect moment',
      isOwn: true,
      timestamp: new Date(Date.now() - 3300000).toISOString(),
      type: 'text'
    }
  ];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return messages;
}

function formatTime(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now - time) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  
  return time.toLocaleDateString();
}