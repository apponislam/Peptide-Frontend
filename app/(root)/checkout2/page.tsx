"use client";

import { useEffect, useState } from "react";

export default function Page() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchAll = async () => {
            const apiKey = "";
            const apiSecret = "";
            const auth = btoa(`${apiKey}:${apiSecret}`);

            // Step 1: Get all carriers
            const carriersRes = await fetch("https://ssapi.shipstation.com/carriers", {
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/json",
                },
            });
            const carriers = await carriersRes.json();

            // Step 2: Get packages for each carrier
            const results = await Promise.all(
                carriers.map(async (carrier: any) => {
                    const res = await fetch(`https://ssapi.shipstation.com/carriers/listpackages?carrierCode=ups`, {
                        headers: {
                            Authorization: `Basic ${auth}`,
                            "Content-Type": "application/json",
                        },
                    });
                    const packages = await res.json();
                    return {
                        carrierCode: carrier.carrierCode,
                        carrierName: carrier.name,
                        packages,
                    };
                }),
            );

            setData(results);
        };

        fetchAll();
    }, []);

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold">All Carriers & Packages</h1>
            <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
