"use client";

import { useRouter } from "next/navigation";
import { useCreateProductMutation } from "@/app/redux/features/products/productsApi";
import { useForm, useFieldArray, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useModal } from "@/app/providers/ModalContext";
import { useEffect, useState } from "react";
import Image from "next/image";

const productSchema = z.object({
    name: z.string().min(1, "Product name is required").max(100),
    desc: z.string().min(1, "Description is required").max(500),
    details: z.string().min(1, "Product details are required"),
    sizes: z
        .array(
            z.object({
                mg: z.number().positive("Size must be greater than 0"),
                price: z.number().positive("Price must be greater than 0"),
                quantity: z.number().min(0, "Quantity cannot be negative"),
            }),
        )
        .min(1, "At least one size is required")
        .refine((sizes) => {
            // Check for duplicate mg values
            const mgs = sizes.map((s) => s.mg);
            return new Set(mgs).size === mgs.length;
        }, "Duplicate mg values are not allowed"),
    references: z
        .array(
            z.object({
                url: z.string(),
                title: z.string(),
            }),
        )
        .default([]),
    // COA and image are files, not validated by zod
});

type ProductFormData = {
    name: string;
    desc: string;
    details: string;
    sizes: Array<{
        mg: number;
        price: number;
        quantity: number;
    }>;
    references: Array<{
        url: string;
        title: string;
    }>;
};

