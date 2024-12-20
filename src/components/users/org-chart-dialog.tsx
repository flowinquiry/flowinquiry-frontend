"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrgChartView from "@/components/users/org-chart-view";

interface OrgChartDialogProps {
  userId?: number; // Optional userId, defaults to undefined for top-level org chart
  isOpen: boolean; // Whether the dialog is open
  onClose: () => void; // Callback for closing the dialog
}

const OrgChartDialog: React.FC<OrgChartDialogProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100rem] w-full">
        <DialogHeader>
          <DialogTitle>Organization Chart</DialogTitle>
        </DialogHeader>
        <OrgChartView userId={userId} />
      </DialogContent>
    </Dialog>
  );
};

export default OrgChartDialog;
