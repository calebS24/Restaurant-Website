const ROLES = {
  CUSTOMER: 'customer',
  OWNER: 'owner',
  FRONTDESK: 'frontdesk',
  SERVICE_MANAGER: 'service_manager',
  ASSISTANT: 'assistant',
  WAITER: 'waiter',
};

const STAFF_ROLES = [
  ROLES.OWNER,
  ROLES.FRONTDESK,
  ROLES.SERVICE_MANAGER,
  ROLES.ASSISTANT,
  ROLES.WAITER,
];

function isStaffRole(role) {
  return STAFF_ROLES.includes(role);
}

module.exports = { ROLES, STAFF_ROLES, isStaffRole };
