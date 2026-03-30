import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileDown, FileText, GitBranch, LayoutDashboard, LogOut, Menu, SquareCheckBig, TrendingUp, Users, X } from "lucide-react";
import { useContext, useState } from "react";
import { UserContext } from "../context/AuthProvider";
import { handleLogout } from "../services/userServices";

export default function Sidemenu() {

    const { setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const location = useLocation();

    const [slidemenu, setSlideMenu] = useState(false);

    const menu = [
        {
            Icon: LayoutDashboard,
            path: '/app/dashboard',
            name: 'Dashboard',
        },
        {
            Icon: FileText,
            path: '/app/vehicle-reports',
            name: 'Vehicle & Reservation Reports',
        },
        {
            Icon: SquareCheckBig,
            path: '/app/applications-approvals',
            name: 'Applications & Approvals',
        },
        {
            Icon: TrendingUp,
            path: '/app/vehicle-sales',
            name: 'Vehicle Sales Per group',
        },
        {
            Icon: GitBranch,
            path: '/app/pipeline',
            name: 'Pipeline',
        },
        {
            Icon: FileDown,
            path: '/app/release-plan',
            name: 'Release Plan',
        },
        {
            Icon: Users,
            path: '/app/team',
            name: 'Team',
        },
    ];

    const handleSubmit = async () => {
        try {
            const { success } = await handleLogout();
            if (success) {
                setUser(null);
                navigate('/');
                return;
            }
        } catch (error) {
            console.error('Error on handleLogout:', error);
        }
    }

    return (
        <>
            <div className={`
                flex flex-col bg-nissan-black max-w-60 min-w-60 min-h-screen
                max-lg:fixed ${slidemenu ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'} duration-200 z-100
            `}>

                {/* Header */}
                <div className="border-b border-nissan-darkGray p-4">
                    <p className="text-xl text-nissan-red font-bold">Nissan</p>
                    <p className="text-sm text-nissan-gray">Analytics System</p>
                </div>

                {/* Menu */}
                <div className="grow border-b border-nissan-darkGray p-4 space-y-2">

                    {menu.map((m, index) => {

                        let activate = false;

                        if (location.pathname === m.path) activate = true;

                        return (
                            <Link
                                key={index}
                                to={m.path}
                                className={`group flex items-center gap-4 text-nissan-gray w-full text-left p-2 rounded-lg duration-200
                                ${activate ? 'bg-nissan-darkGray' : 'hover:bg-nissan-darkGray'}
                            `}
                            >
                                <m.Icon
                                    size={20}
                                    className={` duration-200 shrink-0
                                    ${activate ? 'text-nissan-red' : 'group-hover:text-nissan-red'}
                                `}
                                />
                                <p className={` duration-200 text-sm ${activate ? 'text-white' : 'group-hover:text-white'}`}>{m.name}</p>
                            </Link>
                        )
                    })}
                </div>

                {/* Logout */}
                <div className="border-b border-nissan-darkGray p-4">
                    <button
                        className="btn btn-ghost border-0 shadow-none hover:bg-nissan-darkGray hover:text-white text-nissan-lightGray w-full rounded-lg justify-start gap-4"
                        onClick={handleSubmit}
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>

                {/* Footer */}
                <div className="p-4">
                    <p className="text-nissan-gray text-sm">
                        © 2026 Automotive Sales Executive Dashboard
                    </p>
                </div>
            </div>
            <button
                className="lg:hidden fixed top-4 left-4 border-0 shadow-none btn btn-square bg-nissan-red text-white rounded-lg z-100"
                onClick={() => setSlideMenu(prev => !prev)}
            >
                {slidemenu ? <X size={20} /> : <Menu size={20} />}
            </button>
        </>
    )
}