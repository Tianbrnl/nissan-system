import Input from "../components/ui/Input";
import { ConfirmButton } from "../components/ui/ui-buttons";
import { useForm } from "../hooks/form";
import { toast } from "react-toastify";
import { handleChangePassword } from "../services/userServices";
import { useState } from "react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";

export default function Settings() {

    const { formData, setFormData, handleInputChange } = useForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Handles the form submission for changing the user's password.
     * It calls the handleChangePassword function from userServices.js and handles the response.
     * If the password change is successful, it will display a success toast with the response message.
     * If the password change is unsuccessful, it will display an error toast with the response message.
     * It will also set the errorMessage state to the response message.
     */
    /*******  ca99389e-face-47d2-a455-1ccb24730f06  *******/
    const handleSubmit = async () => {
        try {
            setErrorMessage('');
            const { success, message } = await handleChangePassword(formData);
            if (success) {
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                toast.success(message);
                return;
            };
            setErrorMessage(message);
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow p-8 space-y-8 overflow-auto">
                <section className="flex justify-between items-center">
                    <div>
                        <PageTitle>Settings</PageTitle>
                        <PageSubTitle>Change password</PageSubTitle>
                    </div>
                </section>
                <section className="flex-center">
                    <div className="w-[450px]">
                        <div className="flex flex-col gap-6">
                            <Input
                                label="Current Password"
                                placeholder="••••••••"
                                name="currentPassword"
                                type="password"
                                required={true}
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                            />

                            <Input
                                label="New Password"
                                placeholder="••••••••"
                                name="newPassword"
                                type="password"
                                required={true}
                                value={formData.newPassword}
                                onChange={handleInputChange}
                            />

                            <Input
                                label="Confirm Password"
                                placeholder="••••••••"
                                name="confirmPassword"
                                type="password"
                                required={true}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />

                            {errorMessage &&
                                <div className="flex-center rounded-xl bg-red-100 text-red-500 text-sm p-4 whitespace-pre-line">
                                    {errorMessage}
                                </div>
                            }

                            <ConfirmButton
                                onClick={handleSubmit}
                            >
                                Change Password
                            </ConfirmButton>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}