"use client";

import { User } from "@/app/types";
import { useState, useEffect } from "react";
import { useUpdateReferralCodeMutation, useCheckReferralCodeQuery } from "@/app/redux/features/auth/authApi";

interface InvitationCodeProps {
    user?: User | null;
}

export default function InvitationCode({ user }: InvitationCodeProps) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [newCode, setNewCode] = useState("");
    const [currentUser, setCurrentUser] = useState(user);
    const [linkCopied, setLinkCopied] = useState(false);

    // RTK Query hooks
    const [updateReferralCode, { isLoading: isUpdating }] = useUpdateReferralCodeMutation();
    const { data: checkData, isFetching: isChecking } = useCheckReferralCodeQuery(newCode, {
        skip: newCode.length < 1 || newCode === currentUser?.referralCode || !newCode.trim(),
    });

    // Extract data from response
    const isCodeAvailable = checkData?.data?.available || false;
    const cleanedCode = newCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const isAtLeast4Chars = cleanedCode.length >= 4;

    const handleUpdateCode = async (newCodeValue: string) => {
        try {
            const result = await updateReferralCode({ newCode: newCodeValue }).unwrap();

            if (result.success) {
                setCurrentUser(result.data);
            }
        } catch (error: any) {
            console.error("Error updating code:", error);
            alert(error?.data?.message || "Failed to update referral code");
        }
    };

    const handleCopyLink = () => {
        if (currentUser?.referralCode) {
            navigator.clipboard.writeText(`https://peptide.club/auth/register?ref=${currentUser.referralCode}`);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newCode.trim()) {
            alert("Please enter a referral code");
            return;
        }

        // Check if code has at least 4 characters
        if (cleanedCode.length < 4) {
            alert("Referral code must be at least 4 characters");
            return;
        }

        // Check if code is available before submitting
        if (!isCodeAvailable) {
            alert("This code is already taken. Please choose a different one.");
            return;
        }

        await handleUpdateCode(newCode.trim().toUpperCase());
        setShowEditModal(false);
        setNewCode("");
    };

    const handleInputChange = (value: string) => {
        const cleanedValue = value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .substring(0, 20);
        setNewCode(cleanedValue);
    };

    // Reset newCode when modal opens
    useEffect(() => {
        if (showEditModal) {
            setNewCode(currentUser?.referralCode || "");
        }
    }, [showEditModal, currentUser]);

    return (
        <>
            <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700 mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Your Invitation Code</h2>
                        <p className="text-sm text-gray-400">Share your code and earn on every purchase</p>
                    </div>
                    <button onClick={() => setShowEditModal(true)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-cyan-400 rounded-lg text-sm font-semibold" disabled={isUpdating}>
                        {isUpdating ? "Updating..." : "✏️ Customize"}
                    </button>
                </div>

                <div className="bg-slate-900 rounded-lg p-4 mb-4">{linkCopied ? <div className="text-2xl md:text-3xl font-bold text-cyan-400 text-center tracking-wider animate-pulse">Link Copied!</div> : <div className="text-2xl md:text-3xl font-bold text-cyan-400 text-center tracking-wider">{currentUser?.referralCode || "LOADING..."}</div>}</div>

                <button onClick={handleCopyLink} disabled={!currentUser?.referralCode} className={`w-full py-3 ${currentUser?.referralCode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-800 cursor-not-allowed"} text-white rounded-lg font-semibold transition-colors`}>
                    📋 Copy Invitation Link
                </button>
            </div>

            {/* Edit Code Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
                    <div className="bg-slate-800 rounded-xl p-4 md:p-6 max-w-md w-full border border-slate-700" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Customize Your Code</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm mb-2">New Invitation Code</label>
                                <input type="text" value={newCode} onChange={(e) => handleInputChange(e.target.value)} minLength={4} maxLength={20} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center text-lg md:text-xl font-bold tracking-wider" placeholder={currentUser?.referralCode || "ENTER CODE"} />

                                {/* Availability status */}
                                {newCode.length > 0 && newCode !== currentUser?.referralCode && (
                                    <div className="mt-2">
                                        {isChecking ? <p className="text-xs text-gray-400">Checking availability...</p> : <>{!isAtLeast4Chars ? <p className="text-xs text-red-400 font-semibold">Code must be at least 4 characters</p> : <p className={`text-xs font-semibold ${isCodeAvailable ? "text-green-400" : "text-red-400"}`}>{isCodeAvailable ? "Available" : "Already taken"}</p>}</>}
                                    </div>
                                )}

                                <p className="text-xs text-gray-400 mt-2">4-20 characters • Letters and numbers only</p>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600" disabled={isUpdating}>
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50" disabled={isUpdating || isChecking || !isCodeAvailable || !isAtLeast4Chars}>
                                    {isUpdating ? "Saving..." : "Save Code"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
