import { SimpleContentView } from "@/components/admin-panel/simple-content-view";
import { TeamForm } from "@/components/teams/team-form";
import { deobfuscateToNumber } from "@/lib/endecode";

export default async function Page(props: {
  params: Promise<{ teamId: string | "new" }>;
}) {
  const params = await props.params;
  const teamId =
    params.teamId !== "new" ? deobfuscateToNumber(params.teamId) : undefined;

  return (
    <SimpleContentView title="Teams">
      <TeamForm teamId={teamId} />
    </SimpleContentView>
  );
}
