/**
 * Member Controller
 * Handles all member/census management operations
 * 
 * PHP Compatibility:
 * - membership.php (25-field census form)
 * - memberlist.php (member listing)
 * - edit_membership.php (edit census data)
 * - Userview.php (admin member view)
 */

import Member from '../models/Member.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * @desc    Get all members (paginated, searchable, filterable)
 * @route   GET /api/v1/members
 * @access  Private (Admin or User sees own family)
 * 
 * Matches: PHP memberlist.php, Userview.php
 */
export const getAllMembers = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      ward = '', 
      gender = '',
      relation = '',
      education = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = {};

    // If user (not admin), only show their family members
    if (req.user.role !== 'admin') {
      filter.Mid = req.user.memberId;
    }

    // Search across multiple fields
    if (search) {
      filter.$or = [
        { Fname: { $regex: search, $options: 'i' } },
        { Mid: { $regex: search, $options: 'i' } },
        { Aadhaar: { $regex: search, $options: 'i' } },
        { Mobile: { $regex: search, $options: 'i' } }
      ];
    }

    // Ward filter
    if (ward) {
      filter.Mward = ward;
    }

    // Gender filter
    if (gender) {
      filter.Gender = gender;
    }

    // Relation filter (head of family, spouse, etc.)
    if (relation) {
      filter.Relation = relation;
    }

    // Education filter
    if (education) {
      filter.Education = { $regex: education, $options: 'i' };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [members, totalCount] = await Promise.all([
      Member.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Member.countDocuments(filter)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      data: {
        members,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalMembers: totalCount,
          membersPerPage: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single member by ID
 * @route   GET /api/v1/members/:id
 * @access  Private (Admin or own family member)
 * 
 * Matches: PHP mprofile.php (single member view)
 */
export const getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return next(new AppError('Member not found', 404));
    }

    // Authorization: Admin can view all, user can only view own family
    if (req.user.role !== 'admin' && member.Mid !== req.user.memberId) {
      return next(new AppError('Not authorized to view this member', 403));
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new member (census entry)
 * @route   POST /api/v1/members
 * @access  Private (User for own family, Admin for any)
 * 
 * Matches: PHP membership.php (25-field census form)
 */
export const createMember = async (req, res, next) => {
  try {
    const {
      Mid,
      Fname,
      Dob,
      Gender,
      Relation,
      Mstatus,
      Occupation,
      RC,
      Education,
      Madrassa,
      Aadhaar,
      Mobile,
      Email,
      Health,
      Myear,
      Pward,
      Phouse,
      Dist,
      Area,
      Land,
      House,
      Resident,
      Address,
      Mward
    } = req.body;

    // Authorization: User can only create for their own family
    if (req.user.role !== 'admin' && Mid !== req.user.memberId) {
      return next(new AppError('Not authorized to create member for this family', 403));
    }

    // Check if member already exists (duplicate Aadhaar or exact match)
    if (Aadhaar) {
      const existingMember = await Member.findOne({ 
        Aadhaar: Aadhaar,
        Aadhaar: { $ne: '' } // Ignore empty aadhaar
      });
      
      if (existingMember) {
        return next(new AppError('Member with this Aadhaar already exists', 400));
      }
    }

    // Create new member
    const member = await Member.create({
      Mid,
      Fname,
      Dob: Dob || new Date('1970-01-01'), // Default for legacy data
      Gender,
      Relation,
      Mstatus,
      Occupation,
      RC,
      Education,
      Madrassa,
      Aadhaar,
      Mobile,
      Email,
      Health,
      Myear,
      Pward,
      Phouse,
      Dist,
      Area,
      Land,
      House,
      Resident,
      Address,
      Mward
    });

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: member
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update member
 * @route   PUT /api/v1/members/:id
 * @access  Private (User for own family, Admin for any)
 * 
 * Matches: PHP edit_membership.php, membership_edit.php
 */
export const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return next(new AppError('Member not found', 404));
    }

    // Authorization: User can only update own family members
    if (req.user.role !== 'admin' && member.Mid !== req.user.memberId) {
      return next(new AppError('Not authorized to update this member', 403));
    }

    // Check if updating Aadhaar and it's a duplicate
    if (req.body.Aadhaar && req.body.Aadhaar !== member.Aadhaar) {
      const existingMember = await Member.findOne({ 
        Aadhaar: req.body.Aadhaar,
        _id: { $ne: req.params.id },
        Aadhaar: { $ne: '' }
      });
      
      if (existingMember) {
        return next(new AppError('Another member with this Aadhaar already exists', 400));
      }
    }

    // Update member
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: updatedMember
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete member (soft delete)
 * @route   DELETE /api/v1/members/:id
 * @access  Private (Admin only)
 */
export const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return next(new AppError('Member not found', 404));
    }

    // Soft delete by marking as inactive (preserve data integrity)
    member.isActive = false;
    await member.save();

    res.status(200).json({
      success: true,
      message: 'Member deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search members (advanced search)
 * @route   GET /api/v1/members/search
 * @access  Private
 * 
 * Matches: PHP search functionality across site
 */
export const searchMembers = async (req, res, next) => {
  try {
    const { q, type = 'all' } = req.query;

    if (!q || q.trim().length === 0) {
      return next(new AppError('Search query is required', 400));
    }

    const searchQuery = q.trim();
    let filter = {};

    // If user (not admin), only search within their family
    if (req.user.role !== 'admin') {
      filter.Mid = req.user.memberId;
    }

    // Search type specific
    switch (type) {
      case 'name':
        filter.Fname = { $regex: searchQuery, $options: 'i' };
        break;
      case 'id':
        filter.Mid = { $regex: searchQuery, $options: 'i' };
        break;
      case 'aadhaar':
        filter.Aadhaar = searchQuery;
        break;
      case 'phone':
        filter.Mobile = { $regex: searchQuery, $options: 'i' };
        break;
      default:
        // Search all fields
        filter.$or = [
          { Fname: { $regex: searchQuery, $options: 'i' } },
          { Mid: { $regex: searchQuery, $options: 'i' } },
          { Aadhaar: { $regex: searchQuery, $options: 'i' } },
          { Mobile: { $regex: searchQuery, $options: 'i' } },
          { Email: { $regex: searchQuery, $options: 'i' } }
        ];
    }

    const members = await Member.find(filter).limit(50).lean();

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get family members
 * @route   GET /api/v1/members/family/:familyId
 * @access  Private (User for own family, Admin for any)
 * 
 * Matches: PHP functionality showing all family members together
 */
export const getFamilyMembers = async (req, res, next) => {
  try {
    const { familyId } = req.params;

    // Authorization: User can only view own family
    if (req.user.role !== 'admin' && familyId !== req.user.memberId) {
      return next(new AppError('Not authorized to view this family', 403));
    }

    // Get all members with this Mid (family ID)
    const members = await Member.find({ Mid: familyId }).sort({ createdAt: 1 });

    // Get user info for this family
    const user = await User.findOne({ memberId: familyId }).select('-password');

    res.status(200).json({
      success: true,
      data: {
        user,
        members,
        totalMembers: members.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get member statistics
 * @route   GET /api/v1/members/stats
 * @access  Private (Admin only)
 * 
 * Provides analytics for admin dashboard
 */
export const getMemberStats = async (req, res, next) => {
  try {
    // Total members
    const totalMembers = await Member.countDocuments();

    // Members by ward
    const membersByWard = await Member.aggregate([
      { $group: { _id: '$Mward', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Members by gender
    const membersByGender = await Member.aggregate([
      { $group: { _id: '$Gender', count: { $sum: 1 } } }
    ]);

    // Members by age group
    const currentDate = new Date();
    const membersByAge = await Member.aggregate([
      {
        $project: {
          age: {
            $divide: [
              { $subtract: [currentDate, '$Dob'] },
              365 * 24 * 60 * 60 * 1000
            ]
          }
        }
      },
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 18, 30, 45, 60, 100],
          default: 'Unknown',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    // Members by education
    const membersByEducation = await Member.aggregate([
      { $group: { _id: '$Education', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentMembers = await Member.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Members with land/house ownership
    const landOwners = await Member.countDocuments({ Land: 'Yes' });
    const houseOwners = await Member.countDocuments({ House: 'Yes' });

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        membersByWard,
        membersByGender,
        membersByAge,
        membersByEducation,
        recentMembers,
        landOwners,
        houseOwners
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk import members (for migration/admin use)
 * @route   POST /api/v1/members/import
 * @access  Private (Admin only)
 */
export const importMembers = async (req, res, next) => {
  try {
    const { members } = req.body;

    if (!Array.isArray(members) || members.length === 0) {
      return next(new AppError('Please provide an array of members to import', 400));
    }

    // Validate and insert members
    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const memberData of members) {
      try {
        // Check for duplicate Aadhaar
        if (memberData.Aadhaar) {
          const existing = await Member.findOne({ 
            Aadhaar: memberData.Aadhaar,
            Aadhaar: { $ne: '' }
          });
          if (existing) {
            results.failed++;
            results.errors.push({
              member: memberData.Fname,
              error: 'Duplicate Aadhaar'
            });
            continue;
          }
        }

        await Member.create(memberData);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          member: memberData.Fname,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Import completed: ${results.success} successful, ${results.failed} failed`,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get total count of members (for pagination calculation)
 * @route   GET /api/v1/members/count
 * @access  Private
 */
export const getMemberCount = async (req, res, next) => {
  try {
    const { ward, gender, relation } = req.query;

    // Build filter query
    const filter = {};

    // If user (not admin), only count their family members
    if (req.user.role !== 'admin') {
      filter.Mid = req.user.memberId;
    }

    // Apply filters if provided
    if (ward) filter.Mward = ward;
    if (gender) filter.Gender = gender;
    if (relation) filter.Relation = relation;

    const totalCount = await Member.countDocuments(filter);

    // Calculate how many pages needed with limit of 100
    const totalPages = Math.ceil(totalCount / 100);

    res.status(200).json({
      success: true,
      data: {
        totalMembers: totalCount,
        totalPages: totalPages,
        itemsPerPage: 100
      }
    });
  } catch (error) {
    next(error);
  }
};
