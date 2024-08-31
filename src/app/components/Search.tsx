"use client"
import React, { ChangeEvent } from 'react';

interface SearchProps {
    onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };

    return (
        <div className={`w-[35%] mx-auto my-[30px] px-[15px] py-[5px] flex justify-start items-center rounded-full border-2 border-white/15`}>
            <span className={`material-symbols-outlined pl-[10px] pr-[5px] text-white/15`}>
                search
            </span>
            <input
                placeholder="내용 및 태그, 아이디 검색"
                className={`w-full focus:outline-none bg-transparent text-white`}
                onChange={handleChange}
            />
        </div>
    );
}

export default Search;
