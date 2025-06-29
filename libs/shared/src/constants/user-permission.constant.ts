export const USER_PERMISSIONS = [
  {
    name: 'delete',
    canDelete: true,
    description: 'Can delete Entries',
  },
  {
    name: 'create',
    canCreate: true,
    description: 'Can create new Entries',
  },
  {
    name: 'edit',
    canEdit: true,
    description: 'Can change Entries',
  },
  {
    name: 'publish',
    canPublish: true,
    description: 'Can publish Entries',
  },
  {
    name: 'unpublish',
    canUnpublish: true,
    description: 'Can unpublish Entries',
  },
  {
    name: 'invite',
    canInvite: true,
    description: 'Can invite other Users',
  },
  {
    name: 'api-details',
    canApiDetails: true,
    description: 'Can see api usage',
  },
];

export const USER_PERMISSIONS_TAGS = USER_PERMISSIONS.map(p => p.name);
