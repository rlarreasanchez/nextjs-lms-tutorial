"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageIcon, Pencil, PlusCircle, Save } from "lucide-react";
import axios from "axios";
import { Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!!");
    }
  };

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        Course image
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center rounded-md h-60 bg-slate-200">
            <ImageIcon className="w-10 h-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
