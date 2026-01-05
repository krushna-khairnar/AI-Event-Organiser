import { useQuery , useMutation } from "convex/react"
import { useEffect, useState } from "react";
import { toast } from "sonner";


// Pages that should re-render when backend data changes
export const useConvexQuery = (query,...args) => {
    const result = useQuery(query,...args);
    const [data,setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=> {
        if(result === undefined) {
            setIsLoading(true);
        } else {
            try {
                setData(result);
                setError(null);
            } catch (err) {
                setError(err);
                toast.error(err.message);
            } finally {
                setIsLoading(false);
            }
        }
    }, [result])

    return {
        data, 
        isLoading, 
        error
    };
}

// Any action triggered by user interaction (button click, form submit)
export const useConvexMutation = (mutation) => {
    const mutationFn = useMutation(mutation);

    const [data,setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const mutate = async(...args) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mutationFn(...args);
            setData(response);
            return response;
        } catch (err) {
            setError(err);
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, data, isLoading, error};
}