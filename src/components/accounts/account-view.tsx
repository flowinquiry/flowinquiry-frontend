"use client";

import { ChevronLeft, ChevronRight, Edit, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { ContactsTable } from "@/components/contacts/contact-table";
import { Badge } from "@/components/ui/badge";
import { usePagePermission } from "@/hooks/use-page-permission";
import {
  findNextAccount,
  findPreviousAccount,
} from "@/lib/actions/accounts.action";
import { searchContacts } from "@/lib/actions/contacts.action";
import { obfuscate } from "@/lib/endecode";
import { navigateToRecord } from "@/lib/navigation-record";
import { cn } from "@/lib/utils";
import { AccountDTO } from "@/types/accounts";
import { PageableResult } from "@/types/commons";
import { ConTactDTO } from "@/types/contacts";
import { PermissionUtils } from "@/types/resources";

import { Button, buttonVariants } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ViewProps } from "../ui/ext-form";

export const AccountView: React.FC<ViewProps<AccountDTO>> = ({
  entity,
}: ViewProps<AccountDTO>) => {
  const permissionLevel = usePagePermission();
  const router = useRouter();
  const pathname = usePathname();
  const [account, setAccount] = useState<AccountDTO>(entity);
  const [contactPromise, setContactPromise] = useState<
    Promise<PageableResult<ConTactDTO>>
  >(
    searchContacts([
      { field: "account.id", operator: "eq", value: account.id! },
    ]),
  );

  useEffect(() => {
    if (account && pathname !== `/portal/accounts/${obfuscate(account.id)}`) {
      router.replace(`/portal/accounts/${obfuscate(account.id)}`);
    }
  }, [account, router]);

  const navigateToPreviousRecord = async () => {
    const previousAccount = await navigateToRecord(
      findPreviousAccount,
      "You reach the first record",
      account.id!,
    );
    setAccount(previousAccount);
  };

  const navigateToNextRecord = async () => {
    const nextAccount = await navigateToRecord(
      findNextAccount,
      "You reach the last record",
      account.id!,
    );
    setAccount(nextAccount);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-row justify-between gap-4 items-center justify-center">
        <Button
          variant="outline"
          className="h-6 w-6"
          size="icon"
          onClick={navigateToPreviousRecord}
        >
          <ChevronLeft className="text-gray-400" />
        </Button>
        <div className="text-2xl w-full">{account.name}</div>
        {PermissionUtils.canWrite(permissionLevel) && (
          <Button
            onClick={() =>
              router.push(`/portal/accounts/${obfuscate(account.id)}/edit`)
            }
          >
            <Edit /> Edit
          </Button>
        )}

        <Button
          variant="outline"
          className="h-6 w-6"
          size="icon"
          onClick={navigateToNextRecord}
        >
          <ChevronRight className="text-gray-400" />
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 px-4 py-4 gap-4 md:grid-cols-2">
            <div>
              Type:{" "}
              <Badge
                variant="outline"
                className="bg-amber-300 text-black dark:bg-amber-600 dark:text-white"
              >
                {account.type}
              </Badge>
            </div>
            <div>
              Industry:{" "}
              <Badge
                variant="outline"
                className="bg-amber-300 text-black dark:bg-amber-600 dark:text-white"
              >
                {account.industry}
              </Badge>
            </div>
            <div>
              Address Line: {account.addressLine1}
              {account.city ? `, ${account.city}` : ""}
              {account.state ? `, ${account.state}` : ""}
              {account.postalCode ? `, ${account.postalCode}` : ""}
              {account.country ? `, ${account.country}` : ""}
            </div>
            <div>Phone number: {account.phoneNumber}</div>
            <div>
              Status:{" "}
              <Badge
                variant="outline"
                className="bg-amber-300 text-black dark:bg-amber-600 dark:text-white"
              >
                {account.status}
              </Badge>
            </div>
            <div>
              Parent Account:{" "}
              {account.parentAccountId ? (
                <Button variant="link" className="px-0">
                  <Link
                    href={`/portal/accounts/${obfuscate(account.parentAccountId)}`}
                  >
                    {account.parentAccountName}
                  </Link>
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-row justify-between">
        <div className="text-xl w-full">Contacts</div>
        <div>
          <Link
            href={`/portal/contacts/new/edit?accountId=${obfuscate(account.id)}&&accountName=${account.name}`}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> New Contact
          </Link>
        </div>
      </div>
      <ContactsTable
        contactPromise={contactPromise}
        enableAdvancedFilter={false}
      />
    </div>
  );
};
