import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Download, ArrowLeft } from "lucide-react";
import type { SelectRegistration } from "@db/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { DashboardWidget } from "@/components/DashboardWidget";

export default function AdminPage() {
  const { logoutMutation } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: registrations, isLoading } = useQuery<SelectRegistration[]>({
    queryKey: ["/api/registrations"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/registrations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      toast({
        title: "Anmälan raderad",
        description: "Anmälan har raderats från systemet.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ett fel uppstod",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleExport = () => {
    if (!registrations?.length) {
      toast({
        title: "Inga anmälningar",
        description: "Det finns inga anmälningar att exportera.",
        variant: "destructive",
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      registrations.map(reg => ({
        'Förnamn': reg.firstName,
        'Efternamn': reg.lastName,
        'E-post': reg.email,
        'Pizza': reg.pizza,
        'Dryck': reg.drink,
        'Datum': new Date(reg.createdAt).toLocaleDateString()
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Anmälningar");
    XLSX.writeFile(workbook, "pizza-och-pension-anmalningar.xlsx");

    toast({
      title: "Export slutförd",
      description: "Anmälningarna har exporterats till Excel.",
    });
  };

  return (
    <div className="min-h-screen bg-red-500 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="self-start flex items-center gap-2"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Tillbaka till anmälan
            </Link>
          </Button>

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Anmälningar</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={isLoading || !registrations?.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportera till Excel
              </Button>
              <Button
                variant="outline"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                Logga ut
              </Button>
            </div>
          </div>

          {/* Add Dashboard Widget */}
          {!isLoading && registrations && (
            <div className="mb-6">
              <DashboardWidget registrations={registrations} />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Förnamn</TableHead>
                <TableHead>Efternamn</TableHead>
                <TableHead>E-post</TableHead>
                <TableHead>Pizza</TableHead>
                <TableHead>Dryck</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations?.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell>{reg.firstName}</TableCell>
                  <TableCell>{reg.lastName}</TableCell>
                  <TableCell>{reg.email}</TableCell>
                  <TableCell>{reg.pizza}</TableCell>
                  <TableCell>{reg.drink}</TableCell>
                  <TableCell>
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(reg.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}