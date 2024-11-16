import { SimpleContentView } from "@/components/admin-panel/simple-content-view";
import { TeamForm } from "@/components/teams/team-form";
import { findTeamById } from "@/lib/actions/teams.action";
import { deobfuscateToNumber, obfuscate } from "@/lib/endecode";

export default async function Page({
  params,
}: {
  params: { teamId: string | "new" };
}) {
  const team =
    params.teamId !== "new"
      ? await findTeamById(deobfuscateToNumber(params.teamId))
      : undefined;

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    ...(team
      ? [
          {
            title: `${team.name}`,
            link: `/portal/teams/${obfuscate(team.id)}`,
          },
          { title: "Edit", link: "#" },
        ]
      : [{ title: "Add", link: "#" }]),
  ];

  return (
    <SimpleContentView title="Teams" breadcrumbItems={breadcrumbItems}>
      <TeamForm initialData={team} />
    </SimpleContentView>
  );
}
