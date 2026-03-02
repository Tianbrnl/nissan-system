import Input from "../components/ui/Input";
import { ConfirmButton, LinkButton } from "../components/ui/ui-buttons";
import { Modal } from "../components/ui/ui-modal";
import { useForm } from "../hooks/form";

export default function Login() {

    const { formData, handleInputChange } = useForm({
        email: '',
        password: ''
    });

    return (
        <div className="flex-center flex-col gap-4 bg-gray-100 h-screen">
            <h3 className="flex-center w-16 h-16 bg-nissan-red text-white rounded-xl font-bold">N</h3>
            <h2 className="font-bold">Nissan Analytics</h2>
            <p className="text-gray-500">Automotive Sales Reporting System</p>
            <Modal>
                <div className="flex flex-col gap-6">
                    <h3 className="font-bold">Login</h3>
                    <Input
                        label="Email Address"
                        placeholder="your.email@email.com"
                        name="email"
                        type="email"
                        required={true}
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        name="password"
                        type="password"
                        required={true}
                        value={formData.email}
                        onChange={handleInputChange}
                    />

                    <ConfirmButton>
                        Login
                    </ConfirmButton>
                    <LinkButton>
                        Forgot Password?
                    </LinkButton>
                </div>
            </Modal>
            <p className="text-gray-500">System accounts only. No self-registration available.</p>
        </div>
    )
}