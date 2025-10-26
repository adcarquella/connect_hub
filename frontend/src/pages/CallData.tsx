import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Phone, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, isWithinInterval, parse } from "date-fns";
import { sendEncryptedData } from "../api/apiClient";
import { useToast } from "@/hooks/use-toast";

// Mock call data matching the screenshot structure


const getTypeColor = (type: string) => {
  switch (type) {
    case "Sense":
      return "bg-[#914397] text-white hover:bg-[#914397]/90";
    case "Call":
      return "bg-[#F5814E] text-foreground hover:bg-[#F5814E]/90";
    case "Attendance":
      return "bg-[rgb(148,202,102)] text-foreground hover:bg-[rgb(148,202,102)]/90";
    case "Emergency":
      return "bg-[red] text-white hover:bg-[red]/90";
    case "Fall Risk":
      return "bg-[#F8DA3C] text-foreground hover:bg-[#F8DA3C]/90";
    case "CareCall":
    case "Care Call":
      return "bg-[rgb(225,21,131)] text-white hover:bg-[rgb(225,21,131)]/90";
    case "Assistance":
      return "bg-[#F8DA3C] text-foreground hover:bg-[#F8DA3C]/90";
    case "Accessory":
      return "bg-[#914397] text-white hover:bg-[#914397]/90";
    case "Fall Emergency":
      return "bg-[red] text-white hover:bg-[red]/90";
    case "Visit":
      return "bg-[rgb(1,87,62)] text-white hover:bg-[rgb(1,87,62)]/90";
    default:
      return "bg-muted text-muted-foreground hover:bg-muted/80";
  }
};

/*
  --emergency : red;
  --call : rgba(245, 129, 78, 1);
  --sense : #914397;
  --attendance : rgb(148, 202, 102);
  --accessory : #914397;
  --assistance : #F8DA3C;
  --carecall : rgb(225, 21, 131);
  --visit: rgb(1, 87, 62);
  --all: #4cc1bd;

*/

type SortField = 'type' | 'subType' | 'location' | 'category' | 'startTime' | 'endTime' | 'duration' | 'unit';
type SortDirection = 'asc' | 'desc' | null;

const CallData = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  //  const [displayData, setDisplayData] = useState(recentCallActivity.slice(0, 10));
  //  const [totalRecords, setTotalRecords] = useState(recentCallActivity.length);
  const [displayData, setDisplayData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [dateFilter, setDateFilter] = useState("today");
  const [recentCallActivity, setRecentCallActivity] = useState([]);
  
  const totalPages = Math.ceil(totalRecords / pageSize);

  const { toast } = useToast();

  // API function to fetch paginated call data
useEffect(()=>{

    console.log("useeffect");
    sendEncryptedData("call/getdata", {})
      .then(d => {
        console.log("data", d);
        const updateData = d.map(dt=>{
          return {
                  id: dt.DBID,
                  type: dt.CallType,
                  subType: dt.CallOrigin,
                  location: dt.Room,
                  category: dt.Zone,
                  startTime: dt.StartDate,
                  endTime: dt.EndDate,
                  duration: dt.Duration,
                  unit: dt.Carer
          }
        });
        console.log("updatedData", updateData);
        setDisplayData(updateData);
      })
      .catch(e => {
        toast({ title: "Dashboard Error", description: e.toString() });
      })



},[1==1])




  


  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };


  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Call Data</h1>
            <p className="text-muted-foreground">
              Monitor and manage call data across all units
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-5 w-5" />
              <span className="text-sm font-medium">{totalRecords} calls</span>
            </div>
          </div>
        </div>

        {/* Recent Call Activity Table */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Phone className="h-5 w-5" />
              Recent Call Activity
            </CardTitle>
            <CardDescription>
              Real-time monitoring of room calls and sensor alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
  
              {/* Table */}
              <div className="rounded-md border border-border relative">
                {loading && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">
                          Type 
                      </TableHead>
                      <TableHead className="font-semibold">
                          Sub Type 
                      </TableHead>
                      <TableHead className="font-semibold">
                        Location 
                      </TableHead>
                      <TableHead className="font-semibold">
                          Category 
                      </TableHead>
                      <TableHead className="font-semibold">
                        Start Time
                      </TableHead>
                      <TableHead className="font-semibold">
                          End Time 
                      </TableHead>
                      <TableHead className="font-semibold">
                        Duration
                      </TableHead>
                      <TableHead className="font-semibold">
                         Unit
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayData.length > 0 ? (
                      displayData.map((call) => (
                        <TableRow key={call.id} className="hover:bg-muted/50">
                          <TableCell>
                            <Button
                              size="sm"
                              className={getTypeColor(call.type)}
                            >
                              {call.type}
                            </Button>
                          </TableCell>
                          <TableCell>{call.subType}</TableCell>
                          <TableCell className="font-medium">{call.location}</TableCell>
                          <TableCell>{call.category}</TableCell>
                          <TableCell className="text-muted-foreground">{call.startTime}</TableCell>
                          <TableCell className="text-muted-foreground">{call.endTime}</TableCell>
                          <TableCell className="font-mono">{call.duration}</TableCell>
                          <TableCell className="text-muted-foreground">{call.unit}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No call data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination - Bottom */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {getVisiblePages().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CallData;