import React, { useState } from "react";
import { Grid, GridColumn as Column, GridColumnMenuSort } from "@progress/kendo-react-grid";
import { Badge } from "@progress/kendo-react-indicators";
import { Button } from "@progress/kendo-react-buttons";
import { useNavigate } from "react-router-dom";

function SubmittedAtCell(props: any) {
  return <td>{props.dataItem.submittedAt ? new Date(props.dataItem.submittedAt).toLocaleDateString() : ""}</td>;
}

function DueAtCell(props: any) {
  return <td>{props.dataItem.dueAt ? new Date(props.dataItem.dueAt).toLocaleDateString() : ""}</td>;
}

function StatusCell(props: any) {
  return (
    <td>
      <Badge themeColor={getStatusColor(props.dataItem.status)}>
        {props.dataItem.status}
      </Badge>
    </td>
  );
}

function ActionsCellFactory(navigate: (path: string) => void) {
  return function ActionsCell(props: any) {
    return (
      <td>
        <Button
          size="small"
          onClick={() => navigate(`/case/${props.dataItem.id}`)}
          themeColor="primary"
        >
          Open
        </Button>
      </td>
    );
  };
}

export interface RequestGridProps {
  data: PrivacyRequest[];
}

interface PrivacyRequest {
  id: string;
  type: string;
  requester: {
    email: string;
  };
  submittedAt: string;
  dueAt: string;
  status: string;
  owner: string;
}

const PAGE_SIZE = 10;

export default function RequestGrid({ data }: RequestGridProps) {
  const [page, setPage] = useState({ skip: 0, take: PAGE_SIZE });
  const [sort, setSort] = useState<any[]>([]);
  const navigate = useNavigate();

  const handlePageChange = (e: any) => {
    setPage(e.page);
  };

  const handleSortChange = (e: any) => {
    setSort(e.sort);
  };

  const gridData = React.useMemo(() => {
    let items = data.slice();
    if (sort.length > 0) {
      items.sort((a, b) => {
        for (const s of sort) {
          const fieldA = s.field.split('.').reduce((o: any, i: string) => o?.[i], a);
          const fieldB = s.field.split('.').reduce((o: any, i: string) => o?.[i], b);
          if (fieldA < fieldB) return s.dir === "asc" ? -1 : 1;
          if (fieldA > fieldB) return s.dir === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return items.slice(page.skip, page.skip + page.take);
  }, [data, page, sort]);

  const total = data.length;

  return (
    <Grid
      style={{ height: "600px" }}
      data={gridData}
      skip={page.skip}
      take={page.take}
      total={total}
      pageable={{ pageSizes: false, buttonCount: 5 }}
      sortable={true}
      sort={sort}
      onSortChange={handleSortChange}
      onPageChange={handlePageChange}
      columnMenu={GridColumnMenuSort}
    >
      <Column field="id" title="ID" width="120px" columnMenu={GridColumnMenuSort} />
      <Column field="type" title="Type" width="120px" columnMenu={GridColumnMenuSort} />
      <Column field="requester.email" title="Requester Email" width="200px" columnMenu={GridColumnMenuSort} />
      <Column
        field="submittedAt"
        title="Submitted At"
        width="160px"
        cells={{ data: SubmittedAtCell }}
        columnMenu={GridColumnMenuSort}
      />
      <Column
        field="dueAt"
        title="Due At"
        width="160px"
        cells={{ data: DueAtCell }}
        columnMenu={GridColumnMenuSort}
      />
      <Column
        field="status"
        title="Status"
        width="140px"
        cells={{ data: StatusCell }}
        columnMenu={GridColumnMenuSort}
      />
      <Column field="owner" title="Owner" width="140px" columnMenu={GridColumnMenuSort} />
      <Column
        title="Actions"
        width="100px"
        cells={{ data: ActionsCellFactory(navigate) }}
      />
    </Grid>
  );
}

function getStatusColor(status: string): "success" | "warning" | "error" | "info" | undefined {
  switch (status?.toLowerCase()) {
    case "open":
      return "info";
    case "in progress":
      return "warning";
    case "closed":
      return "success";
    case "overdue":
      return "error";
    default:
      return undefined;
  }
}
