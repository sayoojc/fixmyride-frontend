import React from 'react';
import { Button } from "@/components/ui/button";

import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
  setIsAddBrandDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddModelDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  setIsAddBrandDialogOpen,
  setIsAddModelDialogOpen,
}) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Brand & Model Management</h2>
          <p className="text-sm text-slate-500">Manage car brands and models serviced</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddBrandDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Brand
          </Button>
          <Button onClick={() => setIsAddModelDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Model
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
