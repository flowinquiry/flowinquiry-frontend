import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { teamId: string } }) => {
  redirect(`/portal/teams/${params.teamId}/dashboard`);
};

export default Page;
