/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useForm } from "../../hooks/form";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "../ui/ui-modal";
import { useState } from "react";
import { readAllGrm, readTeamMembers } from "../../services/teamServices";
import { readOnePipeline, updatePipeline } from "../../services/pipelineServices";
import { toast } from "react-toastify"
import { selectReadAllVariant, selectReadUnitVariant } from "../../services/variantServices";
import { cleanDate } from "../../utils/format";

export default function UpdatePipeline({ pipelineId, onClose = () => { }, runAfter = () => { } }) {
    const [variants, setVariants] = useState([]);
    const [units, setUnits] = useState([]);
    const [grm, setGrm] = useState([]);
    const [members, setMembers] = useState([]);


    const { formData, setFormData, handleInputChange } = useForm({
        targetReleased: '',
        variant: '',
        unit: '',
        color: '',
        csNumber: '',
        transaction: '',
        bank: '',
        client: '',
        grm: '',
        member: '',
        status: '',
        monthStart: '',
        remarks: '',
        appliedAt: '',
        approvedAppliedAt: '',
        approvedNotAppliedAt: '',
        availedAt: '',
        reservationAmount: '',
        reservedAt: ''
    });

    const handleSubmit = async () => {
        const { success, message } = await updatePipeline(pipelineId, formData);
        if (success) {
            runAfter();
            onClose();
            return toast.success(message);
        }
        toast.error(message);
    }

    const handleTeamChange = (event) => {
        const { value } = event.target;

        setFormData((prev) => ({
            ...prev,
            grm: value,
            member: ''
        }));
    };

    useEffect(() => {
        try {
            const load = async () => {
                const { success, message, pipeline } = await readOnePipeline(pipelineId);
                if (success) {
                    const p = pipeline.pipelines[0];
                    setFormData({
                        targetReleased: cleanDate(p.targetReleased),
                        variant: pipeline.variantId || "",
                        unit: p.unitId || "",
                        color: p.color || "",
                        csNumber: p.csNumber || "",
                        transaction: p.transaction || "",
                        bank: p.bank || "",
                        client: p.client || "",
                        grm: p.teamId || "",
                        member: p.memberId || "",
                        status: p.status || "",
                        monthStart: cleanDate(p.monthStart),
                        remarks: p.remarks || "",
                        appliedAt: cleanDate(p.appliedAt),
                        approvedAppliedAt: cleanDate(p.approvedAppliedAt),
                        approvedNotAppliedAt: cleanDate(p.approvedNotAppliedAt),
                        availedAt: cleanDate(p.availedAt),
                        reservationAmount: p.reservationAmount || "",
                        reservedAt: cleanDate(p.reservedAt),
                    });
                } else {
                    toast.error(message);
                }
            };
            const loadVariant = async () => {
                const { success, message, variants } = await selectReadAllVariant();
                if (success) return setVariants(variants);
                console.error(message);
            }
            const loadGrm = async () => {
                const { success, message, grms } = await readAllGrm();
                if (success) return setGrm(grms);
                console.error(message);
            }
            load();
            loadVariant();
            loadGrm();
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        try {
            const loadMembers = async () => {
                if (!formData.grm) {
                    setMembers([]);
                    return;
                }

                const { success, message, members: teamMembers } = await readTeamMembers(formData.grm);
                if (success) return setMembers(teamMembers);
                console.error(message);
            };

            loadMembers();
        } catch (error) {
            console.error(error);
        }
    }, [formData.grm]);

    useEffect(() => {
        try {
            const loadUnit = async () => {
                if (!formData.variant) return;

                const { success, message, units } = await selectReadUnitVariant(formData.variant);
                if (success) setUnits(units);
                else console.error(message);
            };

            loadUnit();
        } catch (error) {
            console.error(error);
        }
    }, [formData.variant]);
    return (
        <ModalBackground>
            <Modal maxWidth={800}>
                <div className="flex flex-col gap-4">
                    <ModalHeader
                        title="Update Pipeline Entry"
                        subTitle="Enter all transaction details"
                        onClose={onClose}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Target Released Date"
                            type="date"
                            name="targetReleased"
                            value={formData?.targetReleased}
                            onChange={handleInputChange}
                        />
                        <Select
                            label="Variant"
                            placeholder="Select Variant"
                            name="variant"
                            options={variants}
                            required={true}
                            value={formData?.variant}
                            onChange={handleInputChange}
                        />
                        <Select
                            label="Unit"
                            placeholder="Select Unit"
                            name="unit"
                            options={units}
                            required={true}
                            value={formData?.unit}
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
                            value={formData?.csNumber}
                            onChange={handleInputChange}
                        />
                        <Select
                            label="Transaction"
                            placeholder="Select Transaction"
                            name="transaction"
                            options={[
                                { value: 'Cash', name: 'Cash' },
                                { value: 'Bank OP', name: 'Bank OP' },
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
                            options={grm}
                            required={true}
                            value={formData?.grm}
                            onChange={handleTeamChange}
                        />
                        <Select
                            label="NPM"
                            placeholder={formData?.grm ? "Select Member" : "Select GRM first"}
                            name="member"
                            options={members}
                            required={false}
                            disabled={!formData?.grm}
                            value={formData?.member}
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

                    <hr className="border-gray-300" />

                    <p className="font-semibold">Applications & Approvals</p>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Applied"
                            type="date"
                            name="appliedAt"
                            value={formData?.appliedAt}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Approved (As Applied)"
                            type="date"
                            name="approvedAppliedAt"
                            value={formData?.approvedAppliedAt}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Approved (Not As Applied)"
                            type="date"
                            name="approvedNotAppliedAt"
                            value={formData?.approvedNotAppliedAt}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Availed"
                            type="date"
                            name="availedAt"
                            value={formData?.availedAt}
                            onChange={handleInputChange}
                        />
                    </div>

                    <hr className="border-gray-300" />

                    <p className="font-semibold">Reservation</p>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Amount"
                            type="number"
                            name="reservationAmount"
                            value={formData?.reservationAmount}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Reserved At"
                            type="date"
                            name="reservedAt"
                            value={formData?.reservedAt}
                            onChange={handleInputChange}
                        />
                    </div>

                    <ModalFooter
                        submitLabel='Update Entry'
                        onClose={onClose}
                        onSubmit={handleSubmit}
                    />
                </div>
            </Modal>
        </ModalBackground>
    )
}
