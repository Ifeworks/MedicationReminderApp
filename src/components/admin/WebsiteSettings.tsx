import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAdminAuth } from "../../context/AdminAuthContext";
import type { BusinessInfo } from "../../types";
import Icon from "../common/Icon";
import ConfirmDialog from "../common/ConfirmDialog";

export function WebsiteSettings() {
  const { settings, updateBusinessInfo, resetToDemo, flash } = useApp();
  const { changePassword } = useAdminAuth();

  const [biz, setBiz] = useState<BusinessInfo>({ ...settings.business });
  const [isSavingBiz, setIsSavingBiz] = useState(false);

  // Password change state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [isSavingPw, setIsSavingPw] = useState(false);

  // Reset demo modal state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBiz(true);
    try {
      await updateBusinessInfo({
        ...biz,
        deliveryFee: Number(biz.deliveryFee),
      });
    } finally {
      setIsSavingBiz(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);

    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPw.length < 4) {
      setPwError("New password must be at least 4 characters.");
      return;
    }

    setIsSavingPw(true);
    try {
      await changePassword(currentPw, newPw);
      setPwSuccess(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      flash("Admin password changed successfully!");
    } catch (err: any) {
      setPwError(err?.message || "Failed to update password. Verify your current password.");
    } finally {
      setIsSavingPw(false);
    }
  };

  const handleResetData = async () => {
    await resetToDemo();
    setBiz({ ...settings.business });
  };

  return (
    <div className="space-y-8 animate-float-up">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: "var(--brown)" }}>
          Business & Website Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Configure business contacts, delivery charges, bank account details, and admin security.
        </p>
      </div>

      {/* Business Details Form */}
      <form onSubmit={handleSaveBusiness} className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-3 border-b border-border">
          <h3 className="font-serif text-xl font-bold" style={{ color: "var(--brown)" }}>
            Brand & Contact Details
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            These details are used across customer headers, footers, checkout and WhatsApp orders.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Business Name *
            </label>
            <input
              type="text"
              required
              value={biz.name}
              onChange={e => setBiz(p => ({ ...p, name: e.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Brand Tagline
            </label>
            <input
              type="text"
              value={biz.tagline}
              onChange={e => setBiz(p => ({ ...p, tagline: e.target.value }))}
              placeholder="Made with love"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Phone Number (Call) *
            </label>
            <input
              type="text"
              required
              value={biz.phone}
              onChange={e => setBiz(p => ({ ...p, phone: e.target.value }))}
              placeholder="0815 078 1152"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              WhatsApp Number (International format without +) *
            </label>
            <input
              type="text"
              required
              value={biz.whatsapp}
              onChange={e => setBiz(p => ({ ...p, whatsapp: e.target.value }))}
              placeholder="0815 078 1152"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Physical Location / Town *
            </label>
            <input
              type="text"
              required
              value={biz.location}
              onChange={e => setBiz(p => ({ ...p, location: e.target.value }))}
              placeholder="Ido-Ekiti, Ekiti State, Nigeria"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Operating Days
            </label>
            <input
              type="text"
              value={biz.openingDays}
              onChange={e => setBiz(p => ({ ...p, openingDays: e.target.value }))}
              placeholder="Fridays, Saturdays & Sundays"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Opening Hours
            </label>
            <input
              type="text"
              value={biz.openingHours}
              onChange={e => setBiz(p => ({ ...p, openingHours: e.target.value }))}
              placeholder="10:00 AM – 9:00 PM"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Standard Delivery Fee (₦) *
            </label>
            <input
              type="number"
              min={0}
              step={100}
              required
              value={biz.deliveryFee}
              onChange={e => setBiz(p => ({ ...p, deliveryFee: Number(e.target.value) }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Official Email
            </label>
            <input
              type="email"
              value={biz.email || ""}
              onChange={e => setBiz(p => ({ ...p, email: e.target.value }))}
              placeholder="orders@pbdelicacies.com"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="pt-6 border-t border-border space-y-4">
          <div>
            <h4 className="font-serif text-lg font-bold" style={{ color: "var(--brown)" }}>
              Bank Transfer Details (Checkout Payment)
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              These details are presented to customers who choose "Bank Transfer" at checkout.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                Bank Name
              </label>
              <input
                type="text"
                value={biz.bankName || ""}
                onChange={e => setBiz(p => ({ ...p, bankName: e.target.value }))}
                placeholder="Moniepoint / OPay / GTBank"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                Account Number
              </label>
              <input
                type="text"
                value={biz.accountNumber || ""}
                onChange={e => setBiz(p => ({ ...p, accountNumber: e.target.value }))}
                placeholder="0815 078 1152"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 font-mono"
                style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
                Account Name
              </label>
              <input
                type="text"
                value={biz.accountName || ""}
                onChange={e => setBiz(p => ({ ...p, accountName: e.target.value }))}
                placeholder="PB DELICACIES ENTERPRISE"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={isSavingBiz}
            className="px-6 py-2.5 rounded-full text-xs font-bold shadow-md transition-transform hover:scale-105 active:scale-95"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            {isSavingBiz ? "Saving..." : "Save Business Information"}
          </button>
        </div>
      </form>

      {/* Admin Password Change Form */}
      <form onSubmit={handleChangePassword} className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-5">
        <div className="pb-3 border-b border-border">
          <h3 className="font-serif text-xl font-bold" style={{ color: "var(--brown)" }}>
            Admin Security & Password
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Update the administrator login credentials for the management dashboard.
          </p>
        </div>

        {pwError && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {pwError}
          </div>
        )}

        {pwSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            Password updated successfully!
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Current Password *
            </label>
            <input
              type="password"
              required
              value={currentPw}
              onChange={e => setCurrentPw(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              New Password *
            </label>
            <input
              type="password"
              required
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSavingPw}
            className="px-6 py-2.5 rounded-full text-xs font-bold shadow-md transition-transform hover:scale-105 active:scale-95"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            {isSavingPw ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Data */}
      <div className="bg-card rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-rose-900">
              Restore Sample Demo Data
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
              Reset all menu dishes, categories, orders, customers, and website content back to the default authentic PB DELICACIES seed items.
            </p>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-5 py-2.5 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors flex-shrink-0"
          >
            Reset to Demo Defaults
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetData}
        title="Reset All Data"
        message="Are you sure you want to restore all PB DELICACIES initial catalogue dishes, categories, orders and settings? Any custom items you created will be reset."
        confirmText="Yes, Reset Everything"
      />
    </div>
  );
}

export default WebsiteSettings;
