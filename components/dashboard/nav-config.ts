import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Calendar,
  Car,
  CreditCard,
  DollarSign,
  FileText,
  Gauge,
  Heart,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  MessageSquare,
  Percent,
  Settings,
  Shield,
  ShieldCheck,
  Star,
  UserCog,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const CUSTOMER_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
  { label: "Vehicles", href: "/dashboard/customer/vehicles", icon: Car },
  { label: "Appointments", href: "/dashboard/customer/appointments", icon: Calendar },
  { label: "Invoices", href: "/dashboard/customer/invoices", icon: FileText },
  { label: "Addresses", href: "/dashboard/customer/addresses", icon: MapPin },
  { label: "Favorite Mechanics", href: "/dashboard/customer/favorites", icon: Heart },
  { label: "Payment Methods", href: "/dashboard/customer/payment-methods", icon: CreditCard },
  { label: "Notifications", href: "/dashboard/customer/notifications", icon: Bell },
  { label: "Reviews", href: "/dashboard/customer/reviews", icon: Star },
  { label: "Profile", href: "/dashboard/customer/profile", icon: UserCog },
];

export const MECHANIC_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard/mechanic", icon: LayoutDashboard },
  { label: "Availability", href: "/dashboard/mechanic/availability", icon: Gauge },
  { label: "Jobs", href: "/dashboard/mechanic/jobs", icon: Wrench },
  { label: "Calendar", href: "/dashboard/mechanic/calendar", icon: Calendar },
  { label: "Earnings", href: "/dashboard/mechanic/earnings", icon: Wallet },
  { label: "Payouts", href: "/dashboard/mechanic/payouts", icon: CreditCard },
  { label: "Analytics", href: "/dashboard/mechanic/analytics", icon: BarChart3 },
  { label: "Ratings", href: "/dashboard/mechanic/ratings", icon: Star },
  { label: "Messages", href: "/dashboard/mechanic/messages", icon: MessageSquare },
  { label: "Profile", href: "/dashboard/mechanic/profile", icon: UserCog },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Live Jobs Map", href: "/dashboard/admin/live-map", icon: MapPin },
  { label: "Revenue", href: "/dashboard/admin/revenue", icon: BarChart3 },
  { label: "Mechanic Approvals", href: "/dashboard/admin/mechanics", icon: ShieldCheck },
  { label: "Customers", href: "/dashboard/admin/customers", icon: Users },
  { label: "Disputes", href: "/dashboard/admin/disputes", icon: Shield },
  { label: "Coupons", href: "/dashboard/admin/coupons", icon: Percent },
  { label: "Service Categories", href: "/dashboard/admin/services", icon: Wrench },
  { label: "Pricing", href: "/dashboard/admin/pricing", icon: DollarSign },
  { label: "Support Tickets", href: "/dashboard/admin/support", icon: LifeBuoy },
  { label: "CMS", href: "/dashboard/admin/cms", icon: FileText },
  { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export const NAV_BY_ROLE = {
  customer: CUSTOMER_NAV,
  mechanic: MECHANIC_NAV,
  admin: ADMIN_NAV,
} as const;

export type DashboardRole = keyof typeof NAV_BY_ROLE;
