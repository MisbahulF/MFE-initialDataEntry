export type UserRole = 'sales' | 'de' | 'spv_ca' | 'ca' | 'mailingroom' | 'pemimpin' | 'adc' | 'admin';

export interface BniUserAccount {
  id: string;
  userId: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  branch: string;
  branchCode: string;
  ipAddress: string;
  loginTime: string;
  defaultRoute: string;
}
