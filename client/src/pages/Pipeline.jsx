/* eslint-disable react-hooks/exhaustive-deps */
import { FileDown, Pen, Plus, Trash2 } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import CreatePipeline from "../components/Pipeline/CreatePipeline";
import UpdatePipeline from "../components/Pipeline/UpdatePipeline";
import { readAllPipeline } from "../services/pipelineServices";
import DeletePipeline from "../components/Pipeline/DeletePipeline";
import { readAllGrm } from "../services/teamServices";
import { selectReadAllVariant } from "../services/variantServices";
import { getCurrentMonthYear } from "../utils/tools";
import { exportToWord } from "../utils/ExportToWord";


const normalizeMonthValue = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    const trimmedValue = value.trim();
    return /^\d{4}-\d{2}$/.test(trimmedValue) ? trimmedValue : "";
};

const formatExportValue = (value) => value || "-";

const buildExportSubtitle = ({ selectedMonth, search, status, grm, model }) => {
    const parts = [`Month: ${selectedMonth || "All"}`];

    if (search) parts.push(`Search: ${search}`);
    if (status && status !== "All Statuses") parts.push(`Status: ${status}`);
    if (grm && grm !== "All GRMs") parts.push(`GRM: ${grm}`);
    if (model && model !== "All Models") parts.push(`Model: ${model}`);

    return parts.join(" | ");
};

