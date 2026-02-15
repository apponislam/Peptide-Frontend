// "use client";

// import { useRouter, useParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useGetSingleProductQuery, useUpdateProductMutation } from "@/app/redux/features/products/productsApi";
// import { useForm, useFieldArray, Controller, SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useModal } from "@/app/providers/ModalContext";
// import AdminProvider from "@/app/providers/AdminProvider";

// const productSchema = z.object({
//     name: z.string().min(1, "Product name is required").max(100),
//     desc: z.string().min(1, "Description is required").max(500),
//     details: z.string().min(1, "Product details are required"),
//     sizes: z
//         .array(
//             z.object({
//                 mg: z.number().positive("Size must be greater than 0"),
//                 price: z.number().positive("Price must be greater than 0"),
//             }),
//         )
//         .min(1, "At least one size is required"),
//     references: z
//         .array(
//             z.object({
//                 url: z.string(),
//                 title: z.string(),
//             }),
//         )
//         .default([]),
//     coa: z
//         .object({
//             batchNumber: z.string(),
//             purity: z.string(),
//             testingDate: z.string(),
//             method: z.string(),
//             notes: z.string(),
//         })
//         .optional(),
// });

// type ProductFormData = {
//     name: string;
//     desc: string;
//     details: string;
//     sizes: Array<{
//         mg: number;
//         price: number;
//     }>;
//     references: Array<{
//         url: string;
//         title: string;
//     }>;
//     coa?: {
//         batchNumber: string;
//         purity: string;
//         testingDate: string;
//         method: string;
//         notes: string;
//     };
// };

// const EditProductPage = () => {
//     const { showModal } = useModal();
//     const router = useRouter();
//     const params = useParams();
//     const productId = parseInt(params.id as string);

//     const { data: productData, isLoading: isProductLoading } = useGetSingleProductQuery(productId);
//     const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

//     const {
//         register,
//         control,
//         handleSubmit,
//         formState: { errors },
//         reset,
//         setValue,
//     } = useForm<ProductFormData>({
//         resolver: zodResolver(productSchema) as any,
//         defaultValues: {
//             name: "",
//             desc: "",
//             details: "",
//             sizes: [{ mg: 10, price: 0 }],
//             references: [],
//             coa: {
//                 batchNumber: "",
//                 purity: "",
//                 testingDate: "",
//                 method: "",
//                 notes: "",
//             },
//         },
//     });

//     const {
//         fields: sizeFields,
//         append: appendSize,
//         remove: removeSize,
//     } = useFieldArray({
//         control,
//         name: "sizes",
//     });

//     const {
//         fields: refFields,
//         append: appendRef,
//         remove: removeRef,
//     } = useFieldArray({
//         control,
//         name: "references",
//     });

//     // Set form values when product data is loaded
//     useEffect(() => {
//         if (productData?.data) {
//             const product = productData.data;

//             // Reset form with product data
//             reset({
//                 name: product.name || "",
//                 desc: product.desc || "",
//                 details: product.details || "",
//                 sizes: product.sizes || [{ mg: 10, price: 0 }],
//                 references: product.references || [],
//                 coa: product.coa || {
//                     batchNumber: "",
//                     purity: "",
//                     testingDate: "",
//                     method: "",
//                     notes: "",
//                 },
//             });
//         }
//     }, [productData, reset]);

//     const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
//         try {
//             // Clean references
//             const cleanReferences = data.references.filter((ref) => ref.url.trim() && ref.title.trim());

//             // Handle COA data
//             const coaData = data.coa;
//             const isCoaEmpty = coaData ? Object.values(coaData).every((value) => !value.trim()) : true;

//             const cleanData = {
//                 ...data,
//                 references: cleanReferences,
//                 coa: isCoaEmpty ? undefined : coaData,
//             };

//             // Update product
//             await updateProduct({ id: productId, data: cleanData }).unwrap();

//             // Show success modal and wait for user confirmation
//             await showModal({
//                 type: "success",
//                 title: "Success!",
//                 message: "Product updated successfully!",
//                 confirmText: "Go to Products",
//             });

//             // Navigate after confirmation
//             router.push("/admin?tab=products");
//         } catch (error: any) {
//             await showModal({
//                 type: "error",
//                 title: "Error",
//                 message: error?.data?.message || "Failed to update product",
//                 confirmText: "OK",
//             });
//         }
//     };

//     const handleCancel = async () => {
//         const confirmed = await showModal({
//             type: "confirm",
//             title: "Discard Changes?",
//             message: "Are you sure you want to leave? All unsaved changes will be lost.",
//             confirmText: "Yes, Discard",
//             cancelText: "Cancel",
//         });

//         if (confirmed) {
//             router.push("/admin?tab=products");
//         }
//     };

//     if (isProductLoading) {
//         return (
//             <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
//             </div>
//         );
//     }

