/**
 * Notice Model
 * Collection: notices
 * 
 * Stores notice board announcements and events
 */

export const NoticeSchema = {
  // Content
  title: 'string',                  // Notice title
  content: 'string',                // Full notice text (HTML or Markdown)
  summary: 'string',                // Short summary for cards
  
  // Priority & Display
  priority: 'string',               // "high" | "medium" | "low"
  isPinned: 'boolean',              // Show at top
  isPublished: 'boolean',           // Visible to public
  
  // Scheduling
  publishDate: 'timestamp',         // Start showing from
  expiryDate: 'timestamp',          // Stop showing after
  
  // Categorization
  category: 'string',               // "Event" | "Announcement" | "Alert"
  tags: 'array',                    // Array of tags
  
  // Attachments
  attachments: [
    {
      name: 'string',
      url: 'string',                // Firebase Storage URL
      type: 'string',               // "image" | "pdf" | "doc"
    },
  ],
  
  // Engagement
  views: 'number',                  // View counter
  
  // Audit
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  createdBy: 'string',              // UserId
  
  // Display Settings
  showOnHomepage: 'boolean',
  showInDashboard: 'boolean',
};

/**
 * Example Notice Document
 */
export const NoticeExample = {
  title: 'Eid ul-Fitr Prayer Timings',
  content: 'Eid prayers will be held at 8:00 AM on [date]. Please arrive 30 minutes early.',
  summary: 'Eid prayers at 8:00 AM',
  priority: 'high',
  isPinned: true,
  isPublished: true,
  publishDate: new Date(),
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  category: 'Event',
  tags: ['eid', 'prayer', 'timing'],
  attachments: [],
  views: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'admin_uid',
  showOnHomepage: true,
  showInDashboard: true,
};

/**
 * Firestore Indexes Required:
 * - isPublished
 * - publishDate
 * - expiryDate
 * - priority
 * - category
 * - isPinned
 * 
 * Composite Indexes:
 * - isPublished + publishDate
 * - category + publishDate
 * - isPinned + publishDate
 */
