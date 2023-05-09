import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import WriteArea from "@/components/writearea";
import useMutation from "@/libs/client/useMutation";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

interface IUpload {
  name: string;
  price: number;
  description: string;
  photo: FileList;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

const Uploadstream: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<IUpload>();
  const [uploadingProduct, { loading, data }] =
    useMutation<UploadProductMutation>("/api/products");
  const onValid = async ({ name, price, description, photo }: IUpload) => {
    if (loading) return;
    if (photo && photo.length > 0) {
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      const form = new FormData();
      form.append("file", photo[0], name);
      const {
        result: { id },
      } = await (await fetch(uploadURL, { method: "POST", body: form })).json();
      uploadingProduct({ name, price, description, photoId: id });
    } else {
      uploadingProduct({ name, price, description });
    }
  };
  useEffect(() => {
    if (data?.ok) {
      console.log(data);
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);
  const photo = watch("photo");
  const [photoPreview, setPhotoPreview] = useState("");
  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);
  return (
    <Layout seotitle={"Product"} canGoBack>
      <form className="px-4 py-16 space-y-5" onSubmit={handleSubmit(onValid)}>
        <div>
          {photoPreview ? (
            <img
              src={photoPreview}
              className="w-full text-gray-600 aspect-video h-46 rounded-md"
            />
          ) : (
            <label className="w-full cursor-pointer text-gray-600 hover:border-orange-400 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                {...register("photo")}
                accept="image/*"
                className="hidden"
                type="file"
              />
            </label>
          )}
        </div>
        <div>
          <Input
            register={register("name", { required: true })}
            label="Name"
            name="name"
            type="text"
          />
        </div>
        <div>
          <Input
            register={register("price", { required: true })}
            label="Price"
            name="price"
            kind="money"
            type="number"
          />
        </div>
        <div>
          <WriteArea
            register={register("description", { required: true })}
            label={true}
            name="description"
            placeholder=""
          />
        </div>
        <Button name={loading ? "Loading...." : "Upload items"} />
      </form>
    </Layout>
  );
};

export default Uploadstream;
