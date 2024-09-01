"use client";
import { useState, useRef } from "react";
import Image from "next/image";

const InfoPage = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const imgRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        if (selectedFile) {
            setFile(selectedFile);
            setImageUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleImageClick = () => {
        imgRef.current?.click();
    };

    return (
        <div className="w-full h-full bg-white flex justify-center items-center">
            <div className="w-[32%] p-[15px] h-fit rounded-[14px] bg-white/15 border border-black/20 text-black text-[14px]">
                <p>프로필 사진</p>
                <div 
                    className="w-[30%] aspect-square rounded-full bg-white mx-auto my-[15px] overflow-hidden cursor-pointer"
                    onClick={handleImageClick}
                >
                    {imageUrl ? (
                        <Image src={imageUrl} alt="Profile" className="w-full h-full object-cover"/>
                    ) : (
                        <div className="w-full h-full bg-white" />
                    )}
                </div>
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={imgRef} 
                    className="hidden" 
                    onChange={handleImageChange}
                />
                <p>이름</p>
                <input 
                    type="text" 
                    className="w-full bg-transparent focus:outline-none border-b border-black/20 py-[10px] mb-[15px]" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <p>자기소개</p>
                <input 
                    type="text" 
                    className="w-full bg-transparent focus:outline-none border-b border-black/20 py-[10px] mb-[30px]" 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
                <button 
                    className="w-full py-[10px] bg-white text-black rounded-[14px]" 
                >
                    {loading ? 'Updating...' : '완료'}
                </button>
            </div>
        </div>
    );
};

export default InfoPage;
