import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import { ConfirmButton, LinkButton } from "../components/ui/ui-buttons";
import { Modal } from "../components/ui/ui-modal";
import { useForm } from "../hooks/form";
import { toast } from "react-toastify";
import { fetchUser, handleLogin } from "../services/userServices";
import { UserContext } from "../context/AuthProvider";
import { useContext, useState } from "react";

export default function Login() {

    const { setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const { formData, handleInputChange } = useForm({
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        try {
            const { success, message } = await handleLogin(formData);
            if (success) {
                const result = await fetchUser();
                setUser(result);
                navigate('/app/dashboard');
                return
            }
            setErrorMessage(message);
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <div className="flex-center flex-col gap-4 bg-gray-100 h-screen">
            <h3 className="flex-center w-16 h-16 bg-nissan-red text-white rounded-xl font-bold">N</h3>
            <h2 className="font-bold">Nissan Analytics</h2>
            <p className="text-gray-500">Automotive Sales Reporting System</p>
            <Modal>
                <div className="flex flex-col gap-6">
                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        name="password"
                        type="password"
                        required={true}
                        value={formData.password}
                        onChange={handleInputChange}
                    />

                    {errorMessage &&
                        <div className="flex-center rounded-xl bg-red-100 text-red-500 text-sm p-4">
                            {errorMessage}
                        </div>
                    }

                    <ConfirmButton
                        onClick={handleSubmit}
                    >
                        Login
                    </ConfirmButton>
                </div>
            </Modal>
            <p className="text-gray-500">System accounts only. No self-registration available.</p>
        </div>
    )
}