//     if (!productData?.data) {
//         return (
//             <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-400 mb-4">Product not found</p>
//                     <button onClick={() => router.push("/admin?tab=products")} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold">
//                         Back to Products
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <AdminProvider>
//             <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
//                 <div className="max-w-4xl mx-auto">
//                     {/* Header */}
//                     <div className="flex justify-between items-center mb-8">
//                         <div>
//                             <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Product</h1>
//                             <p className="text-gray-400 mt-1">Edit existing product details</p>
//                             <p className="text-sm text-cyan-400 mt-1">Editing: {productData.data.name}</p>
//                         </div>
//                         <button onClick={handleCancel} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold">
//                             Back to Products
//                         </button>
//                     </div>

//                     {/* Form */}
//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                         {/* Basic Info Card */}
//                         <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
//                             <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>

//                             <div className="space-y-4">
//                                 {/* Product Name */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">Product Name *</label>
//                                     <input {...register("name")} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g., Retatrutide" />
//                                     {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
//                                 </div>

//                                 {/* Description */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">Short Description *</label>
//                                     <textarea {...register("desc")} rows={3} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Brief description for product listings" />
//                                     {errors.desc && <p className="mt-1 text-sm text-red-400">{errors.desc.message}</p>}
//                                 </div>

//                                 {/* Detailed Description */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">Detailed Description *</label>
//                                     <textarea {...register("details")} rows={5} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Full product details, features, usage notes..." />
//                                     {errors.details && <p className="mt-1 text-sm text-red-400">{errors.details.message}</p>}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Sizes & Pricing Card */}
//                         <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h2 className="text-xl font-bold text-white">Sizes & Pricing *</h2>
//                                 <button type="button" onClick={() => appendSize({ mg: 10, price: 0 })} className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm">
//                                     + Add Size
//                                 </button>
//                             </div>

//                             {errors.sizes?.message && <p className="mb-4 text-sm text-red-400">{errors.sizes.message}</p>}

//                             <div className="space-y-4">
//                                 {sizeFields.map((field, index) => (
//                                     <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900/50 rounded-lg">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-300 mb-1">Size (mg) *</label>
//                                             <Controller name={`sizes.${index}.mg`} control={control} render={({ field }) => <input {...field} type="number" step="0.1" onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="10" />} />
//                                             {errors.sizes?.[index]?.mg && <p className="mt-1 text-sm text-red-400">{errors.sizes[index]?.mg?.message}</p>}
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-300 mb-1">Price ($) *</label>
//                                             <Controller
//                                                 name={`sizes.${index}.price`}
//                                                 control={control}
//                                                 render={({ field }) => <input {...field} type="number" step="0.01" onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="129.99" />}
//                                             />
//                                             {errors.sizes?.[index]?.price && <p className="mt-1 text-sm text-red-400">{errors.sizes[index]?.price?.message}</p>}
//                                         </div>

//                                         {sizeFields.length > 1 && (
//                                             <div className="md:col-span-2 flex justify-end">
//                                                 <button type="button" onClick={() => removeSize(index)} className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm">
//                                                     Remove
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* COA Card */}
//                         <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
//                             <h2 className="text-xl font-bold text-white mb-4">Certificate of Analysis (Optional)</h2>
//                             <p className="text-gray-400 text-sm mb-4">COA information for product quality verification</p>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">Batch Number</label>
//                                     <input {...register("coa.batchNumber")} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="PC-RET-240124" />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">Purity</label>
//                                     <input {...register("coa.purity")} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="99%" />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">Testing Date</label>
//                                     <input {...register("coa.testingDate")} type="date" className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">Testing Method</label>
//                                     <input {...register("coa.method")} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="HPLC, Mass Spec, etc." />
//                                 </div>

//                                 <div className="md:col-span-2">
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">Additional Notes</label>
//                                     <textarea {...register("coa.notes")} rows={3} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Additional COA information or remarks" />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* References Card */}
//                         <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h2 className="text-xl font-bold text-white">Research References</h2>
//                                 <button type="button" onClick={() => appendRef({ url: "", title: "" })} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm">
//                                     + Add Reference
//                                 </button>
//                             </div>

//                             <p className="text-gray-400 text-sm mb-4">Add PubMed or other research links (optional)</p>

//                             <div className="space-y-4">
//                                 {refFields.map((field, index) => (
//                                     <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900/50 rounded-lg">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
//                                             <input {...register(`references.${index}.url`)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="https://pubmed.ncbi.nlm.nih.gov/..." />
//                                             {errors.references?.[index]?.url && <p className="mt-1 text-sm text-red-400">{errors.references[index]?.url?.message}</p>}
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
//                                             <input {...register(`references.${index}.title`)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Study title..." />
//                                             {errors.references?.[index]?.title && <p className="mt-1 text-sm text-red-400">{errors.references[index]?.title?.message}</p>}
//                                         </div>

