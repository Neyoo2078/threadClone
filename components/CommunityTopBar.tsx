'use client';
import React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { BsSearch } from 'react-icons/bs';
import { AiOutlineUsergroupAdd, AiOutlineClose } from 'react-icons/ai';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useUploadThing } from '@/lib/uploadthing';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent } from 'react';
import PhotoPicker from './PhotOPiacker';
import { Button } from '@/components/ui/button';
import { createCommunity } from '@/lib/Actions/community';
import { isBase64Image } from '@/lib/utils';

const CommunityTopBar = ({ user }: any) => {
  console.log({ user });
  const [GrabPhoto, setGrabPhoto] = useState(false);
  const [image, setimage] = useState('');
  const [inputs, setinputs] = useState({ name: '', bio: '' });
  const [ProfileFiles, setProfileFiles] = useState<File[]>([]);
  const [communityModal, setcommunityModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    if (GrabPhoto) {
      const data = document.getElementById('photo-picker') as HTMLInputElement;
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [GrabPhoto]);

  const { startUpload } = useUploadThing('media');

  const photoPickChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      setProfileFiles(Array.from(e.target.files));
      const data = document.createElement('img') as HTMLImageElement;
      reader.onload = function (event: any) {
        data.src = event.target.result;
        data.setAttribute('data-src', event.target.result);
      };
      reader.readAsDataURL(file);
      setTimeout(() => {
        setimage(data.src);
      }, 100);
    }
  };

  const handleChange = (e: any) => {
    setinputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handlesSubmit = async () => {
    try {
      setLoading(true);
      const hasImageChanged = isBase64Image(image);

      let profilepictureUrl;
      if (hasImageChanged) {
        const imgRes = await startUpload(ProfileFiles);

        if (imgRes && imgRes[0].fileUrl) {
          profilepictureUrl = imgRes[0].fileUrl;
          setimage(imgRes[0].fileUrl);
        }
      }

      await createCommunity({
        id: user._id,
        username: user.userid,
        name: inputs.name,
        bio: inputs.bio,
        image: profilepictureUrl,
        createdBy: user._id,
      });
      setinputs({ name: '', bio: '' });
      setcommunityModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between items-center">
      {GrabPhoto && <PhotoPicker change={photoPickChange} />}
      <div className="flex justify-center gap-4 items-center ">
        <BiArrowBack className="w-[20px] h-[20px]" />
        <h1>Communities</h1>
      </div>
      <div className="flex justify-center items-center gap-4 text-white">
        <BsSearch className="w-[20px] h-[20px]" />
        <AiOutlineUsergroupAdd
          className="w-[25px] h-[25px]"
          onClick={() => {
            setcommunityModal(true);
          }}
        />
      </div>
      {communityModal && (
        <div className="bg-[#00000058] text-black  fixed z-50 inset-0 justify-center flex  w-full h-full">
          <div className="bg-white w-[500px] p-5 mt-11  rounded-lg h-[500px]">
            <div className="text-black w-full flex justify-end">
              <AiOutlineClose
                className="w-[25px] h-[25px]"
                onClick={() => {
                  setcommunityModal(false);
                }}
              />
            </div>
            <h1 className="my-[10px] text-[30px] font-semibold">
              Create Community
            </h1>
            <div className="flex gap-2 flex-col items-start">
              <div className="flex gap-2">
                <div className="bg-[#878383] rounded-lg w-[50px] h-[50px]">
                  {image && (
                    <img src={image} alt="photo" className="w-full h-full" />
                  )}
                </div>
                <div className="flex flex-col  justify-center">
                  <h1 className="text-[15px]">Profile image</h1>
                  <div className="flex gap-3">
                    <h1
                      onClick={() => {
                        setGrabPhoto(true);
                      }}
                      className="text-[12px] italic cursor-pointer text-[#44abf5]"
                    >
                      Upload image
                    </h1>
                    {image && (
                      <h1
                        onClick={() => {
                          setimage('');
                        }}
                        className="text-[12px] italic cursor-pointer text-[#f54444]"
                      >
                        Remove image
                      </h1>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full flex mt-[20px] flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <Label className="my-[10px]">Community Name</Label>
                  <Input
                    className="w-full"
                    name="name"
                    onChange={handleChange}
                    value={inputs.name}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="my-[10px]"> Community Bio</Label>
                  <Textarea
                    className="resize-none"
                    name="bio"
                    onChange={handleChange}
                    value={inputs.bio}
                  />
                </div>
                <Button
                  disabled={
                    inputs.name.length < 3 ||
                    inputs.bio.length < 3 ||
                    !image ||
                    Loading
                  }
                  onClick={handlesSubmit}
                >
                  Create Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityTopBar;
