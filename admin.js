// Admin Configuration for PGXL.WEB.ID
// This file contains admin UIDs and configuration settings

window.adminConfig = {
  // List of admin user IDs (Firebase Auth UIDs)
  admins: [
    // Add your Firebase UIDs here
    // Example: "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
    // To get your UID: 
    // 1. Login to your website with Google
    // 2. Open browser console (F12)
    // 3. Type: firebaseAuth.currentUser.uid
    // 4. Copy the UID and paste it here
  ],
  
  // Admin permissions
  permissions: {
    canAddGames: true,
    canEditGames: true,
    canDeleteGames: true,
    canBanUsers: true,
    canModerateComments: true,
    canViewReports: true,
    canManageCategories: true,
    canViewAnalytics: true,
    canEditSiteSettings: true
  },
  
  // Admin panel settings
  panelSettings: {
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
    maxItemsPerPage: 50,
    showNotifications: true,
    darkMode: true
  },
  
  // Game moderation settings
  moderation: {
    autoFlagKeywords: [
      "hack", "cheat", "crack", "pirate", "torrent",
      "illegal", "virus", "malware", "spam", "scam"
    ],
    requireManualReview: false,
    maxReportsBeforeHide: 3,
    commentMaxLength: 1000,
    maxCommentsPerUserPerDay: 10
  },
  
  // Analytics settings
  analytics: {
    trackDownloads: true,
    trackLikes: true,
    trackComments: true,
    trackUserActivity: true,
    retentionDays: 90
  },
  
  // Email notifications
  notifications: {
    onNewReport: true,
    onNewGame: false,
    onBrokenLink: true,
    email: "spctacularstudio@gmail.com"
  },
  
  // Security settings
  security: {
    require2FA: false,
    sessionTimeout: 3600, // 1 hour in seconds
    maxLoginAttempts: 5,
    ipWhitelist: [], // Empty array = all IPs allowed
    auditLog: true
  },
  
  // Site maintenance
  maintenance: {
    enabled: false,
    message: "Site is under maintenance. Please check back later.",
    allowedIPs: [] // IPs that can access during maintenance
  },
  
  // Version info
  version: "1.0.0",
  lastUpdated: new Date().toISOString()
};

// Admin utility functions
window.adminUtils = {
  // Check if user is admin
  isAdmin: function(uid) {
    return window.adminConfig.admins.includes(uid);
  },
  
  // Get admin permissions for user
  getPermissions: function(uid) {
    if (this.isAdmin(uid)) {
      return window.adminConfig.permissions;
    }
    return {};
  },
  
  // Check if user has specific permission
  hasPermission: function(uid, permission) {
    if (!this.isAdmin(uid)) return false;
    return window.adminConfig.permissions[permission] || false;
  },
  
  // Add new admin
  addAdmin: function(uid) {
    if (!window.adminConfig.admins.includes(uid)) {
      window.adminConfig.admins.push(uid);
      this.saveConfig();
      return true;
    }
    return false;
  },
  
  // Remove admin
  removeAdmin: function(uid) {
    const index = window.adminConfig.admins.indexOf(uid);
    if (index > -1) {
      window.adminConfig.admins.splice(index, 1);
      this.saveConfig();
      return true;
    }
    return false;
  },
  
  // Update permission
  updatePermission: function(permission, value) {
    if (window.adminConfig.permissions.hasOwnProperty(permission)) {
      window.adminConfig.permissions[permission] = value;
      this.saveConfig();
      return true;
    }
    return false;
  },
  
  // Save config to localStorage (for demo purposes)
  // In production, this should save to Firestore
  saveConfig: function() {
    try {
      localStorage.setItem('pgxl_admin_config', JSON.stringify(window.adminConfig));
      return true;
    } catch (e) {
      console.error('Failed to save admin config:', e);
      return false;
    }
  },
  
  // Load config from localStorage
  loadConfig: function() {
    try {
      const saved = localStorage.getItem('pgxl_admin_config');
      if (saved) {
        Object.assign(window.adminConfig, JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load admin config:', e);
    }
  },
  
  // Reset to default config
  resetConfig: function() {
    const defaultConfig = {
      admins: [],
      permissions: {
        canAddGames: true,
        canEditGames: true,
        canDeleteGames: true,
        canBanUsers: true,
        canModerateComments: true,
        canViewReports: true,
        canManageCategories: true,
        canViewAnalytics: true,
        canEditSiteSettings: true
      }
    };
    Object.assign(window.adminConfig, defaultConfig);
    this.saveConfig();
  },
  
  // Export config for backup
  exportConfig: function() {
    return JSON.stringify(window.adminConfig, null, 2);
  },
  
  // Import config from backup
  importConfig: function(configString) {
    try {
      const newConfig = JSON.parse(configString);
      Object.assign(window.adminConfig, newConfig);
      this.saveConfig();
      return true;
    } catch (e) {
      console.error('Failed to import config:', e);
      return false;
    }
  }
};

// Initialize admin config on load
document.addEventListener('DOMContentLoaded', function() {
  window.adminUtils.loadConfig();
  
  // Auto-save config when window closes
  window.addEventListener('beforeunload', function() {
    window.adminUtils.saveConfig();
  });
});

// Example usage in your main app:
// if (window.adminUtils.isAdmin(currentUser.uid)) {
//   // Show admin panel button
// }
