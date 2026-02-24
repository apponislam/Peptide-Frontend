"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import { useVerifyResetPinMutation } from "@/app/redux/features/auth/authApi";

const verifyPinSchema = z.object({
    pin: z.string().length(6, "PIN must be 6 digits"),
});

type VerifyPinFormData = z.infer<typeof verifyPinSchema>;

export default function VerifyPinPage() {
    const router = useRouter();
    // const [verifyPin, { isLoading }] = useVerifyResetPinMutation();
    const [error, setError] = useState("");
    const [pinDigits, setPinDigits] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const {
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<VerifyPinFormData>({
        resolver: zodResolver(verifyPinSchema),
    });

    // Handle pin digit input
    const handlePinChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.charAt(0);
        }

        if (value && !/^\d+$/.test(value)) return;

        const newPinDigits = [...pinDigits];
        newPinDigits[index] = value;
        setPinDigits(newPinDigits);

        // Update form value
        const fullPin = newPinDigits.join("");
        setValue("pin", fullPin, { shouldValidate: true });

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const onSubmit = async (data: VerifyPinFormData) => {
        setError("");

        try {
            // await verifyPin({ pin: data.pin }).unwrap();
            router.push("/auth/reset-password");
        } catch (err: any) {
            setError(err?.data?.message || "Invalid verification code");

            // Clear PIN on error
            setPinDigits(["", "", "", "", "", ""]);
            setValue("pin", "");
            inputRefs.current[0]?.focus();
        }
    };

    // Auto-submit when 6 digits are entered
    useEffect(() => {
        const fullPin = pinDigits.join("");
        if (fullPin.length === 6) {
            handleSubmit(onSubmit)();
        }
    }, [pinDigits]);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={0} height={0} sizes="100vw" className="h-16 md:h-20 w-auto" priority />
                    </div>
                    <p className="text-gray-400 text-base">Enter verification code</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {/* Verify PIN Form */}
                <div className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-700">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Verify Code</h2>
                    <p className="text-gray-400 text-sm mb-6">We've sent a 6-digit code to your email</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-6">
                            <div className="flex justify-between gap-2">
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        value={pinDigits[index]}
                                        onChange={(e) => handlePinChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-xl font-bold bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                                    />
                                ))}
                            </div>
                            {errors.pin && <p className="text-red-400 text-sm mt-2 text-center">{errors.pin.message}</p>}
                        </div>

                        {/* <button type="submit" disabled={isLoading || pinDigits.join("").length !== 6} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50 cursor-pointer">
                            {isLoading ? "Verifying..." : "Verify Code"}
                        </button> */}
                        <button type="submit" disabled={pinDigits.join("").length !== 6} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50 cursor-pointer">
                            Verify Code
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                /* Resend code logic */
                            }}
                            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            Resend Code
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/auth/forgot-password" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                            ← Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
