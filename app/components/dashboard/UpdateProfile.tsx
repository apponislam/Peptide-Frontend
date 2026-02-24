"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, User, Mail } from "lucide-react";
import { useUpdateProfileMutation } from "@/app/redux/features/auth/authApi";
import { TUser } from "@/app/redux/features/auth/authSlice";

const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

interface UpdateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: TUser;
}

export default function UpdateProfileModal({ isOpen, onClose, user }: UpdateProfileModalProps) {
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
        },
    });

    // Reset states when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setError("");
            setSuccess("");
            reset({
                name: user?.name || "",
                email: user?.email || "",
            });
        }
    }, [isOpen, user, reset]);

    const onSubmit = async (data: UpdateProfileFormData) => {
        setError("");
        setSuccess("");

        try {
            await updateProfile(data).unwrap();
            setSuccess("Profile updated successfully!");
            setTimeout(() => {
                onClose();
            }, 300);
        } catch (err: any) {
            setError(err?.data?.message || "Failed to update profile");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-xl w-full max-w-md border border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Update Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
                            <p className="text-green-300 text-sm">{success}</p>
                        </div>
                    )}

                    {/* Name Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input type="text" {...register("name")} className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" placeholder="Enter your name" disabled={isLoading || success !== ""} />
                        </div>
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input type="email" {...register("email")} className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" placeholder="Enter your email" disabled={isLoading || success !== ""} />
                        </div>
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600 transition-colors" disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading || success !== ""} className="flex-1 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50 cursor-pointer">
                            {isLoading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
