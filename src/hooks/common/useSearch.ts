import { useEffect, useState } from "react";

type UseSearchOptions<T> = {
    query: string;
    fetcher: (search: string) => Promise<T[]>;
    delay?: number;
};

export function useSearch<T>({
                                 query,
                                 fetcher,
                                 delay = 300,
                             }: UseSearchOptions<T>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setData([]);
            return;
        }

        const timeout = setTimeout(() => {
            setLoading(true);

            fetcher(query)
                .then(setData)
                .catch(console.error)
                .finally(() => setLoading(false));
        }, delay);

        return () => clearTimeout(timeout);
    }, [query, fetcher, delay]);

    return { data, loading };
}