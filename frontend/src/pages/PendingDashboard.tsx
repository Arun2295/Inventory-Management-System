
import { useAuth } from "../context/AuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, ShieldAlert, Package, Users, BarChart3, Truck } from "lucide-react";

export function PendingDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f0f2f5] p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-lg">
            ERP
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Inventory ERP</h1>
            <p className="text-sm text-slate-500">Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm font-medium text-slate-600 sm:block">
            Welcome, {user?.username}
          </span>
          <button
            onClick={logout}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-5xl space-y-8">
        {/* Status Banner */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 p-1 shadow-lg">
          <div className="flex h-full w-full items-center gap-4 rounded-xl bg-white/10 p-6 backdrop-blur-sm sm:px-10 sm:py-8">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-inner">
              <Clock className="h-8 w-8" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Account Under Review
              </h2>
              <p className="mt-2 text-white/90 sm:text-lg">
                Your registration was successful! An administrator needs to verify your account and assign your role before you can access the ERP system.
              </p>
            </div>
          </div>
        </div>

        {/* Company / System Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* About the System */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">About Our ERP</CardTitle>
              <CardDescription>Comprehensive management for modern business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Our Enterprise Resource Planning (ERP) system is designed to streamline operations across all departments. From inventory tracking to sales processing, it provides a centralized platform for efficient business management.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                  <Package className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-medium">Inventory Focus</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                  <Users className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-medium">CRM Integration</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                  <Truck className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-medium">Supply Chain</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                  <BarChart3 className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-medium">Real-time Analytics</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Environment & Next Steps */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">What Happens Next?</CardTitle>
              <CardDescription>Your onboarding journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-slate-600">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">1</div>
                <div>
                  <h3 className="font-semibold text-slate-800">Admin Review</h3>
                  <p className="text-sm">Our administrative team will review your account details.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">2</div>
                <div>
                  <h3 className="font-semibold text-slate-800">Role Assignment</h3>
                  <p className="text-sm">Based on your department, you'll be assigned a specific role (e.g., Sales Executive, Inventory Manager).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-400">3</div>
                <div>
                  <h3 className="font-semibold text-slate-400">System Access</h3>
                  <p className="text-sm">Once assigned, refreshing this page will grant you access to your specific dashboard and features.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-6 text-center">
          <ShieldAlert className="mx-auto mb-3 h-8 w-8 text-indigo-400" />
          <h3 className="mb-2 font-semibold text-slate-800">Need immediate access?</h3>
          <p className="text-sm text-slate-600">
            If this is urgent, please contact your department manager or IT support to expedite the role assignment process.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-indigo-700"
          >
            Check Status Again
          </button>
        </div>
      </main>
    </div>
  );
}
