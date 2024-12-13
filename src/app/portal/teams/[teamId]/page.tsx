import { redirect } from "next/navigation";

const Page = async (props: { params: Promise<{ teamId: string }> }) => {
  const params = await props.params;
  redirect(`/portal/teams/${params.teamId}/dashboard`);
};

export default Page;