const CreateProductPage = () => {
    const { showModal } = useModal();
    const router = useRouter();
    const [createProduct, { isLoading }] = useCreateProductMutation();

    // File states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [coaFile, setCoaFile] = useState<File | null>(null);
    const [coaPreview, setCoaPreview] = useState<string | null>(null);
    const [coaPdfUrl, setCoaPdfUrl] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        trigger,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: "",
            desc: "",
            details: "",
            sizes: [{ mg: 10, price: 0, quantity: 0 }],
            references: [],
        },
    });

    const {
        fields: sizeFields,
        append: appendSize,
        remove: removeSize,
    } = useFieldArray({
        control,
        name: "sizes",
    });

    const {
        fields: refFields,
        append: appendRef,
        remove: removeRef,
    } = useFieldArray({
        control,
        name: "references",
    });

    // Watch sizes to check for duplicates in real-time
    const sizes = watch("sizes");

    // Function to find duplicate mg indices
    const getDuplicateMgIndices = () => {
        if (!sizes) return [];

        const mgMap = new Map();
        const duplicates: number[] = [];

        sizes.forEach((size, index) => {
            if (size.mg) {
                if (mgMap.has(size.mg)) {
                    duplicates.push(index);
                    duplicates.push(mgMap.get(size.mg));
                } else {
                    mgMap.set(size.mg, index);
                }
            }
        });

        return [...new Set(duplicates)]; // Remove duplicates from the array
    };

    const duplicateMgIndices = getDuplicateMgIndices();

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle COA file selection
    const handleCoaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoaFile(file);

            // Clean up previous PDF URL
            if (coaPdfUrl) {
                URL.revokeObjectURL(coaPdfUrl);
            }

            // Only create preview for images
            if (file.type.startsWith("image/")) {
                setCoaPdfUrl(null);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCoaPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setCoaPreview(null);
                // Create URL for PDF preview
                const url = URL.createObjectURL(file);
                setCoaPdfUrl(url);
            }
        }
    };

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            if (coaPdfUrl) {
                URL.revokeObjectURL(coaPdfUrl);
            }
        };
    }, [coaPdfUrl]);

    const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
        try {
            // Check for duplicates again before submit
            const mgs = data.sizes.map((s) => s.mg);
            if (new Set(mgs).size !== mgs.length) {
                await showModal({
                    type: "error",
                    title: "Validation Error",
                    message: "Duplicate mg values are not allowed",
                    confirmText: "OK",
                });
                return;
            }

            // Check if at least one size has quantity > 0
            // if (!data.sizes.some((s) => s.quantity > 0)) {
            //     await showModal({
            //         type: "error",
            //         title: "Validation Error",
            //         message: "At least one size must have quantity greater than 0",
            //         confirmText: "OK",
            //     });
            //     return;
            // }

            // Clean references
            const cleanReferences = data.references.filter((ref) => ref.url.trim() && ref.title.trim());

            const formData = new FormData();

            // Append all fields to FormData
            formData.append("name", data.name);
            formData.append("desc", data.desc);
            formData.append("details", data.details);
            formData.append("sizes", JSON.stringify(data.sizes));
            formData.append("references", JSON.stringify(cleanReferences));

            // Append files if they exist
            if (imageFile) {
                formData.append("image", imageFile);
            }
            if (coaFile) {
                formData.append("coa", coaFile);
            }

            // Create product
            await createProduct(formData).unwrap();

            await showModal({
                type: "success",
                title: "Success!",
                message: "Product created successfully!",
                confirmText: "Go to Products",
            });

            router.push("/admin?tab=products");
            reset();

            // Clean up
            if (coaPdfUrl) {
                URL.revokeObjectURL(coaPdfUrl);
            }
        } catch (error: any) {
            await showModal({
                type: "error",
                title: "Error",
                message: error?.data?.message || "Failed to create product",
                confirmText: "OK",
            });
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Create New Product</h1>
                        <p className="text-gray-400 mt-1">Add a new product to your store</p>
                    </div>
                    <button onClick={() => router.push("/admin?tab=products")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold">
                        Back to Products
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
                    {/* Basic Info Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>

                        <div className="space-y-4">
                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Product Name *</label>
                                <input {...register("name")} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g., Retatrutide" />
                                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Short Description *</label>
                                <textarea {...register("desc")} rows={3} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Brief description for product listings" />
                                {errors.desc && <p className="mt-1 text-sm text-red-400">{errors.desc.message}</p>}
                            </div>

                            {/* Detailed Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Detailed Description *</label>
                                <textarea {...register("details")} rows={5} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Full product details, features, usage notes..." />
                                {errors.details && <p className="mt-1 text-sm text-red-400">{errors.details.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Image Upload Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Product Image</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Upload Product Image</label>
                                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700" />
                                <p className="text-gray-400 text-sm mt-1">Accepted: JPG, PNG, WEBP (Max 10MB)</p>
                            </div>

                            {imagePreview && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-300 mb-2">Preview:</p>
                                    <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-slate-700">
                                        <Image src={imagePreview} alt="Product preview" fill className="object-cover" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COA Upload Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Certificate of Analysis (Optional)</h2>
                        <p className="text-gray-400 text-sm mb-4">Upload COA file (PDF or Image)</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Upload COA File</label>
                                <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={handleCoaChange} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700" />
                                <p className="text-gray-400 text-sm mt-1">Accepted: JPG, PNG, WEBP, PDF (Max 10MB)</p>
                            </div>

                            {/* Image Preview */}
                            {coaPreview && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-300 mb-2">Preview:</p>
                                    <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-slate-700">
                                        <Image src={coaPreview} alt="COA preview" fill className="object-cover" />
                                    </div>
                                </div>
                            )}

                            {/* PDF Preview */}
                            {coaFile && coaFile.type === "application/pdf" && coaPdfUrl && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-300 mb-2">PDF Preview:</p>
                                    <div className="p-3 bg-slate-800 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">📄</span>
                                            <div>
                                                <p className="text-sm text-gray-300">{coaFile.name}</p>
                                                <p className="text-xs text-gray-400">{(coaFile.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                        </div>
                                        <iframe src={`${coaPdfUrl}#toolbar=0&view=FitH`} className="w-full h-64 rounded-lg border border-slate-700 bg-slate-900" title="PDF Preview" />
                                        <p className="text-xs text-gray-400 mt-2">Scroll to preview • Full PDF will be uploaded</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sizes & Pricing Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Sizes & Pricing *</h2>
                            <button type="button" onClick={() => appendSize({ mg: 10, price: 0, quantity: 0 })} className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm">
                                + Add Size
                            </button>
                        </div>

                        {errors.sizes?.message && <p className="mb-4 text-sm text-red-400 bg-red-900/20 p-2 rounded-lg">{errors.sizes.message}</p>}

                        <div className="space-y-4">
                            {sizeFields.map((field, index) => {
                                const isDuplicate = duplicateMgIndices.includes(index);

                                return (
                                    <div key={field.id} className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border ${isDuplicate ? "bg-red-900/20 border-red-500" : "bg-slate-900/50 border-transparent"}`}>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Size (mg) *{isDuplicate && <span className="text-red-400 text-xs ml-2">(Duplicate)</span>}</label>
                                            <Controller
                                                name={`sizes.${index}.mg`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="number"
                                                        step="0.1"
                                                        onChange={(e) => {
                                                            field.onChange(parseFloat(e.target.value) || 0);
                                                            // Trigger validation on change
                                                            trigger();
                                                        }}
                                                        className={`w-full px-4 py-2 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDuplicate ? "bg-red-900 border-red-500" : "bg-slate-800 border-slate-700"}`}
                                                        placeholder="10"
                                                    />
                                                )}
                                            />
                                            {errors.sizes?.[index]?.mg && <p className="mt-1 text-sm text-red-400">{errors.sizes[index]?.mg?.message}</p>}
                                            {isDuplicate && !errors.sizes?.[index]?.mg && <p className="mt-1 text-sm text-red-400">This mg value is duplicated</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Price ($) *</label>
                                            <Controller
                                                name={`sizes.${index}.price`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="number"
                                                        step="0.01"
                                                        onChange={(e) => {
                                                            field.onChange(parseFloat(e.target.value) || 0);
                                                            trigger();
                                                        }}
                                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                        placeholder="129.99"
                                                    />
                                                )}
                                            />
                                            {errors.sizes?.[index]?.price && <p className="mt-1 text-sm text-red-400">{errors.sizes[index]?.price?.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Quantity *</label>
                                            <Controller
                                                name={`sizes.${index}.quantity`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="number"
                                                        step="1"
                                                        value={field.value === 0 ? 0 : field.value} // Explicitly handle 0
                                                        onChange={(e) => {
                                                            const value = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                                                            field.onChange(isNaN(value) ? 0 : value);
                                                            trigger();
                                                        }}
                                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                        placeholder="100"
                                                    />
                                                )}
                                            />
                                            {errors.sizes?.[index]?.quantity && <p className="mt-1 text-sm text-red-400">{errors.sizes[index]?.quantity?.message}</p>}
                                        </div>

                                        {sizeFields.length > 1 && (
                                            <div className="md:col-span-3 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        removeSize(index);
                                                        trigger();
                                                    }}
                                                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Stock Warning */}
                        {/* {sizes && sizes.every((s) => s.quantity === 0) && <p className="mt-4 text-sm text-yellow-400 bg-yellow-900/20 p-2 rounded-lg">⚠️ Warning: All quantities are 0. This product will not be visible to customers.</p>} */}
                    </div>

                    {/* References Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Research References</h2>
                            <button type="button" onClick={() => appendRef({ url: "", title: "" })} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm">
                                + Add Reference
                            </button>
                        </div>

                        <p className="text-gray-400 text-sm mb-4">Add PubMed or other research links (optional)</p>

                        <div className="space-y-4">
                            {refFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900/50 rounded-lg">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
                                        <input {...register(`references.${index}.url`)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="https://pubmed.ncbi.nlm.nih.gov/..." />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                        <input {...register(`references.${index}.title`)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Study title..." />
                                    </div>

                                    <div className="md:col-span-2 flex justify-end">
                                        <button type="button" onClick={() => removeRef(index)} className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-4 pt-6">
                        <button type="button" onClick={() => router.push("/admin?tab=products")} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold" disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold flex items-center gap-2" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Creating...
                                </>
                            ) : (
                                "Create Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProductPage;
