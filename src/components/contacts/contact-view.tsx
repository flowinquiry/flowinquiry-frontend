"use client";

import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ViewProps } from "@/components/ui/ext-form";
import {
  findNextContact,
  findPreviousContact,
} from "@/lib/actions/contacts.action";
import { obfuscate } from "@/lib/endecode";
import { navigateToRecord } from "@/lib/navigation-record";
import { ConTactDTO } from "@/types/contacts";

export const ContactView: React.FC<ViewProps<ConTactDTO>> = ({
  entity,
}: ViewProps<ConTactDTO>) => {
  const router = useRouter();
  const pathname = usePathname();

  const [contact, setContact] = useState<ConTactDTO>(entity);

  const navigateToPreviousRecord = async () => {
    const previousContact = await navigateToRecord(
      findPreviousContact,
      "You reach the first record",
      contact.id!,
    );
    setContact(previousContact);
  };

  const navigateToNextRecord = async () => {
    const nextContact = await navigateToRecord(
      findNextContact,
      "You reach the last record",
      contact.id!,
    );
    setContact(nextContact);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-row justify-between gap-4 py-4 items-center justify-center">
        <Button
          variant="outline"
          className="h-6 w-6"
          size="icon"
          onClick={navigateToPreviousRecord}
        >
          <ChevronLeft className="text-gray-400" />
        </Button>
        <div className="text-2xl w-full">
          {contact.firstName} {contact.lastName}
        </div>
        <Button
          onClick={() =>
            router.push(`/portal/contacts/${obfuscate(contact.id)}/edit`)
          }
        >
          <Edit /> Edit
        </Button>
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
              Account: <Badge variant="outline">{contact.accountName}</Badge>
            </div>
            <div>Email: {contact.email}</div>
            <div>Address Line: {contact.address}</div>
            <div>City: {contact.city}</div>
            <div>State: {contact.state}</div>
            <div>Country: {contact.country}</div>
            <div>
              Status: <Badge>{contact.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
