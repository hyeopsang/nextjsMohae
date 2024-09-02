import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

const UserInfo = () => {
    const { data: session } = useSession();
    const userId = session?.user?.email ?? '';
    const userImage = session?.user?.image ?? '';

    if (!session) {
        redirect('/login'); 
      }

    return (
        <div className={`w-full h-fit pt-[5px] flex flex-wrap bg-white/10 relative`}>
            <div className={`w-full border-b pb-[30px] px-[30px] border-black/15`}>
                <div className="w-full h-[150px] flex items-center">
                    <div className={`border-black/15 w-[100px] aspect-square rounded-full border-2 overflow-hidden`}>
                        <img className="w-full h-auto object-contain" src={userImage} alt="user image"/>
                    </div>
                    <p className={`text-black text-[18px] font-[600] ml-[15px]`}>
                        {userId}
                    </p>
                </div>
                <Link href={"/info"}>
                  <div className={`w-full h-[35px] py-[5px] text-center border rounded-[10px] cursor-pointer border-black/10 text-black`}>
                      프로필 수정
                  </div>
                </Link>
            </div>
        </div>
    );
}

export default UserInfo;
