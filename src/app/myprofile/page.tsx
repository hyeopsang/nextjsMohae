import React, { useEffect } from 'react';
import MyPost from '../components/MyPost';

const MyProfile: React.FC = () => {

  
  return (
    <div className={`w-full bg-white overflow-y-scroll`}>
      <p className={`w-[35%] py-[15px] mx-auto font-[400] text-[16px] text-center text-black`}>
        프로필
      </p>
      <div 
        className={`w-[35%] h-fit overflow-hidden bg-transparent rounded-t-[25px] mx-auto border border-black/15 z-50`}
      >
        <MyPost />
      </div>
    </div>
  );
};
export default MyProfile;
