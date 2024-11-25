"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";

import { Heading } from "@/components/heading";
import { ImageCropper } from "@/components/image-cropper";
import DefaultTeamLogo from "@/components/teams/team-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ExtInputField,
  ExtTextAreaField,
  FormProps,
  SubmitButton,
} from "@/components/ui/ext-form";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useImageCropper } from "@/hooks/use-image-cropper";
import { apiClient } from "@/lib/api-client";
import { validateForm } from "@/lib/validator";
import { TeamDTO, TeamDTOSchema } from "@/types/teams";

export const TeamForm = ({ initialData }: FormProps<TeamDTO>) => {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    selectedFile,
    setSelectedFile,
    isDialogOpen,
    setDialogOpen,
    getRootProps,
    getInputProps,
  } = useImageCropper();

  const form = useForm<TeamDTO>({
    resolver: zodResolver(TeamDTOSchema),
    defaultValues: initialData,
  });

  async function onSubmit(team: TeamDTO) {
    if (validateForm(team, TeamDTOSchema, form)) {
      const formData = new FormData();

      const teamJsonBlob = new Blob([JSON.stringify(team)], {
        type: "application/json",
      });
      formData.append("teamDTO", teamJsonBlob);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      if (team.id) {
        await apiClient(
          "/api/teams",
          "PUT",
          formData,
          session?.user?.accessToken,
        );
      } else {
        await apiClient(
          "/api/teams",
          "POST",
          formData,
          session?.user?.accessToken,
        );
      }

      router.push("/portal/teams");
    }
  }

  const isEdit = !!initialData;
  const title = isEdit ? `Edit team ${initialData?.name}` : "Create team";
  const description = isEdit ? "Edit team" : "Add a new team";
  const submitText = isEdit ? "Save changes" : "Create";
  const submitTextWhileLoading = isEdit ? "Saving changes ..." : "Creating ...";

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <div className="flex gap-4 py-4 flex-col md:flex-row">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {selectedFile ? (
                  <ImageCropper
                    dialogOpen={isDialogOpen}
                    setDialogOpen={setDialogOpen}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                  />
                ) : (
                  <Avatar
                    {...getRootProps()}
                    className="size-36 cursor-pointer ring-offset-2 ring-2 ring-slate-200"
                  >
                    <input {...getInputProps()} />
                    <AvatarImage
                      src={
                        initialData?.logoUrl
                          ? `/api/files/${initialData.logoUrl}`
                          : undefined
                      }
                      alt="@flexwork"
                    />
                    <AvatarFallback>
                      <DefaultTeamLogo />
                    </AvatarFallback>
                  </Avatar>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>Update Team Logo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Form {...form}>
          <form
            className="grid grid-cols-1 gap-4 w-[28rem]"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <ExtInputField
              form={form}
              required={true}
              fieldName="name"
              label="Name"
              placeholder="Team Name"
            />
            <ExtTextAreaField form={form} fieldName="slogan" label="Slogan" />
            <ExtTextAreaField
              form={form}
              fieldName="description"
              label="Description"
            />
            <div className="md:col-span-2 flex flex-row gap-4">
              <SubmitButton
                label={submitText}
                labelWhileLoading={submitTextWhileLoading}
              />
              <Button variant="secondary" onClick={() => router.back()}>
                Discard
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
