import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

interface UserData {
    email: string;
    profilePicture: string;
}

const UserInfo = () => {
    const { data: session } = useSession();
    const [userData, setUserData] = useState<UserData | null>(null);
    const userId = session?.user?.email ?? '';
    const userImage = session?.user?.image ?? '';

    return (
        <div className={`w-full h-fit pt-[5px] flex flex-wrap bg-black/10 relative`}>
            <div className={`w-full border-b pb-[30px] px-[30px] border-white/15`}>
                <div className="w-full h-[150px] flex items-center">
                    <div className={`border-white/15 w-[100px] aspect-square rounded-full border-2 overflow-hidden`}>
                        <img className="w-full h-auto object-contain" src={userImage} alt="user image"/>
                    </div>
                    <p className={`text-white text-[18px] font-[600] ml-[15px]`}>
                        {userId}
                    </p>
                </div>
                <Link href={"/info"}>
                  <div className={`w-full h-[35px] py-[5px] text-center border rounded-[10px] cursor-pointer border-white/10 text-white`}>
                      프로필 수정
                  </div>
                </Link>
            </div>
        </div>
    );
}

export default UserInfo;