export default function Pipeline() {

    const [isLoading, setIsLoading] = useState(false);

    const PAGE_SIZE = 10;
    const STATUS_OPTIONS = [
        { value: "All Statuses", name: "All Statuses" },
        { value: "Sold", name: "Sold" },
        { value: "For Release", name: "For Release" },
        { value: "w/ Payment", name: "w/ Payment" },
        { value: "For Bank Approval", name: "For Bank Approval" },
    ];

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: PAGE_SIZE,
    });
    const [totals, setTotals] = useState({
        entries: 0,
        sold: 0,
        forRelease: 0,
        bankApproval: 0,
    });

    const [showCreate, setshowCreate] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [pipelineId, setPipelineId] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(() => getCurrentMonthYear());
    const [filters, setFilters] = useState({
        status: "All Statuses",
        grm: "All GRMs",
        model: "All Models",
    });
    const [appliedFilters, setAppliedFilters] = useState({
        search: "",
        status: "All Statuses",
        grm: "All GRMs",
        model: "All Models",
    });
    const [grmOptions, setGrmOptions] = useState([{ value: "All GRMs", name: "All GRMs" }]);
    const [modelOptions, setModelOptions] = useState([{ value: "All Models", name: "All Models" }]);

    const handleEdit = (id) => {
        setPipelineId(id);
        setShowUpdate(true);
    }

    const handleDelete = (id) => {
        setPipelineId(id);
        setShowDelete(true);

    }

    const loadTable = async (page = currentPage, activeFilters = appliedFilters) => {
        try {
            setIsLoading(true);
            const { success, message, data: pipelines = [], pagination: paginationData, totals: totalsData } = await readAllPipeline({
                page,
                limit: PAGE_SIZE,
                month: selectedMonth,
                search: activeFilters.search,
                status: activeFilters.status,
                grm: activeFilters.grm,
                model: activeFilters.model,
            });

            if (success) {
                setData(pipelines);
                setPagination(paginationData ?? {
                    totalItems: 0,
                    totalPages: 0,
                    currentPage: page,
                    pageSize: PAGE_SIZE,
                });
                setTotals(totalsData ?? {
                    entries: paginationData?.totalItems ?? 0,
                    sold: 0,
                    forRelease: 0,
                    bankApproval: 0,
                });
                setTotalPages(paginationData?.totalPages ?? 0);
                setCurrentPage(paginationData?.currentPage ?? page);
                setIsLoading(false);
                return;
            }

            console.error(message);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handlePreviousPage = () => {
        if (currentPage <= 1) {
            return;
        }

        setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage >= totalPages) {
            return;
        }

        setCurrentPage((prev) => prev + 1);
    };

    const refreshCurrentPage = async () => {
        const safePage = totalPages > 0 && currentPage > totalPages ? totalPages : currentPage;
        await loadTable(safePage || 1, appliedFilters);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        const nextFilters = {
            ...filters,
            [name]: value,
        };

        setFilters(nextFilters);

        // auto apply filters for status / grm / model
        setAppliedFilters((prev) => ({
            ...prev,
            [name]: value,
        }));

        // reset page to first when filter is updated
        setCurrentPage(1);
    };

    const handleSearch = () => {
        const nextFilters = {
            search: searchInput.trim(),
            status: filters.status,
            grm: filters.grm,
            model: filters.model,
        };

        setAppliedFilters(nextFilters);
        setCurrentPage(1);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(normalizeMonthValue(event.target.value) || getCurrentMonthYear());
    };

    const handleExport = async () => {
        try {
            setIsLoading(true);
            const { success, message, data: exportRows = [] } = await readAllPipeline({
                page: 1,
                limit: PAGE_SIZE,
                exportAll: true,
                month: selectedMonth,
                search: appliedFilters.search,
                status: appliedFilters.status,
                grm: appliedFilters.grm,
                model: appliedFilters.model,
            });

            if (!success) {
                console.error(message);
                toast.error(message || "Failed to export pipeline data.");
                return;
            }

            if (exportRows.length === 0) {
                toast.error("No pipeline data found for the selected filters.");
                return;
            }

            const headers = [
                "TARGET RELEASE",
                "VARIANT",
                "UNIT",
                "COLOR",
                "CS NUMBER",
                "TRANSACTION",
                "BANK",
                "CLIENT",
                "GRM",
                "STATUS",
                "REMARKS",
                "MONTH START",
            ];

            const rows = exportRows.map((sale) => ([
                formatExportValue(sale?.targetReleased),
                formatExportValue(sale?.unit?.variant?.name),
                formatExportValue(sale?.unit?.name),
                formatExportValue(sale?.color),
                formatExportValue(sale?.csNumber),
                formatExportValue(sale?.transaction),
                formatExportValue(sale?.bank),
                formatExportValue(sale?.client),
                formatExportValue(sale?.team?.teamLeader),
                formatExportValue(sale?.status),
                formatExportValue(sale?.remarks),
                formatExportValue(sale?.monthStart),
            ]));

            await exportToWord({
                title: "Pipeline Report",
                subtitle: buildExportSubtitle({
                    selectedMonth,
                    search: appliedFilters.search,
                    status: appliedFilters.status,
                    grm: appliedFilters.grm,
                    model: appliedFilters.model,
                }),
                headers,
                rows,
                fileName: `Pipeline_Report_${selectedMonth || "all"}`
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        queueMicrotask(() => {
            loadTable(currentPage, appliedFilters);
        })
    }, [currentPage, appliedFilters, selectedMonth]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedMonth]);

    useEffect(() => {
        try {
            setIsLoading(true);
            const loadFilterOptions = async () => {
                const [{ success: grmSuccess, message: grmMessage, grms = [] }, { success: modelSuccess, message: modelMessage, variants = [] }] = await Promise.all([
                    readAllGrm(),
                    selectReadAllVariant()
                ]);

                if (grmSuccess) {
                    setGrmOptions([
                        { value: "All GRMs", name: "All GRMs" },
                        ...grms.map((grm) => ({ value: grm.name, name: grm.name }))
                    ]);
                } else {
                    console.error(grmMessage);
                }

                if (modelSuccess) {
                    setModelOptions([
                        { value: "All Models", name: "All Models" },
                        ...variants.map((variant) => ({ value: variant.name, name: variant.name }))
                    ]);
                } else {
                    console.error(modelMessage);
                }
            };

            loadFilterOptions();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow p-8 space-y-8 overflow-auto">

                {/* header */}
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div>
                        <PageTitle>Pipeline</PageTitle>
                        <PageSubTitle>Operation transaction tracking management</PageSubTitle>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="btn bg-nissan-red text-white rounded-xl disabled:opacity-60"
                            disabled={isLoading}
                            onClick={handleExport}
                        >
                            <FileDown size={16} /> Export
                        </button>
                        <button
                            className="btn bg-nissan-red text-white rounded-xl"
                            onClick={() => setshowCreate(true)}
                        >
                            <Plus size={16} /> Add Entry
                        </button>
                    </div>
                </div>

                {/* totals */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Entries</p>
                        <h2 className="font-bold">{totals?.entries}</h2>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Sold</p>
                        <h2 className="font-bold text-green-600">{totals?.sold}</h2>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">For Release</p>
                        <h2 className="font-bold text-blue-600">{totals?.forRelease}</h2>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Bank Approval</p>
                        <h2 className="font-bold text-nissan-red">{totals?.bankApproval}</h2>
                    </div>
                </div>

                {/* Search */}
                <div className="space-y-4 rounded-xl border border-gray-300 p-4">
                    <div className="flex gap-4">
                        <div className="grow">
                            <Input
                                value={searchInput}
                                placeholder="Search by CS Number, Client, or Variant..."
                                onChange={(event) => setSearchInput(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                            />
                        </div>
                        <button
                            className="btn bg-nissan-red rounded-xl text-white"
                            onClick={handleSearch}
                            disabled={isLoading}
                        >
                            Search
                        </button>
                    </div>
                    <div className="grid lg:grid-cols-4 gap-4">

                        <Select
                            label="Filter by Status"
                            name="status"
                            value={filters.status}
                            options={STATUS_OPTIONS}
                            onChange={handleFilterChange}
                        />
                        <Select
                            label="Filter by GRM"
                            name="grm"
                            value={filters.grm}
                            options={grmOptions}
                            onChange={handleFilterChange}
                        />
                        <Select
                            label="Filter by Model"
                            name="model"
                            value={filters.model}
                            options={modelOptions}
                            onChange={handleFilterChange}
                        />
                        <Input
                            label="Filter by Month"
                            type="month"
                            name="month"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        />
                    </div>
                </div>

                {/* Team Performance */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="table-style">
                        <table className="table-fixed min-w-350 text-sm">
                            <thead>
                                <tr>
                                    <td >CLOSED</td>
                                    <td >TARGET RELEASE</td>
                                    <td>VARIANT</td>
                                    <td>UNIT</td>
                                    <td>COLOR</td>
                                    <td>CS NUMBER</td>
                                    <td>TRANSACTION</td>
                                    <td>BANK</td>
                                    <td>CLIENT</td>
                                    <td>GRM</td>
                                    <td>STATUS</td>
                                    <td>REMARKS</td>
                                    <td>MONTH START</td>
                                    <td>ACTIONS</td>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr>
                                        <td colSpan={14} className="text-center py-6">Loading pipeline data...</td>
                                    </tr>
                                )}

                                {!isLoading && data?.map((sale, index) => (
                                    <tr key={sale?.id}>
                                        <td>{((pagination.currentPage - 1) * pagination.pageSize) + index + 1}</td>
                                        <td>{sale?.targetReleased ? sale?.targetReleased : '-'}</td>
                                        <td>{sale?.unit?.variant?.name ? sale?.unit?.variant?.name : '-'}</td>
                                        <td>{sale?.unit.name ? sale?.unit.name : '-'}</td>
                                        <td>{sale?.color ? sale?.color : '-'}</td>
                                        <td>{sale?.csNumber ? sale?.csNumber : '-'}</td>
                                        <td>{sale?.transaction ? sale?.transaction : '-'}</td>
                                        <td>{sale?.bank ? sale?.bank : '-'}</td>
                                        <td>{sale?.client ? sale?.client : '-'}</td>
                                        <td>{sale?.team?.teamLeader ? sale?.team?.teamLeader : '-'}</td>
                                        <td>
                                            <p className={`
                                                ${sale?.status === 'Sold' ? 'text-green-600 bg-green-600/20' :
                                                    sale?.status === 'For Release' ? 'text-blue-600 bg-blue-600/20' :
                                                        sale?.status === 'w/ Payment' ? 'text-yellow-600 bg-yellow-600/20' :
                                                            'text-orange-600 bg-orange-600/20'
                                                } 
                                                rounded-full px-2 whitespace-nowrap w-fit
                                            `}>
                                                {sale?.status ? sale?.status : '-'}
                                            </p>
                                        </td>
                                        <td>{sale?.remarks ? sale?.remarks : '-'}</td>
                                        <td>{sale?.monthStart ? sale?.monthStart : '-'}</td>
                                        <td>
                                            <div className="flex gap-4 items-center justify-center">
                                                <button
                                                    className="cursor-pointer"
                                                    onClick={() => handleEdit(sale?.id)}
                                                >
                                                    <Pen size={16} />
                                                </button>
                                                <button
                                                    className="cursor-pointer"
                                                    onClick={() => handleDelete(sale?.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {!isLoading && data?.length === 0 && (
                                    <tr>
                                        <td colSpan={14} className="text-center py-6">No pipeline data found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-gray-300 px-4 py-3">
                        <p className="text-sm text-gray-600">
                            Page {pagination.totalPages === 0 ? 1 : pagination.currentPage} of {pagination.totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                className="btn rounded-xl border border-gray-300 disabled:opacity-50"
                                onClick={handlePreviousPage}
                                disabled={isLoading || currentPage <= 1}
                            >
                                Previous
                            </button>
                            <button
                                className="btn rounded-xl border border-gray-300 disabled:opacity-50"
                                onClick={handleNextPage}
                                disabled={isLoading || totalPages === 0 || currentPage >= totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Model */}
            {showCreate &&
                <CreatePipeline
                    onClose={() => setshowCreate(false)}
                    runAfter={refreshCurrentPage}
                />
            }

            {/* Update Model */}
            {showUpdate &&
                <UpdatePipeline
                    pipelineId={pipelineId}
                    onClose={() => setShowUpdate(false)}
                    runAfter={refreshCurrentPage}
                />
            }

            {/* Delete Model */}
            {showDelete &&
                <DeletePipeline
                    pipelineId={pipelineId}
                    onClose={() => setShowDelete(false)}
                    runAfter={refreshCurrentPage}
                />
            }
        </div >
    )
}
