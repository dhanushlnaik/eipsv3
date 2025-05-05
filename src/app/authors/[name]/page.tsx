"use client"
import React from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams hook
import Author from '@/components/Author';

const Authors: React.FC = () => {
    const searchParams = useSearchParams();
    const name = searchParams?.get('name'); // Extract 'name' from the URL query parameters

    // Ensure 'name' is defined and cast to a string for safe use
    const authorName = typeof name === 'string' ? name : '';

    return (
        <>
                <Author defaultQuery={authorName} />
        </>
    );
};

export default Authors;