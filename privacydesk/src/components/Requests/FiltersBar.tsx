import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { Label } from "@progress/kendo-react-labels";
import { Toolbar, ToolbarItem, ToolbarSeparator } from "@progress/kendo-react-buttons";

export type FilterType = "access" | "delete" | "export" | "correct" | "all";
export type FilterStatus =
	| "new"
	| "in_progress"
	| "waiting"
	| "done"
	| "rejected"
	| "all";

export interface FiltersBarProps {
	// controlled filters
	type: FilterType;
	setType: (value: FilterType) => void;
	status: FilterStatus;
	setStatus: (value: FilterStatus) => void;
	owner: string[]; // selected owners
	setOwner: (value: string[]) => void;
	dateFrom: Date | null | undefined;
	setDateFrom: (value: Date | null) => void;
	dateTo: Date | null | undefined;
	setDateTo: (value: Date | null) => void;

	// data
	owners: string[]; // available owners to choose from
}

const TYPE_OPTIONS: FilterType[] = ["access", "delete", "export", "correct", "all"];
const STATUS_OPTIONS: FilterStatus[] = [
	"new",
	"in_progress",
	"waiting",
	"done",
	"rejected",
	"all",
];

export default function FiltersBar(props: FiltersBarProps) {
	const {
		type,
		setType,
		status,
		setStatus,
		owner,
		setOwner,
		dateFrom,
		setDateFrom,
		dateTo,
		setDateTo,
		owners,
	} = props;

	return (
		<Toolbar aria-label="Request filters toolbar">
			<ToolbarItem>
				<div>
					<Label editorId="filter-type">Type</Label>
					<DropDownList
						id="filter-type"
						data={TYPE_OPTIONS}
						value={type}
						onChange={(e) => setType(e.value as FilterType)}
					/>
				</div>
			</ToolbarItem>

			<ToolbarItem>
				<div>
					<Label editorId="filter-status">Status</Label>
					<DropDownList
						id="filter-status"
						data={STATUS_OPTIONS}
						value={status}
						onChange={(e) => setStatus(e.value as FilterStatus)}
					/>
				</div>
			</ToolbarItem>

			<ToolbarItem>
				<div>
					<Label editorId="filter-owner">Owner</Label>
					<MultiSelect
						id="filter-owner"
						data={owners}
						value={owner}
						onChange={(e) => setOwner((e.value as string[]) ?? [])}
						placeholder="Select owners"
					/>
				</div>
			</ToolbarItem>

			<ToolbarSeparator />

			<ToolbarItem>
				<div>
					<Label editorId="filter-from">From</Label>
					<DatePicker
						id="filter-from"
						value={dateFrom ?? null}
						onChange={(e) => setDateFrom((e.value as Date) ?? null)}
					/>
				</div>
			</ToolbarItem>

			<ToolbarItem>
				<div>
					<Label editorId="filter-to">To</Label>
					<DatePicker
						id="filter-to"
						value={dateTo ?? null}
						onChange={(e) => setDateTo((e.value as Date) ?? null)}
					/>
				</div>
			</ToolbarItem>
		</Toolbar>
	);
}

