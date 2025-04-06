import React from 'react';
import { UserListContainer } from './UserList/UserListContainer';

interface UsersTabProps {
  selectedMonth: Date;
}

export function UsersTab({ selectedMonth }: UsersTabProps) {
  return <UserListContainer selectedMonth={selectedMonth} />;
}