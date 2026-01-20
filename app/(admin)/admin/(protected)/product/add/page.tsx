"use client";

import { useRouter } from "next/navigation";
import { useCreateProductMutation } from "@/app/redux/features/products/productsApi";
import { useForm, useFieldArray, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useModal } from "@/app/providers/ModalContext";

const productSchema = z.object({
    name: z.string().min(1, "Product name is required").max(100),
    desc: z.string().min(1, "Description is required").max(500),
    details: z.string().min(1, "Product details are required"),
    sizes: z
        .array(
            z.object({
                mg: z.number().positive("Size must be greater than 0"),
                price: z.number().positive("Price must be greater than 0"),
            }),
        )
        .min(1, "At least one size is required"),
    references: z
        .array(
            z.object({
                url: z.string(),
                title: z.string(),
            }),
        )
        .default([]),
    coa: z
        .object({
            batchNumber: z.string(),
            purity: z.string(),
            testingDate: z.string(),
            method: z.string(),
            notes: z.string(),
        })
        .optional(),
});

// Create a separate type for form data with strict typing
type ProductFormData = {
    name: string;
    desc: string;
    details: string;
    sizes: Array<{
        mg: number;
        price: number;
    }>;
    references: Array<{
        url: string;
        title: string;
    }>;
    coa?: {
        batchNumber: string;
        purity: string;
        testingDate: string;
        method: string;
        notes: string;
    };
};

const CreateProductPage = () => {
    const { openModal } = useModal();

    const router = useRouter();
    const [createProduct, { isLoading }] = useCreateProductMutation();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema) as any, // Type assertion to fix resolver type
        defaultValues: {
            name: "",
            desc: "",
            details: "",
            sizes: [{ mg: 10, price: 0 }],
            references: [],
            coa: {
                batchNumber: "",
                purity: "",
                testingDate: "",
                method: "",
                notes: "",
            },
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

    const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
        try {
            const cleanReferences = data.references.filter((ref) => ref.url.trim() && ref.title.trim());
            const coaData = data.coa;
            const isCoaEmpty = coaData ? Object.values(coaData).every((value) => !value.trim()) : true;
            const cleanData = {
                ...data,
                references: cleanReferences,
                coa: isCoaEmpty ? undefined : coaData,
            };

            await createProduct(cleanData).unwrap();
            openModal({
                type: "success",
                title: "Success!",
                message: "Product created successfully!",
                onConfirm: () => {
                    router.push("/admin?tab=products");
                },
                confirmText: "Go to Products",
            });
            router.push("/admin?tab=products");
            reset();
        } catch (error: any) {
            openModal({
                type: "error",
                title: "Error",
                message: error?.data?.message || "Failed to create product",
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                    {/* Sizes & Pricing Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Sizes & Pricing *</h2>
                            <button type="button" onClick={() => appendSize({ mg: 10, price: 0 })} className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm">
                                + Add Size
                            </button>
                        </div>

                        {errors.sizes?.message && <p className="mb-4 text-sm text-red-400">{errors.sizes.message}</p>}

                        <div className="space-y-4">
                            {sizeFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900/50 rounded-lg">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Size (mg) *</label>
                                        <Controller name={`sizes.${index}.mg`} control={control} render={({ field }) => <input {...field} type="number" step="0.1" onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="10" />} />
                                        {errors.sizes?.[index]?.mg && <p className="mt-1 text-sm text-red-400">{errors.sizes[index]?.mg?.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Price ($) *</label>
                                        <Controller name={`sizes.${index}.price`} control={control} render={({ field }) => <input {...field} type="number" step="0.01" onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="129.99" />} />
                                        {errors.sizes?.[index]?.price && <p className="mt-1 text-sm text-red-400">{errors.sizes[index]?.price?.message}</p>}
                                    </div>

                                    {sizeFields.length > 1 && (
                                        <div className="md:col-span-2 flex justify-end">
                                            <button type="button" onClick={() => removeSize(index)} className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm">
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COA Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Certificate of Analysis (Optional)</h2>
                        <p className="text-gray-400 text-sm mb-4">COA information for product quality verification</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Batch Number</label>
                                <input {...register("coa.batchNumber")} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="PC-RET-240124" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Purity</label>
                                <input {...register("coa.purity")} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="99%" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Testing Date</label>
                                <input {...register("coa.testingDate")} type="date" className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Testing Method</label>
                                <input {...register("coa.method")} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="HPLC, Mass Spec, etc." />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Additional Notes</label>
                                <textarea {...register("coa.notes")} rows={3} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Additional COA information or remarks" />
                            </div>
                        </div>
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
                                        {errors.references?.[index]?.url && <p className="mt-1 text-sm text-red-400">{errors.references[index]?.url?.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                        <input {...register(`references.${index}.title`)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Study title..." />
                                        {errors.references?.[index]?.title && <p className="mt-1 text-sm text-red-400">{errors.references[index]?.title?.message}</p>}
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