//                                         <div className="md:col-span-2 flex justify-end">
//                                             <button type="button" onClick={() => removeRef(index)} className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm">
//                                                 Remove
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Submit Buttons */}
//                         <div className="flex justify-end gap-4 pt-6">
//                             <button type="button" onClick={handleCancel} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold" disabled={isUpdating}>
//                                 Cancel
//                             </button>
//                             <button type="submit" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold flex items-center gap-2" disabled={isUpdating}>
//                                 {isUpdating ? (
//                                     <>
//                                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                         Updating...
//                                     </>
//                                 ) : (
//                                     "Update Product"
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </AdminProvider>
//     );
// };

// export default EditProductPage;

"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useGetSingleProductQuery, useUpdateProductMutation } from "@/app/redux/features/products/productsApi";
import { useForm, useFieldArray, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useModal } from "@/app/providers/ModalContext";
import AdminProvider from "@/app/providers/AdminProvider";
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
        .min(1, "At least one size is required"),
    references: z
        .array(
            z.object({
                url: z.string(),
                title: z.string(),
            }),
        )
        .default([]),
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

const EditProductPage = () => {
    const { showModal } = useModal();
    const router = useRouter();
    const params = useParams();
    const productId = parseInt(params.id as string);

    const { data: productData, isLoading: isProductLoading } = useGetSingleProductQuery(productId);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const API_URL = process.env.NEXT_PUBLIC_BASE_API;

    // File states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [coaFile, setCoaFile] = useState<File | null>(null);
    const [coaPreview, setCoaPreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [existingCoa, setExistingCoa] = useState<any>(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
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

    // Set form values when product data is loaded
    useEffect(() => {
        if (productData?.data) {
            const product = productData.data;

            // Set existing files
            if (product.image) {
                setExistingImage(product.image);
            }
            if (product.coa) {
                setExistingCoa(product.coa);
            }

            // Reset form with product data
            reset({
                name: product.name || "",
                desc: product.desc || "",
                details: product.details || "",
                sizes: product.sizes || [{ mg: 10, price: 0, quantity: 0 }],
                references: product.references || [],
            });
        }
    }, [productData, reset]);

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
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCoaPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setCoaPreview(null);
            }
        }
    };

    const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
        try {
            // Clean references
            const cleanReferences = data.references.filter((ref) => ref.url.trim() && ref.title.trim());

            const formData = new FormData();

            // Append all fields to FormData
            formData.append("name", data.name);
            formData.append("desc", data.desc);
            formData.append("details", data.details);
            formData.append("sizes", JSON.stringify(data.sizes));
            formData.append("references", JSON.stringify(cleanReferences));

            // Append files if they exist (new uploads)
            if (imageFile) {
                formData.append("image", imageFile);
            }
            if (coaFile) {
                formData.append("coa", coaFile);
            }

            // Update product
            await updateProduct({ id: productId, data: formData }).unwrap();

            await showModal({
                type: "success",
                title: "Success!",
                message: "Product updated successfully!",
                confirmText: "Go to Products",
            });

            router.push("/admin?tab=products");
        } catch (error: any) {
            await showModal({
                type: "error",
                title: "Error",
                message: error?.data?.message || "Failed to update product",
                confirmText: "OK",
            });
        }
    };

    const handleCancel = async () => {
        const confirmed = await showModal({
            type: "confirm",
            title: "Discard Changes?",
            message: "Are you sure you want to leave? All unsaved changes will be lost.",
            confirmText: "Yes, Discard",
            cancelText: "Cancel",
        });

        if (confirmed) {
            router.push("/admin?tab=products");
        }
    };

    const removeExistingImage = () => {
        setExistingImage(null);
    };

    const removeExistingCoa = () => {
        setExistingCoa(null);
    };

    const getFullUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `${API_URL}${path}`;
    };

    if (isProductLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (!productData?.data) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 mb-4">Product not found</p>
                    <button onClick={() => router.push("/admin?tab=products")} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold">
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AdminProvider>
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Product</h1>
                            <p className="text-gray-400 mt-1">Edit existing product details</p>
                            <p className="text-sm text-cyan-400 mt-1">Editing: {productData.data.name}</p>
                        </div>
                        <button onClick={handleCancel} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold">
                            Back to Products
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
                        {/* Basic Info Card - Same as Create */}
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
                                {/* Existing Image */}
                                {existingImage && !imageFile && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-300 mb-2">Current Image:</p>
                                        <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-slate-700">
                                            <Image
                                                src={`${API_URL}${existingImage}`} // Add base URL
                                                alt="Current product"
                                                fill
                                                className="object-cover"
                                                unoptimized // Add this if images are from external source
                                            />
                                        </div>
                                        <button type="button" onClick={removeExistingImage} className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm">
                                            Remove Image
                                        </button>
                                    </div>
                                )}

                                {/* Upload New Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">{existingImage ? "Replace Image" : "Upload Product Image"}</label>
                                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700" />
                                </div>

                                {imagePreview && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-300 mb-2">New Preview:</p>
                                        <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-slate-700">
                                            <Image src={imagePreview} alt="New preview" fill className="object-cover" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* COA Upload Card */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Certificate of Analysis (Optional)</h2>

                            <div className="space-y-4">
                                {/* Existing COA */}
                                {existingCoa && !coaFile && (
                                    <div className="mb-4 p-3 bg-slate-800 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <p className="text-sm text-gray-300">
                                                    {existingCoa.mimetype?.startsWith("image/") ? "🖼️" : "📄"} {existingCoa.filename}
                                                </p>
                                                <p className="text-xs text-gray-400">{(existingCoa.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                            <button type="button" onClick={removeExistingCoa} className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm">
                                                Remove
                                            </button>
                                        </div>

                                        {/* PDF Preview */}
                                        {existingCoa.mimetype === "application/pdf" && (
                                            <div className="mt-2">
                                                <iframe src={`${getFullUrl(existingCoa.url)}#toolbar=0&view=FitH`} className="w-full h-64 rounded-lg border border-slate-700" title="PDF Preview" />
                                                <a href={getFullUrl(existingCoa.url)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center text-sm text-cyan-400 hover:text-cyan-300">
                                                    Open full PDF ↗
                                                </a>
                                            </div>
                                        )}

                                        {/* Image Preview */}
                                        {existingCoa.mimetype?.startsWith("image/") && (
                                            <div className="mt-2 relative w-48 h-48 rounded-lg overflow-hidden border border-slate-700">
                                                <Image src={getFullUrl(existingCoa.url)} alt="COA preview" fill className="object-cover" unoptimized />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Upload New COA */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">{existingCoa ? "Replace COA" : "Upload COA File"}</label>
                                    <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={handleCoaChange} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700" />
                                </div>

                                {/* New Image Preview */}
                                {coaPreview && coaFile?.type.startsWith("image/") && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-300 mb-2">Preview:</p>
                                        <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-slate-700">
                                            <Image src={coaPreview} alt="COA preview" fill className="object-cover" />
                                        </div>
                                    </div>
                                )}

                                {/* New PDF Preview */}
                                {coaFile && coaFile.type === "application/pdf" && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-300 mb-2">Preview:</p>
                                        <div className="p-3 bg-slate-800 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span>📄</span>
                                                <p className="text-sm text-gray-300">
                                                    {coaFile.name} ({(coaFile.size / 1024).toFixed(2)} KB)
                                                </p>
                                            </div>
                                            <iframe src={URL.createObjectURL(coaFile)} className="w-full h-64 rounded-lg border border-slate-700" title="PDF Preview" />
                                            <p className="text-xs text-gray-400 mt-2">Note: This is a preview. The actual file will be uploaded.</p>
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

                            {errors.sizes?.message && <p className="mb-4 text-sm text-red-400">{errors.sizes.message}</p>}

                            <div className="space-y-4">
                                {sizeFields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-900/50 rounded-lg">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Size (mg) *</label>
                                            <Controller name={`sizes.${index}.mg`} control={control} render={({ field }) => <input {...field} type="number" step="0.1" onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="10" />} />
                                            {errors.sizes?.[index]?.mg && <p className="mt-1 text-sm text-red-400">{errors.sizes[index]?.mg?.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Price ($) *</label>
                                            <Controller
                                                name={`sizes.${index}.price`}
                                                control={control}
                                                render={({ field }) => <input {...field} type="number" step="0.01" onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="129.99" />}
                                            />
                                            {errors.sizes?.[index]?.price && <p className="mt-1 text-sm text-red-400">{errors.sizes[index]?.price?.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Quantity *</label>
                                            <Controller name={`sizes.${index}.quantity`} control={control} render={({ field }) => <input {...field} type="number" step="1" onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="100" />} />
                                            {errors.sizes?.[index]?.quantity && <p className="mt-1 text-sm text-red-400">{errors.sizes[index]?.quantity?.message}</p>}
                                        </div>

                                        {sizeFields.length > 1 && (
                                            <div className="md:col-span-3 flex justify-end">
                                                <button type="button" onClick={() => removeSize(index)} className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm">
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* References Card - Same as Create */}
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
                            <button type="button" onClick={handleCancel} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold" disabled={isUpdating}>
                                Cancel
                            </button>
                            <button type="submit" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold flex items-center gap-2" disabled={isUpdating}>
                                {isUpdating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Updating...
                                    </>
                                ) : (
                                    "Update Product"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminProvider>
    );
};

export default EditProductPage;
