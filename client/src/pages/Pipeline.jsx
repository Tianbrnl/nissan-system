import { FileDown, Pen, Plus, Trash2 } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import { useState } from "react";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "../components/ui/ui-modal";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import { useForm } from "../hooks/form";

export default function Pipeline() {

    const { formData, handleInputChange } = useForm({
        closed: '',
        targetReleased: '',
        variant: '',
        model: '',
        color: '',
        csNumber: '',
        transaction: '',
        bank: '',
        client: '',
        grm: '',
        status: '',
        monthStart: '',
        remarks: '',
    });

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const totals = {
        entries: 3,
        sold: 1,
        forRelease: 1,
        bankApproval: 1,
    }

    const pipeline = [
        {
            id: 1,
            closed: 'Jan 15, 2026',
            targetRelease: 'Fed 1, 2026',
            variantUnit: 'Nissan Patrol',
            model: 'VL 4X4 AT',
            color: 'Pearl White',
            csNumber: 'CS-2026-001',
            transaction: 'Financing',
            bank: 'BDO',
            client: 'John Doe',
            grm: 'Mike',
            status: 'For Release',
            remarks: 'Pending Documents',
            monthStart: 'Jan 2026'
        },
        {
            id: 2,
            closed: 'Jan 20, 2026',
            targetRelease: 'Fed 10, 2026',
            variantUnit: 'Nissan Kicks',
            model: 'VL 4X4 AT',
            color: 'Midnight Black',
            csNumber: 'CS-2026-002',
            transaction: 'Cash',
            bank: null,
            client: 'Jane Smith',
            grm: 'Jhoven',
            status: 'Sold',
            remarks: 'Compelete',
            monthStart: 'Jan 2026'
        },
        {
            id: 3,
            closed: 'Feb 5, 2026',
            targetRelease: 'Fed 20, 2026',
            variantUnit: 'Nissan Terra',
            model: 'VL 4X4 AT',
            color: 'Silver Metallic',
            csNumber: 'CS-2026-003',
            transaction: 'Bank OP',
            bank: 'BPI',
            client: 'Mark Johnson',
            grm: 'Jayr',
            status: 'For Bank Approval',
            remarks: 'Awaiting bank response',
            monthStart: 'Feb 2026'
        }
    ]

    const handleSubmit = () => {
        console.log(formData);
    }

    const handleEdit = (id) => {
        console.log(id);
        setShowEdit(true);
    }

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
                            onClick={() => setShowAdd(true)}
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
                                    <td>VARIANT UNIT</td>
                                    <td>MODEL</td>
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
                                {pipeline?.map(sale => (
                                    <tr key={sale?.id}>
                                        <td>{sale?.closed ? sale?.closed : '-'}</td>
                                        <td>{sale?.targetRelease ? sale?.targetRelease : '-'}</td>
                                        <td>{sale?.variantUnit ? sale?.variantUnit : '-'}</td>
                                        <td>{sale?.model ? sale?.model : '-'}</td>
                                        <td>{sale?.color ? sale?.color : '-'}</td>
                                        <td>{sale?.csNumber ? sale?.csNumber : '-'}</td>
                                        <td>{sale?.transaction ? sale?.transaction : '-'}</td>
                                        <td>{sale?.bank ? sale?.bank : '-'}</td>
                                        <td>{sale?.client ? sale?.client : '-'}</td>
                                        <td>{sale?.grm ? sale?.grm : '-'}</td>
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

            {/* Add Model */}
            <ModalBackground show={showAdd}>
                <Modal maxWidth={800}>
                    <div className="flex flex-col gap-4">
                        <ModalHeader
                            title="Add Pipeline Entry"
                            subTitle="Enter all transaction details"
                            onClose={() => setShowAdd(false)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Closed"
                                type="date"
                                name="closed"
                                required={true}
                                value={formData?.closed}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Target Released Date"
                                type="date"
                                name="targetReleased"
                                required={true}
                                value={formData?.targetReleased}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Variant Unit"
                                placeholder="Select Variant"
                                name="variant"
                                required={true}
                                value={formData?.variant}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Model"
                                placeholder="Select Model"
                                name="model"
                                required={true}
                                value={formData?.model}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Color"
                                placeholder="e.g. Pearl White"
                                name="color"
                                required={true}
                                value={formData?.color}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="CS Number"
                                placeholder="e.g. CS-2026-001"
                                name="csNumber"
                                required={true}
                                value={formData?.csNumber}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Transaction"
                                placeholder="Select Transaction"
                                name="transaction"
                                options={[
                                    { value: 'Cash', name: 'Cash' },
                                    { value: 'bank OP', name: 'bank OP' },
                                    { value: 'Financing', name: 'Financing' }
                                ]}
                                required={true}
                                value={formData?.transaction}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Bank"
                                placeholder={formData?.transaction === 'Cash' ? "N/A for Cash" : "e.g. BDO, BPI"}
                                name="bank"
                                required={formData?.transaction !== 'Cash'}
                                disabled={formData?.transaction === 'Cash'}
                                value={formData?.bank}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Client"
                                placeholder="Client name"
                                name="client"
                                required={true}
                                value={formData?.client}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="GRM"
                                placeholder="Select GRM"
                                name="grm"
                                required={true}
                                value={formData?.grm}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Status"
                                placeholder="Select Status"
                                name="status"
                                options={[
                                    { value: "Sold", name: "Sold" },
                                    { value: "For Release", name: "For Release" },
                                    { value: "w/ Payment", name: "w/ Payment" },
                                    { value: "For Bank Approval", name: "For Bank Approval" }
                                ]}
                                required={true}
                                value={formData?.status}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Month Start"
                                type="date"
                                name="monthStart"
                                required={true}
                                value={formData?.monthStart}
                                onChange={handleInputChange}
                            />
                        </div>

                        <Textarea
                            label="Remarks"
                            name="remarks"
                            placeholder="Additional notes or comments"
                            value={formData?.remarks}
                            onChange={handleInputChange}
                        />

                        <ModalFooter
                            submitLabel='Add Entry'
                            onClose={() => setShowAdd(false)}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </Modal>
            </ModalBackground>

            {/* Edit Model */}
            <ModalBackground show={showEdit}>
                <Modal maxWidth={800}>
                    <div className="flex flex-col gap-4">
                        <ModalHeader
                            title="Edit Pipeline Entry"
                            subTitle="Update transaction details"
                            onClose={() => setShowEdit(false)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Closed"
                                type="date"
                                name="closed"
                                required={true}
                                value={formData?.closed}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Target Released Date"
                                type="date"
                                name="targetReleased"
                                required={true}
                                value={formData?.targetReleased}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Variant Unit"
                                placeholder="Select Variant"
                                name="variant"
                                required={true}
                                value={formData?.variant}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Model"
                                placeholder="Select Model"
                                name="model"
                                required={true}
                                value={formData?.model}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Color"
                                placeholder="e.g. Pearl White"
                                name="color"
                                required={true}
                                value={formData?.color}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="CS Number"
                                placeholder="e.g. CS-2026-001"
                                name="csNumber"
                                required={true}
                                value={formData?.csNumber}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Transaction"
                                placeholder="Select Transaction"
                                name="transaction"
                                options={[
                                    { value: 'Cash', name: 'Cash' },
                                    { value: 'bank OP', name: 'bank OP' },
                                    { value: 'Financing', name: 'Financing' }
                                ]}
                                required={true}
                                value={formData?.transaction}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Bank"
                                placeholder={formData?.transaction === 'Cash' ? "N/A for Cash" : "e.g. BDO, BPI"}
                                name="bank"
                                required={formData?.transaction !== 'Cash'}
                                disabled={formData?.transaction === 'Cash'}
                                value={formData?.bank}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Client"
                                placeholder="Client name"
                                name="client"
                                required={true}
                                value={formData?.client}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="GRM"
                                placeholder="Select GRM"
                                name="grm"
                                required={true}
                                value={formData?.grm}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Status"
                                placeholder="Select Status"
                                name="status"
                                options={[
                                    { value: "Sold", name: "Sold" },
                                    { value: "For Release", name: "For Release" },
                                    { value: "w/ Payment", name: "w/ Payment" },
                                    { value: "For Bank Approval", name: "For Bank Approval" }
                                ]}
                                required={true}
                                value={formData?.status}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Month Start"
                                type="date"
                                name="monthStart"
                                required={true}
                                value={formData?.monthStart}
                                onChange={handleInputChange}
                            />
                        </div>

                        <Textarea
                            label="Remarks"
                            name="remarks"
                            placeholder="Additional notes or comments"
                            value={formData?.remarks}
                            onChange={handleInputChange}
                        />

                        <ModalFooter
                            submitLabel='Save Changes'
                            onClose={() => setShowEdit(false)}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </Modal>
            </ModalBackground>

        </div >
    )
}