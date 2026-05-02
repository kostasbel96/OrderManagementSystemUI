import { useEffect, useState, useRef } from "react";

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
    const fetcherRef = useRef(fetcher);

    useEffect(() => {
        fetcherRef.current = fetcher;
    }, [fetcher]);

    useEffect(() => {
        if (!query.trim()) {
            setData([]);
            return;
        }

        const timeout = setTimeout(() => {
            setLoading(true);

            fetcherRef.current(query)
                .then(setData)
                .catch(console.error)
                .finally(() => setLoading(false));
        }, delay);

        return () => clearTimeout(timeout);
    }, [query, delay]); // Αφαιρέθηκε το fetcher από τις εξαρτήσεις

    return { data, loading };
}