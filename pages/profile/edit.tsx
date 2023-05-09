import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  avatar?: FileList;
  formErrors?: string;
}

interface EditProfileRes {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm();
  useEffect(() => {
    if (user?.email) setValue("email", user?.email);
    if (user?.phone) setValue("phone", user?.phone);
    if (user?.name) setValue("name", user?.name);
    if (user?.avatar) setAvatarPreview(`https://imagedelivery.net/sYiGaNmNG2M4hky1e84o2A/${user?.avatar}/avatar`)
  }, [user, setValue]);
  const [editProfile, { data, loading }] =
    useMutation<EditProfileRes>(`/api/users/me`);
  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;
    if (email === "" && phone === "" && name === "") {
      return setError("formErrors", {
        message: "Email OR phone number are required. You need to choose one.",
      });
    }
    if (avatar && avatar.length > 0 && user) {
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      const form = new FormData();
      form.append("file", avatar[0], user?.email + "");
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      console.log();
      editProfile({ email, phone, name, avatarId:id});
    } else {
      editProfile({ email, phone, name });
    }
  };
  useEffect(() => {
    if (data && !data.ok) {
      setError("formErrors", { message: data.error });
    }
  }, [data, setError]);

  const [avatarPreview, setAvatarPreview] = useState("");
  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  return (
    <Layout seotitle={"Edit"} canGoBack>
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              className="w-14 h-14 rounded-full bg-slate-500"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shodow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change photo
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <div className="space-y-1">
          <Input
            register={register("name")}
            label="Name"
            name="name"
            type="text"
          />
        </div>
        <div className="space-y-1">
          <Input
            register={register("email")}
            label="Email"
            name="email"
            type="email"
          />
        </div>
        <div className="space-y-1 pb-3">
          <Input
            register={register("phone")}
            label="Phone number"
            name="phone"
            type="number"
            kind="phone"
          />
        </div>
        {errors.formErrors ? (
          <div className="my-2 text-red-500 font-bold block">
            {errors.formErrors?.message?.toString()}
          </div>
        ) : null}
        <div>
          <Button name={loading ? "Loading" : "Edit profile"} />
        </div>
      </form>
    </Layout>
  );
};

export default EditProfile;
