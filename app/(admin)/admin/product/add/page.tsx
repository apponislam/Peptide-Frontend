"use client";

import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* =========================
   ZOD SCHEMA
========================= */

const productSizeSchema = z.object({
    mg: z.coerce.number().min(1, "MG must be at least 1"),
    price: z.coerce.number().min(0, "Price must be 0 or more"),
});

const productReferenceSchema = z.object({
    url: z.string().url("Invalid URL"),
    title: z.string().min(2, "Title must be at least 2 chars"),
});

const createProductSchema = z.object({
    name: z.string().min(2, "Name is required"),
    desc: z.string().min(5, "Description is too short"),
    details: z.string().min(10, "Details are too short"),
    sizes: z.array(productSizeSchema).min(1, "At least one size required"),
    references: z.array(productReferenceSchema).optional(),
});

/* 🔑 IMPORTANT TYPES */
type ProductFormInput = z.input<typeof createProductSchema>;
type ProductFormOutput = z.output<typeof createProductSchema>;

/* =========================
   COMPONENT
========================= */

export default function ProductCreateForm() {
    const form = useForm<ProductFormInput>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: "",
            desc: "",
            details: "",
            sizes: [{ mg: 10, price: 0 }],
            references: [],
        },
    });

    const { control, register, handleSubmit, formState } = form;
    const { errors } = formState;

    const { fields: sizeFields, append: addSize, remove: removeSize } = useFieldArray({ control, name: "sizes" });

    const { fields: refFields, append: addRef, remove: removeRef } = useFieldArray({ control, name: "references" });

    const onSubmit: SubmitHandler<ProductFormInput> = (data) => {
        const parsed: ProductFormOutput = createProductSchema.parse(data);
        console.log("FINAL CLEAN PAYLOAD:", parsed);
    };

    return (
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-2">Create Product</h2>
            <p className="text-gray-500 mb-6">Add product information and sizes</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input {...register("name")} className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Example: Protein Powder" />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Short Description</label>
                    <textarea {...register("desc")} className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Short description..." rows={2} />
                    {errors.desc && <p className="mt-1 text-sm text-red-500">{errors.desc.message}</p>}
                </div>

                {/* Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Details</label>
                    <textarea {...register("details")} className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Long details..." rows={4} />
                    {errors.details && <p className="mt-1 text-sm text-red-500">{errors.details.message}</p>}
                </div>

                {/* Sizes */}
                <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Sizes</h3>
                        <button type="button" className="px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={() => addSize({ mg: 10, price: 0 })}>
                            + Add Size
                        </button>
                    </div>

                    {sizeFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-3 gap-3 mb-3 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">MG</label>
                                <input type="number" {...register(`sizes.${index}.mg`)} className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500" />
                                {errors.sizes?.[index]?.mg && <p className="mt-1 text-sm text-red-500">{errors.sizes[index]?.mg?.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input type="number" {...register(`sizes.${index}.price`)} className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500" />
                                {errors.sizes?.[index]?.price && <p className="mt-1 text-sm text-red-500">{errors.sizes[index]?.price?.message}</p>}
                            </div>

                            <button type="button" className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={() => removeSize(index)}>
                                Remove
                            </button>
                        </div>
                    ))}

                    {errors.sizes && <p className="text-sm text-red-500">{errors.sizes.message}</p>}
                </div>

                {/* References */}
                <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">References</h3>
                        <button type="button" className="px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={() => addRef({ url: "", title: "" })}>
                            + Add Reference
                        </button>
                    </div>

                    {refFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-3 gap-3 mb-3 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">URL</label>
                                <input {...register(`references.${index}.url`)} className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="https://example.com" />
                                {errors.references?.[index]?.url && <p className="mt-1 text-sm text-red-500">{errors.references[index]?.url?.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input {...register(`references.${index}.title`)} className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Reference title" />
                                {errors.references?.[index]?.title && <p className="mt-1 text-sm text-red-500">{errors.references[index]?.title?.message}</p>}
                            </div>

                            <button type="button" className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={() => removeRef(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Submit */}
                <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">
                    Create Product
                </button>
            </form>
        </div>
    );
}
