import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    let history = useHistory();
    const [open, setOpen] = useState(true)

    const handleLogout = async () => {
        localStorage.removeItem("token");
        history.push("/login");
        window.location.reload();
    }
    const host = "http://localhost:5000";
    const [info, setinfo] = useState({
        name: "", pic: null
    })

    const fetchuser = async () => {
        const response = await fetch(`${host}/api/user/getuser`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token")
            }
        });
        const json = await response.json();
        console.log(json.user.name);
        setinfo({
            name: json.user.name, pic: json.user.pic
        })
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            fetchuser();
        }
    }, [])



    return (
        <>
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </DisclosureButton>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="h-8 w-auto"
                                        src="https://cdn.dribbble.com/users/267404/screenshots/3713416/talkup.png"
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        <Link to="/"
                                            className={classNames(
                                                'bg-gray-900 text-white cursor-pointer',
                                                'rounded-md px-3 py-2 text-sm font-medium',
                                            )}
                                        >
                                            Home
                                        </Link>
                                        <a
                                            className={classNames(
                                                'bg-gray-900 text-white cursor-pointer',
                                                'rounded-md px-3 py-2 text-sm font-medium',
                                            )}
                                        >
                                            About
                                        </a>
                                        <a
                                            className={classNames(
                                                'bg-gray-900 text-white cursor-pointer',
                                                'rounded-md px-3 py-2 text-sm font-medium',
                                            )}
                                        >
                                            {localStorage.getItem("token") ? info.name : "User"}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                                {/* Profile dropdown */}
                                {localStorage.getItem("token") ?
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src={info.pic}
                                                    alt=""
                                                />
                                            </MenuButton>
                                        </div>
                                        <Transition
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <MenuItem>
                                                    {({ focus }) => (
                                                        <Link to="/account"
                                                            href="#"
                                                            className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Your Profile
                                                        </Link>
                                                    )}
                                                </MenuItem>
                                                <MenuItem>
                                                    {({ focus }) => (
                                                        <a onClick={handleLogout}
                                                            href="#"
                                                            className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Sign out
                                                        </a>
                                                    )}
                                                </MenuItem>
                                            </MenuItems>
                                        </Transition>
                                    </Menu> : <Menu>
                                        <div style={{ display: "flex" }}>
                                            <div className='mr-2'>
                                                <Link
                                                    type="submit" to="/signup"
                                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    Signup
                                                </Link>
                                            </div>

                                            <div className='ml-2'>
                                                <Link
                                                    type="submit" to="/login"
                                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    login
                                                </Link>
                                            </div>
                                        </div>
                                    </Menu>}
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            <DisclosureButton

                                as="a" href='/'

                                className={classNames(
                                    'bg-gray-900 text-white cursor-pointer',
                                    'block rounded-md px-3 py-2 text-base font-medium',
                                )}

                            >
                                Home

                            </DisclosureButton>
                            <DisclosureButton

                                as="Link"

                                className={classNames(
                                    'bg-gray-900 text-white cursor-pointer',
                                    'block rounded-md px-3 py-2 text-base font-medium',
                                )}

                            >
                                About

                            </DisclosureButton>
                            <DisclosureButton

                                as="a"

                                className={classNames(
                                    'bg-gray-900 text-white cursor-pointer',
                                    'block rounded-md px-3 py-2 text-base font-medium',
                                )}

                            >
                                {localStorage.getItem("token") ? info.name : "User"}

                            </DisclosureButton>

                        </div>
                    </DisclosurePanel>
                </>

            )}
        </Disclosure>
        
        </>
    )
}
