import { FileDown, Pen, Plus, Trash2 } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import { useEffect, useState } from "react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import CreatePipeline from "../components/Pipeline/CreatePipeline";
import UpdatePipeline from "../components/Pipeline/UpdatePipeline";
import { readAllPipeline } from "../services/pipelineServices";
import DeletePipeline from "../components/Pipeline/DeletePipeline";

export default function Pipeline() {

    const [data, setData] = useState([]);

    const [showCreate, setshowCreate] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [pipelineId, setPipelineId] = useState(null);

    const totals = {
        entries: 3,
        sold: 1,
        forRelease: 1,
        bankApproval: 1,
    }

    const handleEdit = (id) => {
        setPipelineId(id);
        setShowUpdate(true);
    }

    const handleDelete = (id) => {
        setPipelineId(id);
        setShowDelete(true);

    }

    const loadTable = async () => {
        const { success, message, pipelines } = await readAllPipeline();
        if (success) {
            return setData(pipelines);
        }
        console.error(message);
    }

    useEffect(() => {
        try {
            queueMicrotask(() => {
                loadTable();
            })
        } catch (error) {
            console.error(error);
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
                        <button className="btn bg-nissan-red text-white rounded-xl">
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

                {/* Search */}
                <div className="space-y-4 rounded-xl border border-gray-300 p-4">
                    <div className="flex gap-4">
                        <div className="grow">
                            <Input
                                placeholder="Search by CS Number, Client, or Variant..."
                            />
                        </div>
                        <button className="btn bg-nissan-red rounded-xl text-white">Search</button>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-4">
                        <Select
                            label="Filter by Status"
                            placeholder="All Statuses"
                        />
                        <Select
                            label="Filter by GRM"
                            placeholder="All GRMs"
                        />
                        <Select
                            label="Filter by Model"
                            placeholder="All Models"
                        />
                    </div>
                </div>

                {/* Team Performance */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="table-style">
                        <table>
                            <thead>
                                <tr>
                                    <td>CLOSED</td>
                                    <td>TARGET RELEASE</td>
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
                                {data?.map((sale, index) => (
                                    <tr key={sale?.id}>
                                        <td>{index + 1}</td>
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
                            </tbody>
                        </table>
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
            </div>

            {/* Create Model */}
            {showCreate &&
                <CreatePipeline
                    onClose={() => setshowCreate(false)}
                    runAfter={loadTable}
                />
            }

            {/* Update Model */}
            {showUpdate &&
                <UpdatePipeline
                    pipelineId={pipelineId}
                    onClose={() => setShowUpdate(false)}
                    runAfter={loadTable}
                />
            }

            {/* Delete Model */}
            {showDelete &&
                <DeletePipeline
                    pipelineId={pipelineId}
                    onClose={() => setShowDelete(false)}
                    runAfter={loadTable}
                />
            }
        </div >
    )
}